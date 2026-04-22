const FALLBACK_DATE_VALUE = '—';

const parseDate = (value: string | null) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date;
};

export const formatDate = (value: string | null) => {
  const date = parseDate(value);

  if (!date) return FALLBACK_DATE_VALUE;

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (value: string | null) => {
  const date = parseDate(value);

  if (!date) return FALLBACK_DATE_VALUE;

  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatNowDate = () => {
  return new Date().toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
