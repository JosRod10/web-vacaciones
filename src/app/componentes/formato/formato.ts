import { Component, inject} from '@angular/core';
import {FormBuilder, Validators, FormsModule, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { MatGridList } from '@angular/material/grid-list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog } from '@angular/material/dialog';
import { Modal } from '../modal/modal';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from  '@angular/core' ;
import {MatIconModule} from '@angular/material/icon';
import { ApiServicio } from '../../servicios/api-servicio';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-formato',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatGridListModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './formato.html',
  styleUrl: './formato.css'
})
export class Formato {
  solicitudForm: FormGroup;
  items: any[] = [];
  firmaDataUrl: string | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private api: ApiServicio) {
    this.solicitudForm = this.fb.group({
      nombre: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      motivo: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  foods: Food[] = [
    {value: 'sistemas', viewValue: 'Sistemas'},
    {value: 'relinds', viewValue: 'Relaciones Industriales'},
    {value: 'compras', viewValue: 'Compras'},
    {value: 'ventas', viewValue: 'Ventas'},
    {value: 'conta', viewValue: 'Contabilidad'},
  ];

  isInvalid(field: string): boolean {
    const control = this.solicitudForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit() {
    this.solicitudForm.markAllAsTouched();
    if (this.solicitudForm.valid) {
      console.log('Solicitud enviada:', this.solicitudForm.value);
      // Aquí iría la lógica de envío (API, backend, etc.)
    }
  }


        ngOnInit(): void {
          this.api.getItems().subscribe(data => {
            // this.items = data;
          
          });
        }

        addItem(): void {
          const newItem = this.solicitudForm.value;
          this.api.addItem(newItem).subscribe(addedItem => {
            this.items.push(addedItem);
          });
        }

  abrirModal() {
    const dialogRef = this.dialog.open(Modal, {
      width: '600px',
      height: '400px',
      disableClose: false, // true para que no se cierre al hacer clic fuera
    });
    dialogRef.afterClosed().subscribe((resultado: string | null) => {
      if (resultado) {
        this.firmaDataUrl = resultado;
        
      }
    });
  }

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
}













  

  


