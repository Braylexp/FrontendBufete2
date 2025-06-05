import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class RoleService {

  private baseUrlPermisos = environment.apiUrlPermisos;
  private baseUrlRol = environment.apiUrlRoles;

  private _roles = new BehaviorSubject<Role[]>([]);
  readonly roles$ = this._roles.asObservable();

  constructor(private http: HttpClient) { }

  getPermissions(): Observable<Permission[]> {
    /* return this.http.get<Permission[]>(`${this.baseUrl}/permisos`); */
    return this.http.get<Permission[]>(`${this.baseUrlPermisos}`);
  }

  listarPermisos(): Observable<Permission[]> {
    /* return this.http.get<Permission[]>(`${this.baseUrl}/permisos`); */
    return this.http.get<Permission[]>(`${this.baseUrlPermisos}`);
  }

  listarRoles(): Observable<Role[]> {
    /* return this.http.get<Role[]>(`${this.baseUrl}/rol`); */
    const roles: Observable<Role[]> = this.http.get<Role[]>(`${this.baseUrlRol}`);

    const combine = combineLatest(roles, this.roles$).pipe(
      map(([roles, roles2]) => roles.concat(roles2))
    );
    return combine;
  }

  crearRol(nombre: string, permisos: string[]): Observable<Role> {
    return this.http.post<Role>(`${this.baseUrlRol}/rol`, { nombre, permisos });
  }

  actualizarPermisos(id: number, permisos: string[]): Observable<Role> {

    return this.http.put<Role>(`${this.baseUrlRol}/rol/${id}`, { permisos });
  }


  update(role: Role): Observable<Role> {
    const actualizar = this._roles.value.find(obj => obj.id === role.id)

    if(actualizar){
      actualizar.permisos = role.permisos;
    }

    return new Observable<Role>;
  }
  
  createRole(role: Role): Observable<Role> {
    const current = this._roles.value;

    this._roles.next([...current, role]);
    return new Observable<Role>;
  }
  /*
  updateRole(updated: Role) {
    const list = this._roles.value.map(r => r.name === updated.name ? updated : r);
    this._roles.next(list);
  }

  deleteRole(name: string) {
    const list = this._roles.value.filter(r => r.name !== name);
    this._roles.next(list);
  } */
}