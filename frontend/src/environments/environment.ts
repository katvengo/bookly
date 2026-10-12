/**
 * Default environment. Angular fileReplacements swap this for
 * environment.dev.ts / environment.prod.ts during serve/build.
 *
 * For a Cognito User Pool you created in the AWS Console, fill in
 * userPoolId + userPoolClientId (see Amplify "use existing Cognito resources").
 * https://docs.amplify.aws/angular/build-a-backend/auth/use-existing-cognito-resources/
 */
export const environment = {
  production: false,
  appName: 'Bookly',
  version: '1.0.0',
  cognito: {
    userPoolId: '',
    userPoolClientId: '',
    /** Optional — only needed for Identity Pool / guest AWS credentials */
    identityPoolId: '',
    allowGuestAccess: false,
  },
};
