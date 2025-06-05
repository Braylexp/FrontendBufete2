import { registerLocaleData } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarMonthViewDay, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { SharedModule } from '../../../shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import localeEs from '@angular/common/locales/es';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { CustomEventTitleFormatter } from '../../utils/custom-event-title-formatter.provider';

import {
  subMonths,
  addMonths,
  addDays,
  addWeeks,
  subDays,
  subWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { EventoData } from '../../utils/eventoData';
import { EventService } from '../../../../domain/services/event/event.service';
import { Evento } from '../../../../domain/models/event.model';

registerLocaleData(localeEs);

/* NEWWWWWWWW */
type CalendarPeriod = 'day' | 'week' | 'month';

function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: addDays,
    week: addWeeks,
    month: addMonths,
  }[period](date, amount);
}

function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: subDays,
    week: subWeeks,
    month: subMonths,
  }[period](date, amount);
}

function startOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: startOfDay,
    week: startOfWeek,
    month: startOfMonth,
  }[period](date);
}

function endOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: endOfDay,
    week: endOfWeek,
    month: endOfMonth,
  }[period](date);
}

/* End neeeeewwww */

@Component({
  selector: 'app-calendar',
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ],
  styleUrl: './calendar.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  modalData!: {
    action: string;
    event: CalendarEvent;
  };
  activeDayIsOpen: boolean = false;

  refresh: Subject<void> = new Subject<void>();

  view: CalendarView | CalendarPeriod = CalendarView.Month;
  viewDate: Date = new Date();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
        this.activeDayIsOpen = false;
        this.eventService.eliminarEvento(event.start);
      },
    },
  ];

  events: CalendarEvent[] = [];
  eventos: Event[] = [];

  locale: string = 'es';
  currentDate: Date = new Date();

  minDate: Date = subMonths(new Date(), 0);
  maxDate: Date = addMonths(new Date(), 12);
  prevBtnDisabled: boolean = false;
  nextBtnDisabled: boolean = false;

  ngOnInit(): void {
    this.loadEvents();
  }

  constructor(private modalService: NgbModal, private eventService: EventService) {
    this.dateOrViewChanged();
  }

  loadEvents(): void {
    this.eventService.listarEventos().subscribe(
      (data) => {
        this.events = data.map((eventData) => ({
          start: new Date(eventData.fecha_inicio),
          end: new Date(eventData.fecha_fin),
          title: eventData.titulo,
          allDay: eventData.all_day,
          actions: this.actions,
          resizable: { beforeStart: true, afterEnd: true, },
          draggable: true
        }));
        this.refresh.next();

      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  /* -------------------------------------------------------------- */

  increment(): void {
    this.changeDate(addPeriod(this.view, this.viewDate, 1));
  }

  decrement(): void {
    this.changeDate(subPeriod(this.view, this.viewDate, 1));
  }

  today(): void {
    this.changeDate(new Date());
  }

  dateIsValid(date: Date): boolean {
    return date >= new Date(this.minDate.getTime() - 24 * 60 * 60 * 1000) && date <= this.maxDate;
  }

  changeDate(date: Date): void {
    this.viewDate = date;
    this.dateOrViewChanged();
  }

  changeView(view: CalendarPeriod): void {
    this.view = view;
    this.dateOrViewChanged();
  }

  dateOrViewChanged(): void {
    this.prevBtnDisabled = !this.dateIsValid(
      endOfPeriod(this.view, subPeriod(this.view, this.viewDate, 1))
    );
    this.nextBtnDisabled = !this.dateIsValid(
      startOfPeriod(this.view, addPeriod(this.view, this.viewDate, 1))
    );
    if (this.viewDate < this.minDate) {
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  /* ------------------------------------------------------------------------ */

  /* Modal para agregar el evento */
  /* dayClicked({ date }: { date: Date }, all: boolean): void {
    this.openModal(date, all);
  } */
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      }
      else { this.activeDayIsOpen = true; }
      this.viewDate = date;
      if (!this.activeDayIsOpen) {
        this.openModal(date, true);
      }
    }
  }

  openModal(date: Date, all: boolean) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const modalRef = this.modalService.open(EventModalComponent);
    modalRef.componentInstance.modalTitle = 'Registrar Evento';
    modalRef.componentInstance.event = {
      expediente: '',
      infoCalendar: {
        start: date, title: '', end: date, allDay: all, actions: this.actions,
        resizable: { beforeStart: true, afterEnd: true, },
        draggable: true
      }
    };
    modalRef.componentInstance.eventSaved.subscribe((newEvent: EventoData) => {
      /* this.events = [...this.events, newEvent.infoCalendar];
      this.refresh.next(); */
      if (newEvent.infoCalendar.end) {
        this.eventService.crearEvento(newEvent.infoCalendar.title, newEvent.infoCalendar.start, newEvent.infoCalendar.end, all, newEvent.expediente, 5).subscribe({
          next: () => {
            this.events = [...this.events, newEvent.infoCalendar];
            this.refresh.next();
          },
          error: (err) => {
            console.error('Error al guardar el evento', err);
          }
        });
      }
    });
  }

  hourSegmentClicked(date: Date) {
    this.openModal(date, false);
  }

  /* ---------------------------------End Modal ------------------------------- */

  handleEvent(action: string, event: CalendarEvent): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    this.modalData = { event, action };
    /* this.modal.open(this.modalContent, { size: 'lg' }); */
  }



  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('2', event);
   /*  this.eventService.actualizarEvento(event.title, event.start, event.end, all, , 5).subscribe({
      next: () => {
        this.events = [...this.events, event.infoCalendar];
        this.refresh.next();
      },
      error: (err) => {
        console.error('Error al guardar el evento', err);
      }
    }); */
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
