import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SignaturePad } from 'angular-signature-pad-v2';
import { SignaturePadModule } from 'angular-signature-pad-v2';
import { ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    SignaturePadModule
  ],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class Modal implements AfterViewInit {

  @ViewChild(SignaturePad) signaturePad!: SignaturePad;

  signaturePadOptions = {
    minWidth: 1,
    canvasWidth: 500,
    canvasHeight: 200,
    penColor: 'black'
  };

  firmaGuardada: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<Modal>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    this.signaturePad.clear();
  }
  // quiero poner la imagen que aqui obtengo en un card que tengo en el componente que habre esl mkodal que tiene este metodo:
  guardarFirma() {
    if (this.signaturePad.isEmpty()) {
      alert('Por favor, firme antes de continuar.');
    } else {
      this.firmaGuardada = this.signaturePad.toDataURL('image/png');
      console.log('Firma guardada:', this.firmaGuardada);
      const firmaDataUrl = this.signaturePad.toDataURL('image/png');
      this.dialogRef.close(firmaDataUrl); // Enviamos la firma al cerrar el modal
    }
  }

  borrarFirma() {
    this.signaturePad.clear();
    this.firmaGuardada = null;
  }
}


