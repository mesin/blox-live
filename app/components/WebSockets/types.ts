export type WebSocketState = {
  instance: Record<string, any> | null;
  idToken: string;
  isConnected: boolean;
  isLoading: boolean;
  error: Record<string, any> | null;
  data: Record<string, any> | null;
};
