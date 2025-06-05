import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventoData } from '../../../agenda/utils/eventoData';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';


const exp: Array<string> = [
  'Administrativo',
  'Civil',
  'Familia',
  'Penal'
];


@Component({
  selector: 'app-sentencia-modal',
  imports: [CommonModule, SharedModule],
  templateUrl: './sentencia-modal.component.html',
  styleUrl: './sentencia-modal.component.scss'
})
export class SentenciaModalComponent {

  @Input() modalTitle: string = '';
  @Input() event: EventoData = { expediente: '', infoCalendar: { start: new Date(), title: '', end: new Date() } };
  /* @Input() event: CalendarEvent = { start: new Date(), title: '' }; */
  @Output() eventSaved = new EventEmitter<EventoData>();

  expedientes: string[] = exp;

  constructor(public activeModal: NgbActiveModal) { }

  saveEvent() {
    this.event.infoCalendar.title = this.event.expediente + " <br> " + this.event.infoCalendar.title;
    this.eventSaved.emit(this.event);
    this.activeModal.close(this.event);
  }

}
