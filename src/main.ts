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
import { AuthGuard } from './app/guards/autenticacion-guard';
import { withHashLocation } from '@angular/router';

bootstrapApplication(App, {
  providers: [
    // provideMatDialogRef(),
    provideHttpClient(withFetch()),
    provideRouter([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', loadChildren: () => import('./app/componentes/login/login.module').then(m => m.LoginModule) },
      // { path: 'login', component: Login },
      { path: 'solicitud', loadChildren: () => import('./app/componentes/solicitud/solicitud.module').then(m => m.SolicitudModule), canActivate: [AuthGuard] },
      // { path: 'solicitud', component: Form },
      { path: 'panel-solicitud', loadChildren: () => import('./app/componentes/panel-solicitudes/panel-solicitudes.module').then(m => m.PanelSolicitudesModule), canActivate: [AuthGuard] },
      // { path: 'panel-solicitud', component: PanelSolicitudes},
      { path: 'formato', component: Formato },
      { path: 'reportes', loadChildren: () => import('./app/componentes/panel-reportes/panel-reportes.module').then(m => m.PanelReportesModule), canActivate: [AuthGuard] },
      // { path: 'reportes', component: PanelReportes},
      { path: '**', redirectTo: 'login' }

    ], withHashLocation()),
    // provideHttpClient(),
    
  ],
})
  .catch((err) => console.error(err));
