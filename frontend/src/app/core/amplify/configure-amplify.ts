import { Amplify } from 'aws-amplify';
import { environment } from '../../../environments/environment';

const OUTPUTS_URL = '/amplify_outputs.json';

type CognitoEnvironment = {
  userPoolId: string;
  userPoolClientId: string;
  identityPoolId?: string;
  allowGuestAccess?: boolean;
};

function hasExistingCognitoConfig(
  cognito: CognitoEnvironment | undefined,
): cognito is CognitoEnvironment {
  return Boolean(cognito?.userPoolId?.trim() && cognito?.userPoolClientId?.trim());
}

/**
 * Configure Amplify Auth for an existing Cognito User Pool.
 * Matches: https://docs.amplify.aws/angular/build-a-backend/auth/use-existing-cognito-resources/
 *
 * Hosted UI is not required — custom Angular forms call signIn/signUp against this pool.
 */
function configureFromExistingCognito(cognito: CognitoEnvironment): void {
  const userPoolId = cognito.userPoolId.trim();
  const userPoolClientId = cognito.userPoolClientId.trim();
  const identityPoolId = cognito.identityPoolId?.trim();

  const userPoolConfig = {
    userPoolId,
    userPoolClientId,
    loginWith: {
      email: true,
    },
    signUpVerificationMethod: 'code' as const,
    userAttributes: {
      email: {
        required: true,
      },
    },
    passwordFormat: {
      minLength: 8,
      requireLowercase: true,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialCharacters: true,
    },
  };

  if (identityPoolId) {
    Amplify.configure({
      Auth: {
        Cognito: {
          ...userPoolConfig,
          identityPoolId,
          allowGuestAccess: Boolean(cognito.allowGuestAccess),
        },
      },
    });
    return;
  }

  Amplify.configure({
    Auth: {
      Cognito: userPoolConfig,
    },
  });
}

/**
 * Fallback: Gen 2 amplify_outputs.json written by sandbox / Hosting into frontend/public/.
 */
async function configureFromAmplifyOutputs(): Promise<void> {
  let response: Response;
  try {
    response = await fetch(OUTPUTS_URL, { cache: 'no-store' });
  } catch {
    throw new Error(
      `Could not load ${OUTPUTS_URL}. Either set environment.cognito.userPoolId + userPoolClientId, or run "npm run sandbox".`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `Missing Cognito config. Set userPoolId/userPoolClientId in src/environments/environment*.ts, ` +
        `or generate ${OUTPUTS_URL} with "npm run sandbox" (HTTP ${response.status}).`,
    );
  }

  const outputs: unknown = await response.json();
  if (!outputs || typeof outputs !== 'object' || !('version' in outputs)) {
    throw new Error(
      `${OUTPUTS_URL} is not a valid Amplify outputs file. Regenerate it with "npm run sandbox".`,
    );
  }

  Amplify.configure(outputs as Record<string, unknown>);
}

/**
 * Prefer explicit existing Cognito IDs (manual User Pool). Otherwise load amplify_outputs.json.
 */
export async function configureAmplify(): Promise<void> {
  if (hasExistingCognitoConfig(environment.cognito)) {
    configureFromExistingCognito(environment.cognito);
    return;
  }

  await configureFromAmplifyOutputs();
}
