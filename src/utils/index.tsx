/**
 *
 * @param  {...String|null} names
 * @returns {String}
 */
 
export const cn = (...names: (string | boolean | undefined | null)[]) =>
  names.filter((value): value is string => !!value && typeof value === 'string').join(' ');

/**
 * @param {String} value - date in DD-MM-YYYY format
 * @returns {String}
 */
// export const toHumanDate = (value: string) => {
//   if (!value) return value

//   const [day, month, year] = value.split('-').map(Number)
//   const date = new Date(year, month - 1, day)

//   if (Number.isNaN(date.getTime())) return value

//   return new Intl.DateTimeFormat('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   }).format(date)
// };

export const isIOS = () => {
  const platform = navigator.platform.toLowerCase(),
      iosPlatforms = ['iphone', 'ipad', 'ipod', 'ipod touch'];

  if (platform.includes('mac')) return 'macOS';
  if (iosPlatforms.includes(platform)) return 'iOS';
  if (platform.includes('win')) return 'windows';
  if (/android/.test(navigator.userAgent.toLowerCase())) return 'android';
  if (/linux/.test(platform)) return 'linux';

  return 'unknown';
};

export const parseText = (text: string, limit: number) => {
  if (text.length > limit) {
    for (let i = limit; i > 0; i--){
      if(text.charAt(i) === ' ' && (text.charAt(i-1) !== ','||text.charAt(i-1) !== '.'||text.charAt(i-1) !== ';')) {
        return text.substring(0, i) + ' ...';
      }
    }
  } else {
    return text;
  }
};