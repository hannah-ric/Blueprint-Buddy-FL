import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces';

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS',
  },
  {
    href: '/build_plans/build_plans-list',
    label: 'Build plans',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon:
      'mdiFileDocumentOutline' in icon
        ? icon['mdiFileDocumentOutline' as keyof typeof icon]
        : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_BUILD_PLANS',
  },
  {
    href: '/components/components-list',
    label: 'Components',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon:
      'mdiCubeOutline' in icon
        ? icon['mdiCubeOutline' as keyof typeof icon]
        : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_COMPONENTS',
  },
  {
    href: '/hardware_fasteners/hardware_fasteners-list',
    label: 'Hardware fasteners',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon:
      'mdiScrewdriver' in icon
        ? icon['mdiScrewdriver' as keyof typeof icon]
        : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_HARDWARE_FASTENERS',
  },
  {
    href: '/joinery_methods/joinery_methods-list',
    label: 'Joinery methods',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon:
      'mdiHammerWrench' in icon
        ? icon['mdiHammerWrench' as keyof typeof icon]
        : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_JOINERY_METHODS',
  },
  {
    href: '/materials/materials-list',
    label: 'Materials',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon:
      'mdiLayersOutline' in icon
        ? icon['mdiLayersOutline' as keyof typeof icon]
        : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_MATERIALS',
  },
  {
    href: '/roles/roles-list',
    label: 'Roles',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiShieldAccountVariantOutline ?? icon.mdiTable,
    permissions: 'READ_ROLES',
  },
  {
    href: '/permissions/permissions-list',
    label: 'Permissions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiShieldAccountOutline ?? icon.mdiTable,
    permissions: 'READ_PERMISSIONS',
  },
  {
    href: '/workshop/workshop-list',
    label: 'Workshop',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_WORKSHOP',
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },

  {
    href: '/home',
    label: 'Home page',
    icon: icon.mdiHome,
    withDevider: true,
  },
  {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS',
  },
];

export default menuAside;
