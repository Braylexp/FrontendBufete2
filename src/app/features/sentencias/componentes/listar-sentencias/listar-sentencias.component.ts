import { Component, PipeTransform } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule, DecimalPipe } from '@angular/common';
import { EventoData } from '../../../agenda/utils/eventoData';
import { SentenciaModalComponent } from '../sentencia-modal/sentencia-modal.component';
import { map, Observable, of, startWith } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

interface Country {
  id?: number;
  proceso: string;
  expediente: string;
  area: Date;
  cliente: string;
  abogado: string;
  population: number;
}

const COUNTRIES: Country[] = [
  {
    proceso: 'Demanda por alimentos',
    expediente: 'Familia',
    area: new Date(2023, 1, 15),
    cliente:'',
    abogado: '',
    population: 146989754,
  },
  {
    proceso: 'Demanda por acuerdo',
    expediente: 'Administrativa',
    area: new Date(2024, 1, 5),
    cliente:'',
    abogado: '',
    population: 36624199,
  },
  {
    proceso: 'Derecho de petición',
    expediente: 'Civil',
    area: new Date(2023, 6, 25),
    cliente:'',
    abogado: '',
    population: 324459463,
  },
  {
    proceso: 'Demanda por lesiones personales',
    expediente: 'Penal',
    area: new Date(2025, 5, 5),
    cliente:'',
    abogado: '',
    population: 1409517397,
  },
];

function search(text: string, pipe: PipeTransform): Country[] {
  return COUNTRIES.filter((country) => {
    const term = text.toLowerCase();
    return (
      country.proceso.toLowerCase().includes(term) ||
      pipe.transform(country.area).includes(term) ||
      pipe.transform(country.population).includes(term)
    );
  });
}


@Component({
  selector: 'app-listar-sentencias',
  imports: [SharedModule, CommonModule],
  providers: [
    DecimalPipe
  ],
  templateUrl: './listar-sentencias.component.html',
  styleUrl: './listar-sentencias.component.scss'
})
export class ListarSentenciasComponent {

  // texto en el campo de búsqueda
  filtroBusqueda: string = '';

  countries$: Observable<Country[]>;
  filter = new FormControl('', { nonNullable: true });
  page = 1;
  pageSize = 10;
  collectionSize = COUNTRIES.length;

  constructor(private pipe: DecimalPipe, private modalService: NgbModal) {
    this.countries$ = this.filter.valueChanges.pipe(
      startWith(''),
      map((text) => search(text, pipe)),
    );
    this.refreshCountries();
  }

  refreshCountries() {
    this.countries$ = of(COUNTRIES
      .map((country, i) => ({ id: i + 1, ...country })).slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize,
      )
    );
  }

  openModal() {
    var date!: Date;
    var all!: boolean;
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const modalRef = this.modalService.open(SentenciaModalComponent);
    modalRef.componentInstance.modalTitle = 'Subir Sentencia';
    modalRef.componentInstance.event = {
      expediente: '',
      infoCalendar: {
        start: date, title: '', end: date, allDay: all, actions: [],
        resizable: { beforeStart: true, afterEnd: true, },
        draggable: true
      }
    };
    modalRef.componentInstance.eventSaved.subscribe((newEvent: EventoData) => {
      /* this.events = [...this.events, newEvent.infoCalendar];
      this.refresh.next(); */
      if (newEvent.infoCalendar.end) {
        /* this.eventService.crearEvento(newEvent.infoCalendar.title, newEvent.infoCalendar.start, newEvent.infoCalendar.end, all, newEvent.expediente, 5).subscribe({
          next: () => {
            this.events = [...this.events, newEvent.infoCalendar];
            this.refresh.next();
          },
          error: (err) => {
            console.error('Error al guardar el evento', err);
          }
        }); */
      }
    });
  }
}
