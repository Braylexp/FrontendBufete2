import { CommonModule } from '@angular/common';
import { Component, OnInit  } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

interface Documento {
  id: number;
  nombre: string;
  fecha: string; // formateada como 'DD/MM/YYYY'
}

interface Expediente {
  id: number;
  numero: string;
  documentos: Documento[];
  abierto: boolean; // controla colapso
}

interface Proceso {
  id: number;
  nombre: string; // e.g. "Divorcio - Juan Pérez"
  expedientes: Expediente[];
  abierto: boolean; // controla colapso
}


@Component({
  selector: 'app-lista-reportes',
  imports: [CommonModule, SharedModule, NgbModule],
  templateUrl: './lista-reportes.component.html',
  styleUrl: './lista-reportes.component.scss'
})
export class ListaReportesComponent {

  // modelo de datos simulado
  procesos: Proceso[] = [];

  // texto en el campo de búsqueda
  filtroBusqueda: string = '';

  constructor() { }

  ngOnInit(): void {
    // Inicializamos algunos procesos de ejemplo
    this.procesos = [
      {
        id: 1,
        nombre: 'Proceso: Divorcio - Sandra Pérez',
        abierto: true,
        expedientes: [
          {
            id: 11,
            numero: 'Expediente: EXP2024-001',
            abierto: true,
            documentos: [
              { id: 111, nombre: 'Minuta de divorcio', fecha: '01/04/2025' },
              { id: 112, nombre: 'Poder especial abogado', fecha: '02/04/2025' }
            ]
          },
          {
            id: 12,
            numero: 'Expediente: EXP2025-002',
            abierto: false,
            documentos: [
              { id: 121, nombre: 'Solicitud de custodia', fecha: '05/03/2025' },
              { id: 122, nombre: 'Certificado médico', fecha: '06/03/2025' }
            ]
          }
        ]
      },
      {
        id: 1,
        nombre: 'Proceso: Demanda de alimentos - Fernando Morales',
        abierto: true,
        expedientes: [
          {
            id: 11,
            numero: 'Expediente: EXP2025-001',
            abierto: true,
            documentos: [
              { id: 111, nombre: 'Demanda', fecha: '01/04/2025' },
              { id: 112, nombre: 'Poder especial abogado', fecha: '02/04/2025' }
            ]
          },
          {
            id: 12,
            numero: 'Expediente: EXP2025-002',
            abierto: false,
            documentos: [
              { id: 121, nombre: 'Solicitud de pago', fecha: '05/03/2025' },
              { id: 122, nombre: 'Certificado de paternidad', fecha: '06/03/2025' }
            ]
          }
        ]
      },
    ];
  }

  // Alterna colapso del proceso
  toggleProceso(proceso: Proceso) {
    proceso.abierto = !proceso.abierto;
  }

  // Alterna colapso del expediente
  toggleExpediente(expediente: Expediente) {
    expediente.abierto = !expediente.abierto;
  }

  // Filtra procesos, expedientes y documentos según filtroBusqueda
  get procesosFiltrados(): Proceso[] {
    if (!this.filtroBusqueda.trim()) {
      return this.procesos;
    }
    const texto = this.filtroBusqueda.toLowerCase();
    return this.procesos
      .map(proceso => {
        // Verificamos si el nombre de proceso coincide
        const coincideProceso = proceso.nombre.toLowerCase().includes(texto);

        // Para cada expediente, filtramos documentos que coincidan
        const expedientesFiltrados = proceso.expedientes.map(exp => {
          const coincideExpediente = exp.numero.toLowerCase().includes(texto);

          // Filtramos documentos
          const documentosFiltrados = exp.documentos.filter(doc =>
            doc.nombre.toLowerCase().includes(texto)
          );

          return {
            ...exp,
            documentos: documentosFiltrados,
            abierto: coincideExpediente || documentosFiltrados.length > 0 ? true : exp.abierto
          };
        })
          // Dejamos solo expedientes que tengan documentos filtrados o cuyo número concatene el texto
          .filter(exp => exp.documentos.length > 0 || exp.numero.toLowerCase().includes(texto));

        // Si algún expediente se mantiene, abrimos el proceso
        const hayExpedientes = expedientesFiltrados.length > 0;

        if (coincideProceso || hayExpedientes) {
          return {
            ...proceso,
            expedientes: expedientesFiltrados,
            abierto: coincideProceso || hayExpedientes ? true : proceso.abierto
          };
        }
        return null;
      })
      .filter(p => p !== null) as Proceso[];
  }

  // Handlers de acciones de documento
  editarDocumento(doc: Documento) {
    // Aquí iría la lógica para editar (abrir modal, navegar, etc.)
    console.log('Editar documento:', doc);
  }

  eliminarDocumento(doc: Documento) {
    // Aquí iría la lógica para eliminar (confirmar y quitar del array)
    console.log('Eliminar documento:', doc);
  }

  subirDocumento(): void {
    // Lógica para subir documento diligenciado (navegar a otra vista o abrir modal)
    console.log('Clic en "Subir documento diligenciado"');
  }

}
