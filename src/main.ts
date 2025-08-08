import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Form } from './app/componentes/solicitud/solicitud';
import { Login } from './app/componentes/login/login';
import { Formato } from './app/componentes/formato/formato';
import { PanelSolicitudes } from './app/componentes/panel-solicitudes/panel-solicitudes';
import { MatDialogRef } from '@angular/material/dialog';
import { PanelReportes } from './app/componentes/panel-reportes/panel-reportes';

bootstrapApplication(App, {
  providers: [
    // provideMatDialogRef(),
    provideHttpClient(withFetch()),
    provideRouter([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      { path: 'solicitud', component: Form },
      { path: 'panel-solicitud', component: PanelSolicitudes},
      { path: 'formato', component: Formato },
      { path: 'reportes', component: PanelReportes},
      { path: '**', redirectTo: 'login' }

    ]),
    // provideHttpClient(),
    
  ],
})
  .catch((err) => console.error(err));
