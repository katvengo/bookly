#!/usr/bin/env node
/**
 * Fail fast when AWS region is missing or set to the literal string "default",
 * which produces: getaddrinfo ENOTFOUND ssm.default.amazonaws.com
 */
import { execFileSync } from 'node:child_process';

const profile = process.env.AWS_PROFILE;
const fromEnv = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || '';

function getConfiguredRegion() {
  try {
    const args = ['configure', 'get', 'region'];
    if (profile) {
      args.push('--profile', profile);
    }
    return execFileSync('aws', args, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

const region = fromEnv || getConfiguredRegion();

if (!region) {
  console.error(
    [
      'AWS region is not set.',
      'Set a real region before running the Amplify sandbox, for example:',
      '  aws configure set region us-east-1',
      '  export AWS_REGION=us-east-1',
    ].join('\n'),
  );
  process.exit(1);
}

if (region === 'default') {
  console.error(
    [
      `AWS region is set to "${region}", which is not a valid AWS region.`,
      'That causes: getaddrinfo ENOTFOUND ssm.default.amazonaws.com',
      '',
      'Fix it with a real region (example: us-east-1):',
      '  aws configure set region us-east-1',
      profile ? `  aws configure set region us-east-1 --profile ${profile}` : null,
      '  unset AWS_REGION AWS_DEFAULT_REGION',
      '  export AWS_REGION=us-east-1',
      '',
      'Also check ~/.aws/config for `region = default` and replace it.',
    ]
      .filter(Boolean)
      .join('\n'),
  );
  process.exit(1);
}

console.log(`AWS region OK: ${region}${profile ? ` (profile: ${profile})` : ''}`);
