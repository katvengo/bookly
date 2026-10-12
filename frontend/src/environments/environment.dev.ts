export const environment = {
  production: false,
  appName: 'Bookly',
  version: '1.0.0',
  cognito: {
    // Paste your existing Cognito User Pool + App client IDs (us-west-2).
    // Leave blank to fall back to frontend/public/amplify_outputs.json from sandbox.
    userPoolId: '',
    userPoolClientId: '',
    identityPoolId: '',
    allowGuestAccess: false,
  },
};
