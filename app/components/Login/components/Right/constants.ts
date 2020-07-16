export const BUTTONS_TEXTS: ButtonTexts = [
  {
    socialApp: 'Log In with',
    account: 'Don’t have an account?',
    terms: 'logging in',
    switcher: 'Sign Up',
  },
  {
    socialApp: 'Sign Up with',
    account: 'Already have an account?',
    terms: 'signing up',
    switcher: 'Log In',
  },
];

type ButtonTexts = {
  socialApp: string;
  account: string;
  terms: string;
  switcher: string;
}[];
