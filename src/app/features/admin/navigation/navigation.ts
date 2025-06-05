export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'users',
    title: '',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Home',
        type: 'item',
        url: '/admin/home',
        icon: 'feather icon-home'
      },
      {
        id: 'perfil',
        title: 'Perfil',
        type: 'item',
        url: '/admin/perfil',
        icon: 'feather icon-user'
      },
    ]
  },
  {
    id: 'users',
    title: 'Gestión',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'usuarios',
        title: 'Usuarios',
        type: 'collapse',
        icon: 'feather icon-layers',
        children: [
          {
            id: 'crear-usuarios',
            title: 'Crear usuario',
            type: 'item',
            url: '/admin/usuarios',
            icon: 'feather icon-user'
          },
          {
            id: 'listar-usuarios',
            title: 'Usuarios Registrados',
            type: 'item',
            url: '/admin/listaUsuarios',
            icon: 'feather icon-users'
          },
        ]
      },
      {
        id: 'dashboard',
        title: 'Roles',
        type: 'item',
        url: '/admin/roles',
        icon: 'feather icon-briefcase'
      },
      {
        id: 'dashboard',
        title: 'Calendario Jurídico',
        type: 'item',
        url: '/admin/agenda',
        icon: 'feather icon-calendar'
      },
      {
        id: 'dashboard',
        title: 'Plantillas Jurídicas',
        type: 'item',
        url: '/admin/listaPlantilla',
        icon: 'feather icon-briefcase'
      },
      {
        id: 'dashboard',
        title: 'Gestión de reportes',
        type: 'item',
        url: '/admin/listaReporte',
        icon: 'feather icon-briefcase'
      },
      {
        id: 'sentencias',
        title: 'Sentencias',
        type: 'collapse',
        icon: 'feather icon-layers',
        children: [
          {
            id: 'crear-usuarios',
            title: 'Sentencias Registradas',
            type: 'item',
            url: '/admin/listaSentencia',
            icon: 'feather icon-file-text'
          },
          {
            id: 'listar-usuarios',
            title: 'Estadísticas',
            type: 'item',
            url: '/admin/estadistica',
            icon: 'feather icon-bar-chart-2'
          },
        ]
      }
    ]
  },
  
];
