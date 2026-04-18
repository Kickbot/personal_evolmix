import routes from './routes';
import ROLES from './roles';

export interface NavItem {
  label: string;
  to: string;
  roles: string[];
}

export const navigation: NavItem[] = [
  { label: 'Персонал', to: routes.users, roles: [ROLES.ADMIN] },
  { label: 'Задания', to: routes.tasks, roles: [ROLES.ADMIN, ROLES.HEAD_DOCTOR, ROLES.DOCTOR, ROLES.PHARMACIST] },
  { label: 'Рецепты', to: routes.recipes, roles: [ROLES.ADMIN, ROLES.HEAD_DOCTOR, ROLES.DOCTOR, ROLES.PHARMACIST] },
  { label: 'Пациенты', to: routes.patients, roles: [ROLES.ADMIN, ROLES.HEAD_DOCTOR, ROLES.DOCTOR, ROLES.PHARMACIST] },
  { label: 'Лекарства', to: routes.substance, roles: [ROLES.ADMIN, ROLES.HEAD_DOCTOR, ROLES.DOCTOR, ROLES.PHARMACIST] },
  { label: 'Склад', to: routes.warehouse, roles: [ROLES.ADMIN, ROLES.HEAD_DOCTOR, ROLES.DOCTOR, ROLES.PHARMACIST] },
];

export const techNavigation: NavItem[] = [
  { label: 'Задания', to: `${routes.tasks}?status=created`, roles: [ROLES.OPERATOR] },
  { label: 'В процессе', to: `${routes.tasks}?status=processing`, roles: [ROLES.OPERATOR] },
  { label: 'Завершённые', to: `${routes.tasks}?status=completed`, roles: [ROLES.OPERATOR] },
];