const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PHARMACIST: 'pharmacist',
  OPERATOR: 'tech',
} as const;

export const ROLE_NAMES: Record<string, string> = {
  [ROLES.ADMIN]: 'Администратор',
  [ROLES.DOCTOR]: 'Доктор',
  [ROLES.PHARMACIST]: 'Фармацевт',
  [ROLES.OPERATOR]: 'Оператор',
};

export default ROLES;