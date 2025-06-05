import { Routes } from '@angular/router';
import { AdminComponent } from './features/admin/admin.component';
import { RolesComponent } from './features/rol/componentes/roles/roles.component';
import { NewUserComponent } from './features/user/components/new-user/new-user.component';
import { CalendarComponent } from './features/agenda/components/calendar/calendar.component';
import { ListUserComponent } from './features/user/components/list-user/list-user.component';
import { LoginComponent } from './features/login/login.component';
import { AgendaComponent } from './features/agenda/components/agenda/agenda.component';
import { ListaPlantillasComponent } from './features/plantilla/components/lista-plantillas/lista-plantillas.component';
import { ListaReportesComponent } from './features/reportes/componentes/lista-reportes/lista-reportes.component';
import { ListarSentenciasComponent } from './features/sentencias/componentes/listar-sentencias/listar-sentencias.component';

export const routes: Routes = [
    {
        path: '', component: LoginComponent,
    },
    {
        path: 'admin', component: AdminComponent,
        children: [
            {
                path: 'admin',
                redirectTo: '/admin/usuarios',
                pathMatch: 'full'
            },
            { path: 'roles', component: RolesComponent },
            { path: 'usuarios', component: NewUserComponent },
            { path: 'agenda', component: AgendaComponent },
            { path: 'listaUsuarios', component: ListUserComponent },
            { path: 'listaPlantilla', component: ListaPlantillasComponent },
            { path: 'listaReporte', component: ListaReportesComponent },
            { path: 'listaSentencia', component: ListarSentenciasComponent },
        ]
    }
];
