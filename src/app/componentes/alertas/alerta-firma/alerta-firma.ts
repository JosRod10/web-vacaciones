import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alerta-firma',
  standalone: true,
  imports: [],
  templateUrl: './alerta-firma.html',
  styleUrl: './alerta-firma.css'
})
export class AlertaFirma {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AlertaFirma>, 
    private router: Router){}

  cerrar(): void {
      this.dialogRef.close();
  }

  firmar(){
    // const res = confirm('Seguro que quieres cerrar la sesión?');
    // if(res){
      localStorage.removeItem('Usuario');
      this,this.cerrar();
      this.router.navigate(['login']);
    // }else{
    //   return;
    // }
  }

}
