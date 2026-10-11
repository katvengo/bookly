import { bootstrapApplication } from '@angular/platform-browser';
import { Amplify } from 'aws-amplify';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err, 'Error bootstrapping the application'));
