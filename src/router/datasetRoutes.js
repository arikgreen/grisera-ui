import AccessRoles from '@/const/AccessRoles';
import ClassesDescriptions from '@/const/ClassesDescriptions';

export default [
  {
    path: '/datasets',
    name: 'datasets',
    component: () => import('@/views/datasets/DatasetsView.vue'),
    meta: {
      icon: 'mdi-database',
      order: 20,
      name: 'Datasets',
      hideFilters: true,
      breadcrumbs: [
        { text: 'Datasets', disabled: true },
      ],
      disableNavigation: false,
      infoMessage: ClassesDescriptions.DATASET,
    },
  },
  {
    path: '/datasets/create',
    name: 'dataset-creation',
    component: () => import('@/views/datasets/DatasetDetailedView.vue'),
    meta: {
      breadcrumbs: [
        { text: 'Datasets', href: '/datasets' },
        { text: 'Create', disabled: true },
      ],
      disableNavigation: true,
      infoMessage: ClassesDescriptions.DATASET,
    },
  },
  {
    path: '/datasets/:id([0-9a-fA-F]+)/edit',
    name: 'dataset-edit',
    component: () => import('@/views/datasets/DatasetDetailedView.vue'),
    meta: {
      breadcrumbs: [
        { text: 'Datasets', href: '/datasets' },
        { text: 'Edit', disabled: true },
      ],
      disableNavigation: true,
      infoMessage: ClassesDescriptions.DATASET,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
    },
  },
];
