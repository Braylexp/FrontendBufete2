import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Role } from '../../models/role.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = environment.apiUrl;
  private baseUrlRol = environment.apiUrlRoles;
  private baseUrlUsers = environment.apiUrlUser;


  private _users = new BehaviorSubject<User[]>([]);
  readonly users$ = this._users.asObservable();

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    /* return this.http.get<User[]>(`${this.baseUrl}/usuario`); */
    const roles: Observable<User[]> = this.http.get<User[]>(`${this.baseUrlUsers}`);
    const combine = combineLatest(roles, this.users$).pipe(
      map(([roles, roles2]) => roles.concat(roles2))
    );
    return combine;
  }

  getRoles(): Observable<Role[]> {
    /* return this.http.get<Role[]>(`${this.baseUrl}/rol`); */
    return this.http.get<Role[]>(`${this.baseUrlRol}`);
  }

  crearUsuario(nombre: string, apellido: string, email: string, contraseña: string, rol_id: number): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/usuario`, { nombre, apellido, email, contraseña, rol_id });
  }

  crear(role: User): Observable<User> {
    const current = this._users.value;
    this._users.next([...current, role]);
    return new Observable<User>;
  }
}
