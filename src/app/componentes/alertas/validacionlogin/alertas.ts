import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SignaturePad } from 'angular-signature-pad-v2';
import { SignaturePadModule } from 'angular-signature-pad-v2';
import { ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    MatButtonModule,
    SignaturePadModule],
  templateUrl: './alertas.html',
  styleUrl: './alertas.css'
})
export class Alertas {

  constructor(public dialogRef: MatDialogRef<Alertas>,){

  }
  cerrar(): void {
      this.dialogRef.close();
  }
}
