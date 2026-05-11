import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

function loadFacebookSdk() {
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID?.trim();
  if (!appId || appId === "YOUR_FACEBOOK_APP_ID_HERE") {
    return;
  }

  if (document.getElementById("facebook-jssdk")) {
    return;
  }

  window.fbAsyncInit = function () {
    window.FB?.init({
      appId,
      xfbml: true,
      version: "v18.0",
    });
  };

  const script = document.createElement("script");
  script.id = "facebook-jssdk";
  script.src =
    "https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v18.0";
  script.async = true;
  script.defer = true;

  const firstScript = document.getElementsByTagName("script")[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);
}

loadFacebookSdk();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
