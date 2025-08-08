import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-solicitud-pendiente',
  standalone: true,
  imports: [],
  templateUrl: './solicitud-pendiente.html',
  styleUrl: './solicitud-pendiente.css'
})
export class SolicitudPendiente {

  constructor(public dialogRef: MatDialogRef<SolicitudPendiente>, private router: Router){}

  cerrar(): void {
      this.dialogRef.close();
  }

}
