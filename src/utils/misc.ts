export const formatStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return '대기중';
    case 'accepted':
      return '예약확정';
    case 'canceled':
      return '취소됨';
    case 'completed':
      return '완료됨';
  }
};
