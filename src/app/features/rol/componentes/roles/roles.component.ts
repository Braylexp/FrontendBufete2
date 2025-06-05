import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SharedModule } from '../../../../features/shared/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { RoleService } from '../../../../domain/services/role/role.service';
import { Role } from '../../../../domain/models/role.model';
import { Permission } from '../../../../domain/models/permission.model';
import { map } from 'rxjs';

interface EditableRol extends Role {
  editing: boolean;
  permisosSet: Set<string>;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    MatIconModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    CardComponent,
    SharedModule,
    NgbDropdownModule
  ],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {
  count: number = 1000;

  form: FormGroup;
  permisos: Permission[] = [];
  roles: EditableRol[] = [];

  permissions: Permission[] = [];

  constructor(private svc: RoleService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      permisos: [[''], Validators.required]
    });

    this.svc.getPermissions()
      .subscribe(
        {
          next: data => this.permissions = data,
          error: err => console.error('Error fetching items', err)
        }
      )
  }

  get permisosControl(): FormControl<string[]> {
    return this.form.get('permisos') as FormControl<string[]>;
  }
  ngOnInit() {
    this.loadPermisos();
    this.loadRoles();
  }

  private loadPermisos() {
    this.svc.listarPermisos().subscribe(ps => this.permisos = ps);
  }

  private loadRoles() {
    this.svc.listarRoles().subscribe(rs => {
      this.roles = rs.map(r => ({
        ...r,
        editing: false,
        permisosSet: new Set(r.permisos.map(p => p.nombre))
      }));
    });

  }

  createRole() {
    const { nombre, permisos } = this.form.value;

    this.svc.crearRol(nombre, permisos.map((nombre: string) => `${nombre}`))
      .subscribe(() => {
        /* this.form.reset({ nombre: '', permisos: [] }); */
        this.loadRoles();
      });
  }

  crear() {
    const { nombre, permisos } = this.form.value;
    var permisosaux: Permission[] = [];
    permisos.forEach((element: string) => {
      permisosaux.push(this.permisos.find(obj => obj.nombre === element) ?? { id: 0, nombre: "", descripcion: "" } as Permission);
    });
    const roleaux: Role = { id: this.count, nombre: nombre, permisos: permisosaux };
    this.form.reset({ nombre: '', permisos: [] });

    this.svc.createRole(roleaux)
      .subscribe(() => {
        this.form.controls['nombre'].reset();
        this.loadRoles();
      });
    this.count++;
  }

  toggleEdit(r: EditableRol) {
    if (r.editing) {
      const permisosArr = Array.from(r.permisosSet);
      console.log(r);
      console.log(permisosArr);

      const mod = this.roles.find(obj => obj.id === r.id);

      if (mod) {
        mod.permisosSet = r.permisosSet;
        var permisosaux: Permission[] = [];
        mod.permisosSet.forEach((element: string) => {
          permisosaux.push(this.permisos.find(obj => obj.nombre === element) ?? { id: 0, nombre: "", descripcion: "" } as Permission);
        });
        mod.permisos = permisosaux;
        this.svc.update(mod);
        r.editing = false;
        this.loadRoles();
      }
      /* 
              this.svc.actualizarPermisos(r.id, permisosArr).subscribe(() => {
                r.editing = false;
                this.loadRoles();
              }); */
    } else {
      r.editing = true;
    }
  }

  onPermisoToggle(permisoNombre: string, checked: boolean) {
    const control = this.form.get('permisos')!;
    const currentValue: string[] = control.value || [];

    if (checked) {
      if (!currentValue.includes(permisoNombre)) {
        control.setValue([...currentValue, permisoNombre]);
      }
    } else {
      control.setValue(currentValue.filter(nombre => nombre !== permisoNombre));
    }
  }

  onPermisoRowToggle(r: EditableRol, permisoNombre: string, checked: boolean) {
    if (checked) {
      r.permisosSet.add(permisoNombre);
    } else {
      r.permisosSet.delete(permisoNombre);
    }
  }
}