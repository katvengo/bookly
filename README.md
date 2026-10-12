# Bookly

Angular frontend with an AWS Amplify Gen 2 backend (Auth + Data).

## Prerequisites

- Node.js 24.15+ (Amplify Hosting uses 24.21.0)
- An AWS account with local credentials (SSO or IAM access keys)
- IAM permissions that include `AmplifyBackendDeployFullAccess` (or equivalent)
- A real AWS region in your profile (for example `us-east-1`) — never the literal string `default`

Official Amplify account setup: https://docs.amplify.aws/angular/start/account-setup/

## First-time AWS SSO setup (what to enter for SSO start URL)

`aws configure sso` asks for **SSO start URL** *after* IAM Identity Center exists in your AWS account. If your account was never set up for SSO, cancel the CLI wizard (`Ctrl+C`) and create Identity Center first.

### 1. Enable IAM Identity Center in the AWS Console

1. Sign in to the [AWS Console](https://console.aws.amazon.com/) as the account root/admin.
2. Open **IAM Identity Center** and choose **Enable** (with AWS Organizations if prompted).
3. Follow Amplify’s CloudShell setup on the account-setup page (creates the `amplify-admin` user and `amplify-policy` permission set), **or** use the manual console steps on that same page.

### 2. Get the SSO start URL

It looks like:

```text
https://d-xxxxxxxxxx.awsapps.com/start
```

Get it from either place:

- **CloudShell** (after Amplify’s setup commands), run:

  ```bash
  response=$(aws sso-admin list-instances)
  ssoId=$(echo "$response" | jq '.Instances[0].IdentityStoreId' -r)
  printf "Start session url: https://%s.awsapps.com/start\n" "$ssoId"
  ```

- **Console:** IAM Identity Center → dashboard → **Settings summary** → **AWS access portal URL**

That value is what you paste for `SSO start URL:`.

### 3. Finish `aws configure sso`

Example answers (use *your* portal URL and region):

| Prompt | Example answer |
| --- | --- |
| SSO session name | `amplify-admin` |
| SSO start URL | `https://d-xxxxxxxxxx.awsapps.com/start` |
| SSO region | The region where Identity Center was enabled (often `us-east-1`) |
| SSO registration scopes | press Enter (default `sso:account:access`) |
| CLI default client Region | `us-east-1` (a real region — do **not** type `default`) |
| CLI profile name | `default` |

Complete the browser login / MFA when the CLI opens it. Set a password for `amplify-admin` in Identity Center if you have not already (Users → Reset password).

### Simpler alternative (no SSO)

If you prefer not to use Identity Center yet, create an IAM user with access keys, attach `AmplifyBackendDeployFullAccess`, then run `aws configure` (access key / secret / region). Skip `aws configure sso`.

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
