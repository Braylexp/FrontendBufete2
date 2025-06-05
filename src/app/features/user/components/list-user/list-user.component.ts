import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { UserService } from '../../../../domain/services/user/user.service';
import { User } from '../../../../domain/models/user.model';
import { SharedModule } from '../../../shared/shared.module';
import { NgFor, NgIf } from '@angular/common';
import { Role } from '../../../../domain/models/role.model';
import { RoleService } from '../../../../domain/services/role/role.service';

@Component({
  selector: 'app-list-user',
  imports: [CardComponent, NgFor, NgIf],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export class ListUserComponent {

  users: User[] = [];
  roles: Role[] = [];

  rolMap = new Map<number, string>();

  constructor(private svc: UserService, private rolsvc: RoleService) {

    this.svc.getUsers()
      .subscribe(
        {
          next: data => this.users = data,
          error: err => console.error('Error fetching items', err)
        }
      );
    this.rolsvc.listarRoles().subscribe({
      next: data => {
        this.roles = data;
        this.rolMap = new Map(data.map(r => [r.id, r.nombre]));
      }
    });
  }

  obtenerRol(rolId: number): string {
    console.log("rol_id:" + rolId);
    console.log(this.users);
    return this.rolMap.get(rolId) ?? 'Desconocido';
  }
}
