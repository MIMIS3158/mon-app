import { register } from 'swiper/element/bundle';
register();

import { AppModule } from './app/app.module';
import { platformBrowser } from '@angular/platform-browser';

platformBrowser()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
