import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'angular-calendar';
import { SharedModule } from '../../../shared/shared.module';
import { EventoData } from '../../utils/eventoData';

const exp: Array<string> = [
  'Caso Andres Sanchez', 
  'Caso Cristian Stuani', 
  'Caso Fernando Morales', 
  'Caso Pablo Munera', 
  'Caso Sandra Diaz', 
  'Caso Vivian Sarria', 
];

@Component({
  selector: 'app-event-modal',
  imports: [SharedModule],
  templateUrl: './event-modal.component.html',
  styleUrl: './event-modal.component.scss'
})
export class EventModalComponent {
  @Input() modalTitle: string = '';
  @Input() event: EventoData = {expediente:'', infoCalendar: { start: new Date(), title: '', end: new Date() }};
  /* @Input() event: CalendarEvent = { start: new Date(), title: '' }; */
  @Output() eventSaved = new EventEmitter<EventoData>();

  expedientes: string[] = exp;

  constructor(public activeModal: NgbActiveModal) { }

  saveEvent() {
    this.event.infoCalendar.title = this.event.expediente + " <br> "+ this.event.infoCalendar.title; 
    this.eventSaved.emit(this.event);
    this.activeModal.close(this.event);
  }
}
