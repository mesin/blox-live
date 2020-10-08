export const SOCIAL_APPS: SocialApps = {
  google: { label: 'Google', connection: 'google-oauth2' },
  github: { label: 'Github', connection: 'github' },
  microsoft: { label: 'Microsoft', connection: 'windowslive' },
};

interface SocialApps {
  google: Record<string, string>;
  microsoft: Record<string, string>;
  github: Record<string, string>;
}

export const SORT_TYPE: Record<string, string> = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending'
};
