export type State = {
  isLoading: boolean;
  error: Record<string, any> | null;
  isExist: boolean;
  isExistChecked: boolean;
  accounts: [];
  txHash: string;
};
