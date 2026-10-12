# Bookly

Angular frontend with an AWS Amplify Gen 2 backend (Auth + Data).

## Prerequisites

- Node.js 24.15+ (Amplify Hosting uses 24.21.0)
- AWS CLI configured with a real region (for example `us-east-1`)
- IAM permissions that include `AmplifyBackendDeployFullAccess` (or equivalent)

## Local Amplify auth sandbox

From the repository root:

```bash
npm install
npm run sandbox
```

This runs `ampx sandbox` and writes `frontend/amplify_outputs.json`, which the Angular app imports from `frontend/src/main.ts`.

Then in another terminal:

```bash
cd frontend
npm install
npm start
```

### Fix: `getaddrinfo ENOTFOUND ssm.default.amazonaws.com`

Amplify is calling AWS SSM with region set to the literal string `default`, which is not a valid AWS region. The SDK then tries to resolve `ssm.default.amazonaws.com` and DNS fails.

Check your profile region:

```bash
aws configure get region
# or, for a named profile:
aws configure get region --profile YOUR_PROFILE
```

If that prints `default` (or is empty), set a real region:

```bash
aws configure set region us-east-1
# or:
aws configure set region us-east-1 --profile YOUR_PROFILE
```

Also check that shell env vars are not overriding the config:

```bash
echo "$AWS_REGION" "$AWS_DEFAULT_REGION"
# If either is "default", unset or fix it:
unset AWS_REGION AWS_DEFAULT_REGION
export AWS_REGION=us-east-1
```

You can inspect `~/.aws/config` and confirm it looks like:

```ini
[default]
region = us-east-1
```

not `region = default`.

Then re-run:

```bash
npm run sandbox
# or with an explicit profile:
npx ampx sandbox --profile YOUR_PROFILE --outputs-out-dir frontend
```

On first use in a region, Amplify may ask you to bootstrap the account in the AWS console before sandbox can deploy Cognito.

## Deploy

See `amplify.yml`. Hosting runs Gen 2 `pipeline-deploy`, writes outputs into `frontend/`, then builds the Angular app.
