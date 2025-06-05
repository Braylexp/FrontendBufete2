import { Component } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-agenda',
  imports: [CalendarComponent, SharedModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss'
})
export class AgendaComponent {

}
