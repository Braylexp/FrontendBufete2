import { Component } from '@angular/core';

import { SharedModule } from '../../../../features/shared/shared.module';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from '../../../shared/components/card/card.component';
import { UserService } from '../../../../domain/services/user/user.service';
import { Role } from '../../../../domain/models/role.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../domain/models/user.model';
import { RoleService } from '../../../../domain/services/role/role.service';

//import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-new-user',
  imports: [CardComponent, SharedModule, NgbDropdownModule],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent {
  count: number = 1000;
  form: FormGroup;
  roles: Role[] = [];
  users!: User;

  rolMap = new Map<number, string>();

  constructor(private svc: UserService, private fb: FormBuilder, private rolsvc: RoleService){
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      contraseña: ['', Validators.required],
      rol_id: ['', Validators.required],
    });

    this.rolsvc.listarRoles().subscribe({
      next: data => {
        this.roles = data;
        this.rolMap = new Map(data.map(r => [r.id, r.nombre]));
      }
    });
  }
  createUser() {
    const { nombre, apellido, email, contraseña, rol_id } = this.form.value;
    const rols = this.roles.find(obj => obj.id === Number.parseInt(rol_id)) as Role;
    console.log(this.roles);
    console.log(rols);
    const newUser: User ={id: this.count, nombre: nombre, apellido: apellido, email: email, contraseña: contraseña, rol: rols}
    this.form.reset({ nombre: '', apellido:'', email:'', contraseña:'', rol_id: '' });
    this.svc.crear(newUser)
      .subscribe(() => {
        this.form.reset({ nombre: '', apellido:'', email:'', contraseña:'', rol_id: '' });
      });
      this.count++;
  }

}

