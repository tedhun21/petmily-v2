import { useDispatch, useSelector } from 'react-redux';
import { useAuthSWR } from '@/hooks/authSWR';
import dayjs from 'dayjs';
import styled from '@emotion/styled';

import { fetcher } from '@/api';
import { RootState } from '@/store';
import { setFilter, setMonth } from '@/store/contextSlice';
import { ReservationStatus } from '@/types/reservation.type';
import { Button } from '@/components/styled/Button';
import Flex from '@components/styled/Flex';

export type FilterType = {
  id: number;
  label: '전체' | '대기' | '예정' | '완료' | '취소';
  value: 'all' | ReservationStatus;
};

const filters: FilterType[] = [
  { id: 1, label: '전체', value: 'all' },
  { id: 2, label: '대기', value: ReservationStatus.PENDING },
  { id: 3, label: '예정', value: ReservationStatus.ACCEPTED },
  { id: 4, label: '완료', value: ReservationStatus.COMPLETED },
  { id: 5, label: '취소', value: ReservationStatus.CANCELED },
];

export default function CareFilter() {
  const dispatch = useDispatch();
  const {
    reservation: { month, filter },
  } = useSelector((state: RootState) => state.context);

  const { data: monthData } = useAuthSWR('/reservations/month', fetcher);

  const handleFilterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(setFilter(e.currentTarget.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setMonth(e.target.value));
  };

  return (
    <Sticky>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex gap="sm">
          {filters.map((el) => (
            <RadioButton
              key={el.id}
              value={el.value}
              onClick={handleFilterClick}
              $selected={filter === el.value}
              variant={filter === el.value ? 'primary' : 'secondary'}
              size="sm"
              borderRadius="md"
            >
              {el.label}
            </RadioButton>
          ))}
        </Flex>

        <Flex gap="xs">
          <StyledSelect value={month} onChange={handleMonthChange}>
            <option value="">월 선택</option>
            {monthData && monthData.length > 0 ? (
              monthData.map((month: string) => (
                <option key={month} value={month}>
                  {dayjs(month).format('YYYY년 MM월')}
                </option>
              ))
            ) : (
              <option value="">----</option>
            )}
          </StyledSelect>
        </Flex>
      </Flex>
    </Sticky>
  );
}

const Sticky = styled.div`
  position: sticky;
  top: 100px;
  z-index: 10;
  padding: ${({ theme }) => theme.spacing.sm};
`;

// TODO
const RadioButton = styled(Button, { shouldForwardProp: (prop) => prop !== '$selected' })<{ $selected: boolean }>`
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.background.box.accent.primary : theme.colors.background.box.default.primary};
  border: ${({ theme, $selected }) => ($selected ? 'none' : `1px solid ${theme.colors.line.box.primary}`)};
`;

const StyledSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border: 1px solid ${({ theme }) => theme.colors.line.input.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  color: inherit;
  ${({ theme }) => theme.typeScale.sm};

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.line.input.focus};
  }
`;
