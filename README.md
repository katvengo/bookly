# Bookly

Angular frontend with an AWS Amplify Gen 2 backend (Auth + Data).

## Custom login UI (not Cognito Hosted UI)

Yes — use **your own Angular login page**. Cognito is the user directory; Hosted UI is optional.

Verified against Amplify’s [Use existing Cognito resources](https://docs.amplify.aws/angular/build-a-backend/auth/use-existing-cognito-resources/) guide:

| Claim | Verdict |
| --- | --- |
| Custom forms + `signIn` / `signUp` / `confirmSignUp` talk to Cognito without Hosted UI | **Correct** — that guide configures the Amplify **client library** against your pool; it does not require Hosted UI |
| Paste your existing `userPoolId` + `userPoolClientId` into `Amplify.configure({ Auth: { Cognito: … }})` | **Correct** — “Use auth resources without an Amplify backend” |
| `referenceAuth(...)` for an Amplify backend that reuses console-created Cognito | **Correct** — but needs User Pool **and** Identity Pool + auth/unauth role ARNs |
| Keep using `defineAuth()` while also pointing the app at a different manual pool | **Incorrect** — `defineAuth` creates/manages a separate Amplify pool |

| Approach | What the user sees | Use when |
| --- | --- | --- |
| **Your forms + Amplify Auth APIs** | Your Angular UI | Preferred for this app |
| Amplify `<amplify-authenticator>` | Pre-built Amplify widget in your app | Fast prototype |
| Cognito **Hosted UI** | AWS-hosted page | Only if you want that redirect experience |

### Wire a User Pool you created in the Cognito console

1. In Cognito, create an **App client** with **no client secret** (public SPA client) and auth flows that allow Amplify (`ALLOW_USER_SRP_AUTH` / USER_PASSWORD as needed).
2. Put the IDs in `frontend/src/environments/environment.dev.ts` (and prod as needed):

```ts
cognito: {
  userPoolId: 'us-west-2_xxxxxxxx',
  userPoolClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
  identityPoolId: '', // only if you also created an Identity Pool
  allowGuestAccess: false,
}
```

3. Restart `npm start`. The app calls `Amplify.configure({ Auth: { Cognito: … }})` exactly as in the docs, then your form uses `signIn` / `signUp`.

If those env fields are left blank, the app falls back to `frontend/public/amplify_outputs.json` from `npm run sandbox`.

Docs:
- Existing Cognito: https://docs.amplify.aws/angular/build-a-backend/auth/use-existing-cognito-resources/
- Sign-in API: https://docs.amplify.aws/angular/build-a-backend/auth/connect-your-frontend/sign-in/
- Sign-up API: https://docs.amplify.aws/angular/build-a-backend/auth/connect-your-frontend/sign-up/

## Auth from scratch (recommended path)

Skip SSO if it is giving you trouble. Use IAM access keys in `us-west-2` (your account region).

### 1. Create an IAM user with Amplify permissions

In the AWS Console (region does not matter for IAM users):

1. **IAM** → **Users** → **Create user**
2. Attach the managed policy **`AmplifyBackendDeployFullAccess`**
   (`arn:aws:iam::aws:policy/service-role/AmplifyBackendDeployFullAccess`)
3. Create an **Access key** (CLI) and copy the access key ID + secret

### 2. Configure the AWS CLI

```bash
aws configure
```

| Prompt | Answer |
| --- | --- |
| AWS Access Key ID | your access key |
| AWS Secret Access Key | your secret |
| Default region name | `us-west-2` (must be a real region — never `default`) |
| Default output format | `json` (or press Enter) |

Verify:

```bash
aws sts get-caller-identity
aws configure get region
# should print us-west-2
```

### 3. Generate backend config (creates Cognito + amplify_outputs.json)

From the **repository root**:

```bash
npm install
npm run sandbox
```

Leave that process running. It writes:

`frontend/public/amplify_outputs.json`

That file is gitignored. The Angular app loads it at startup via `fetch('/amplify_outputs.json')` and calls `Amplify.configure(...)`.

### 4. Run the Angular app

In a second terminal:

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200/` and use **Create an Account**.

If `amplify_outputs.json` is missing, the app shows a clear “Amplify is not configured” page instead of failing later with `NoAmplifyContextError`.

A shape reference lives at `frontend/public/amplify.outputs.example.json` (do not rename it over the real outputs file).

### Why you saw `NoAmplifyContextError`

`signUp()` needs a global Amplify context from `Amplify.configure()`. That only works after `frontend/public/amplify_outputs.json` exists. Deleting that file (or never running sandbox / Hosting backend deploy) removes the config, so Auth has nothing to talk to.

## Optional: IAM Identity Center (SSO)

Only needed if you prefer SSO. Follow https://docs.amplify.aws/angular/start/account-setup/

- **SSO start URL** = Identity Center **AWS access portal URL** (`https://d-xxxx.awsapps.com/start`)
- **SSO registration scopes** = press Enter (default `sso:account:access`)
- Use region `us-west-2` for SSO region and CLI default client region

## Deploy (Amplify Hosting)

`amplify.yml` deploys the Gen 2 backend, writes outputs into `frontend/public/`, then builds Angular. Do not delete `amplify_outputs.json` from the build artifacts path; Hosting regenerates it each deploy.

## Troubleshooting

### `getaddrinfo ENOTFOUND ssm.default.amazonaws.com`

AWS region is literally `default`. Fix:

```bash
aws configure set region us-west-2
unset AWS_REGION AWS_DEFAULT_REGION
export AWS_REGION=us-west-2
```

### Sandbox region / bootstrap

First sandbox in a region may ask you to bootstrap CDK in the Amplify console. Complete that, then re-run `npm run sandbox`.
