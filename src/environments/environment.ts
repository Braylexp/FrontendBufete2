// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,

  apiUrl: 'http://localhost:4200',
  /*
  apiUrlEventos: 'http://localhost:4200/assets/datas/eventos.json',
  apiUrlPermisos: 'http://localhost:4200/assets/datas/permisos.json',
  apiUrlUser: 'http://localhost:4200/assets/datas/users.json',
  apiUrlRoles: 'http://localhost:4200/assets/datas/roles.json', */
  
  /* apiUrl: 'https://bufete-abogados.onrender.com', */
  apiUrlEventos: 'https://bufete-abogados.onrender.com/assets/datas/eventos.json',
  apiUrlPermisos: 'https://bufete-abogados.onrender.com/assets/datas/permisos.json',
  apiUrlUser: 'https://bufete-abogados.onrender.com/assets/datas/users.json',
  apiUrlRoles: 'https://bufete-abogados.onrender.com/assets/datas/roles.json'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
