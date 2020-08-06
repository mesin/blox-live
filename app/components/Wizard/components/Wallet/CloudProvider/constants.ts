import awsImage from 'assets/images/logo-amazon.svg';
import azureImage from 'assets/images/logo-azure.svg';
import googleImage from 'assets/images/logo-google-cloud.svg';

export const CLOUD_PROVIDERS = [
  { label: 'aws', title: 'Amazon Web Server', image: awsImage, isDisabled: false },
  { label: 'azure', title: 'Microsoft Azure', image: azureImage, sticker: 'Coming Soon', isDisabled: true },
  { label: 'google', title: 'Google Cloud', image: googleImage, sticker: 'Coming Soon', isDisabled: true },
];
