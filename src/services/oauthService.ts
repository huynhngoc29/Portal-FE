import { api } from "./api";

export type AuthResponse = {
  access_token: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    isAdmin: boolean;
  };
};

export const oauthService = {
  async loginWithGoogle(credentialResponse: any): Promise<AuthResponse> {
    try {
      // Decode JWT token client-side to extract picture and send to backend
      const decoded = this.decodeGoogleToken(credentialResponse.credential);
      const response = await api.post<AuthResponse>("/auth/social-login", {
        provider: "google",
        email: credentialResponse.email || decoded?.email,
        fullName: credentialResponse.name || decoded?.name,
        idToken: credentialResponse.credential,
        picture: decoded?.picture,
      });

      return response.data;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  },

  async loginWithFacebook(response: any): Promise<AuthResponse> {
    try {
      const authResponse = await api.post<AuthResponse>("/auth/social-login", {
        provider: "facebook",
        email: response.email,
        fullName: response.name,
        idToken: response.accessToken,
        picture: response.picture,
      });

      return authResponse.data;
    } catch (error) {
      console.error("Facebook login error:", error);
      throw error;
    }
  },

  // Decode JWT token from Google (for client-side only, not secure!)
  decodeGoogleToken(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },
};
