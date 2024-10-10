// `filterType`에 따라 `date`와 ``를 설정하는 로직
export const getFilter = (filterType: number, values: any) => {
  const { date, startTime, endTime, address, petType } = values;
  switch (filterType) {
    // '예약 정보 기반 펫시터'
    case 1:
      return { date, startTime, endTime, address, petType }; // 예시 값
    // '내가 찜한 펫시터'
    case 2:
      return { page: 2, pageSize: 20 }; // 다른 필터 조건의 값

    default:
      return { page: 1, pageSize: 10 }; // 기본값
  }
};

export const formatProgress = (status: string) => {
  switch (status) {
    case 'Pending':
      return '대기중';
    case 'Accepted':
      return '예약확정';
    case 'Canceled':
      return '취소됨';
    case 'Completed':
      return '완료됨';
  }
};

export const findPetsittersURL = (ref: string, query: any, pageIndex: number, pageSize: number) => {
  const { date, startTime, endTime, address, petSpecies } = query;

  let baseUrl = '';

  switch (ref) {
    case 'possible': {
      baseUrl = `/possible?date=${date}&startTime=${startTime}&endTime=${endTime}&address=${address}&petSpecies=${petSpecies}`;
      break;
    }

    case 'favorite': {
      baseUrl = `/favorite`;
      break;
    }

    case 'used': {
      baseUrl = `/used`;
      break;
    }

    case 'star': {
      baseUrl = `/star`;
      break;
    }

    case 'review': {
      baseUrl = `/review`;
      break;
    }

    case 'new': {
      baseUrl = `/new`;
      break;
    }

    default: {
      return '';
    }
  }

  // Check if there are existing query parameters to determine whether to use '?' or '&'
  const hasQueryParams = baseUrl.includes('?');

  // Directly add pagination to the URL
  return `${baseUrl}${hasQueryParams ? '&' : '?'}page=${pageIndex + 1}&pageSize=${pageSize}`;
};
