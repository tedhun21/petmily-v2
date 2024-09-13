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

export const formatProgress = (progress: string) => {
  switch (progress) {
    case 'PENDING':
      return '대기중';
    case 'CONFIRMED':
      return '예약확정';
    case 'CANCELED':
      return '취소됨';
    case 'FINISHED':
      return '종료됨';
  }
};
