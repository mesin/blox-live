export type State = {
  isLoading: boolean;
  isLoggedIn: boolean;
  idToken: string;
  error: null;
  userData: Record<string, any>;
};
