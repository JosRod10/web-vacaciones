import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginServices } from '../../../servicios/login';

@Component({
  selector: 'app-cerrarsesion',
  standalone: true,
  imports: [],
  templateUrl: './cerrarsesion.html',
  styleUrl: './cerrarsesion.css'
})
export class Cerrarsesion {

  constructor(public dialogRef: MatDialogRef<Cerrarsesion>, private router: Router, private authservice: LoginServices){}

  cerrar(): void {
      this.dialogRef.close();
  }

  cerrarSesion(){
    // const res = confirm('Seguro que quieres cerrar la sesión?');
    // if(res){
      // localStorage.removeItem('Usuario');
      this.authservice.logout();
      this,this.cerrar();
      this.router.navigate(['login']);
    // }else{
    //   return;
    // }
  }

}
