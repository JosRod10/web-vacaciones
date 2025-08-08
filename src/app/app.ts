import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Formato } from './componentes/formato/formato';
import { Login } from './componentes/login/login';
import { Form } from './componentes/solicitud/solicitud';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  protected title = 'Formato de Vacaciones';
}

