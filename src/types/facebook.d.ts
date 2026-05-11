// Facebook SDK Types
declare interface Window {
  fbAsyncInit?: () => void;
  FB?: {
    init: (config: any) => void;
    login: (callback: (response: any) => void, options?: any) => void;
    api: (
      path: string,
      options: any,
      callback: (response: any) => void,
    ) => void;
  };
  google?: {
    accounts: {
      id: {
        initialize: (config: any) => void;
        renderButton: (element: HTMLElement | null, options: any) => void;
      };
    };
  };
}
