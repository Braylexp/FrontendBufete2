import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventoData } from '../../../agenda/utils/eventoData';
import { SharedModule } from '../../../shared/shared.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const exp: Array<string> = [
  'Administrativo',
  'Civil',
  'Familia',
  'Penal'
];

@Component({
  selector: 'app-plantilla-modal',
  imports: [SharedModule],
  templateUrl: './plantilla-modal.component.html',
  styleUrl: './plantilla-modal.component.scss'
})
export class PlantillaModalComponent {
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
