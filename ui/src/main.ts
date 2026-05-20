import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import Clarity from '@microsoft/clarity';

Clarity.init('wuacmibvkv');

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
