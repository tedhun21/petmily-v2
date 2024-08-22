import dayjs from 'dayjs';

export const parsePossibleDay = (data: string): string[] => {
  try {
    const parsed = JSON.parse(data);

    // 파싱된 결과가 배열이 아닌 경우 빈 배열 반환
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Failed to parse JSON, returning empty array:', error);
    return [];
  }
};

export const timeRange = (start: string, end: string) => {
  const formattedStart = dayjs(start, 'HH:mm:ss').format('HH:mm');
  const formattedEnd = dayjs(end, 'HH:mm:ss').format('HH:mm');

  if (!start || !end) {
    return null;
  }

  return `${formattedStart} ~ ${formattedEnd}`;
};
