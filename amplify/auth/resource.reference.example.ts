/**
 * Example only — copy into resource.ts when reusing console-created Cognito
 * with a full Amplify backend (Identity Pool + IAM roles required).
 *
 * https://docs.amplify.aws/angular/build-a-backend/auth/use-existing-cognito-resources/
 */
import { referenceAuth } from '@aws-amplify/backend';

export const auth = referenceAuth({
  userPoolId: 'us-west-2_xxxx',
  userPoolClientId: 'xxxx',
  identityPoolId: 'us-west-2:xxxx',
  authRoleArn: 'arn:aws:iam::xxxx:role/xxxx-authenticated',
  unauthRoleArn: 'arn:aws:iam::xxxx:role/xxxx-unauthenticated',
});
