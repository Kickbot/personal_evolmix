export const fullName = (p?: { last_name: string; first_name: string; middle_name?: string | null } | null) => {
  if (!p) return '';
  return [p.last_name, p.first_name, p.middle_name].filter(Boolean).join(' ').trim();
};

export const shortName = (
  p?: { first_name: string; middle_name: string | null; last_name: string } | null,
) => {
  if (!p) return '';
  const fi = p.first_name?.trim().charAt(0);
  const mi = p.middle_name?.trim().charAt(0);
  const initials = [fi, mi].filter(Boolean).map((c) => `${c}.`).join('');
  return `${p.last_name} ${initials}`.trim();
};
