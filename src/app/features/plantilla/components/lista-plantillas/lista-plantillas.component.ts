import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbHighlight, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, of, startWith } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';
import { PlantillaModalComponent } from '../plantilla-modal/plantilla-modal.component';
import { Action } from 'rxjs/internal/scheduler/Action';
import { EventoData } from '../../../agenda/utils/eventoData';

interface Country {
  id?: number;
	name: string;
	category: string;
	area: Date;
	population: number;
}

const COUNTRIES: Country[] = [
  {
    name: 'Demanda por alimentos',
    category: 'Familia',
    area: new Date(2023, 1, 15),
    population: 146989754,
  },
  {
    name: 'Demanda por acuerdo',
    category: 'Administrativa',
    area: new Date(2024, 1, 5),
    population: 36624199,
  },
  {
    name: 'Derecho de petición',
    category: 'Civil',
    area: new Date(2023, 6, 25),
    population: 324459463,
  },
  {
    name: 'Demanda por lesiones personales',
    category: 'Penal',
    area: new Date(2025, 5, 5),
    population: 1409517397,
  },
];

function search(text: string, pipe: PipeTransform): Country[] {
  return COUNTRIES.filter((country) => {
    const term = text.toLowerCase();
    return (
      country.name.toLowerCase().includes(term) ||
      pipe.transform(country.area).includes(term) ||
      pipe.transform(country.population).includes(term)
    );
  });
}

@Component({
  selector: 'app-lista-plantillas',
  imports: [SharedModule, CommonModule],
  providers:[
    DecimalPipe
  ],
  templateUrl: './lista-plantillas.component.html',
  styleUrl: './lista-plantillas.component.scss'
})
export class ListaPlantillasComponent {
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
      const modalRef = this.modalService.open(PlantillaModalComponent);
      modalRef.componentInstance.modalTitle = 'Crear Plantilla Jurídica';
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
