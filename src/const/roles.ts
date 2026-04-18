const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  HEAD_DOCTOR: 'head_doctor',
  PHARMACIST: 'pharmacist',
  OPERATOR: 'tech',
} as const;

export const ROLE_NAMES: Record<string, string> = {
  [ROLES.ADMIN]: 'Администратор',
  [ROLES.DOCTOR]: 'Доктор',
  [ROLES.HEAD_DOCTOR]: 'Глав. Врач',
  [ROLES.PHARMACIST]: 'Фармацевт',
  [ROLES.OPERATOR]: 'Оператор',
};

export default ROLES;