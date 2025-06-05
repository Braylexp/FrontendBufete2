import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  crearEvento(titulo: string, fecha_inicio: Date, fecha_fin: Date, all_day:boolean,expediente_id: string, responsable_id: number): Observable<Event> {
    return this.http.post<Event>(`${this.baseUrl}/evento`, { titulo, fecha_inicio, fecha_fin, all_day, expediente_id, responsable_id });
  }

  listarEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/evento`);
  }

  eliminarEvento(id: Date){
    return this.http.delete<Evento>(`${this.baseUrl}/evento/${id}`);
  }

  actualizarEvento(id: number, titulo: string, fecha_inicio: Date, fecha_fin: Date, all_day:boolean,expediente_id: string, responsable_id: number){
    return this.http.put<Evento>(`${this.baseUrl}/evento/${id}`, { titulo, fecha_inicio, fecha_fin, all_day, expediente_id, responsable_id });
  }
}
