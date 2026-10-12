import { defineAuth } from '@aws-amplify/backend';

/**
 * Default: Amplify-managed Cognito User Pool (email/password).
 *
 * If you created Cognito in the AWS Console and want the Amplify *backend*
 * (Data, etc.) to reuse it, replace this export with `referenceAuth({...})`
 * per https://docs.amplify.aws/angular/build-a-backend/auth/use-existing-cognito-resources/
 * (requires user pool, app client, identity pool, authRoleArn, unauthRoleArn).
 *
 * If you only need the Angular app to sign users in/up against a console-created
 * User Pool, leave this file as-is and set `environment.cognito.userPoolId` +
 * `userPoolClientId` in the frontend instead — Hosted UI is not required.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
