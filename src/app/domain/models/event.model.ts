import { User } from "./user.model";

export interface Evento {
    id: string;
    titulo: string;
    tipo_evento_id: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    all_day: boolean;
    expediente_id: string;
    user: User;
}