export type WizardState = {
  isLoading: boolean;
  error: Record<string, any> | null;
  wallet: Record<string, any> | null;
  network: string;
  account: Record<string, any> | null;
  depositData: Record<string, any> | null;
  isFinished: boolean;
};
