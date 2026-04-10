import routes from './routes';
import ROLES from './roles';
import menuUsersIcon from 'assets/icons/menu_users.svg';
import menuTasksIcon from 'assets/icons/menu_tasks.svg';
import menuRecipesIcon from 'assets/icons/menu_recipes.svg';
import menuPatientsIcon from 'assets/icons/menu_patients.svg';
import menuSubstanceIcon from 'assets/icons/menu_substance.svg';
import menuWarehouseIcon from 'assets/icons/menu_warehouse.svg';

export interface NavItem {
  label: string;
  to: string;
  roles: string[];
  icon: string;
  badgeKey?: string;
}

export const navigation: NavItem[] = [
  { label: 'Персонал', to: routes.users, roles: [ROLES.ADMIN], icon: menuUsersIcon },
  { label: 'Задания', to: routes.tasks, roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACIST], icon: menuTasksIcon, badgeKey: 'tasks' },
  { label: 'Рецепты', to: routes.recipes, roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACIST], icon: menuRecipesIcon, badgeKey: 'recipes' },
  { label: 'Пациенты', to: routes.patients, roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACIST], icon: menuPatientsIcon },
  { label: 'Лекарства', to: routes.substance, roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACIST], icon: menuSubstanceIcon },
  { label: 'Склад', to: routes.warehouse, roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACIST], icon: menuWarehouseIcon },
];

export const techNavigation: NavItem[] = [
  { label: 'Задания', to: `${routes.tasks}?status=created`, roles: [ROLES.OPERATOR], icon: menuTasksIcon, badgeKey: 'tasksCreated' },
  { label: 'В процессе', to: `${routes.tasks}?status=processing`, roles: [ROLES.OPERATOR], icon: menuTasksIcon, badgeKey: 'tasksProcessing' },
  { label: 'Завершённые', to: `${routes.tasks}?status=completed`, roles: [ROLES.OPERATOR], icon: menuTasksIcon, badgeKey: 'tasksCompleted' },
];