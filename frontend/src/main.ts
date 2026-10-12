import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { configureAmplify } from './app/core/amplify/configure-amplify';

async function main(): Promise<void> {
  try {
    await configureAmplify();
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Amplify failed to configure. Missing amplify_outputs.json.';
    console.error(message, error);
    document.body.innerHTML = `
      <main style="font-family: system-ui, sans-serif; max-width: 40rem; margin: 3rem auto; padding: 0 1rem; line-height: 1.5;">
        <h1>Amplify is not configured</h1>
        <p>${message}</p>
        <ol>
          <li>Preferred for a console-created User Pool: set <code>cognito.userPoolId</code> and <code>cognito.userPoolClientId</code> in <code>src/environments/environment.dev.ts</code>.</li>
          <li>Or generate <code>frontend/public/amplify_outputs.json</code> with <code>npm run sandbox</code> from the repo root.</li>
          <li>Restart <code>npm start</code> in <code>frontend/</code>.</li>
        </ol>
      </main>
    `;
    return;
  }

  await bootstrapApplication(App, appConfig);
}

main().catch((err) => console.error(err, 'Error bootstrapping the application'));
