import { Role } from './role.model';

export interface User {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    contraseña: string;
    rol: Role;
}