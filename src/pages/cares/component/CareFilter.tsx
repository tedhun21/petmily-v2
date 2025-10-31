import { useDispatch, useSelector } from 'react-redux';
import { useAuthSWR } from 'hooks/authSWR';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { Row } from 'styles/commonStyle';

import { fetcher } from 'api';
import { RootState } from 'store';
import { setFilter, setMonth } from 'store/contextSlice';
import { ReservationStatus } from 'types/reservation.type';

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

  const handleFilterClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setMonth(e.target.value));
  };

  return (
    <Sticky>
      <FilterContainer>
        <StatusFilters>
          {filters.map((el) => (
            <FilterRadio key={el.id}>
              <input type="radio" id={`filter-${el.id}`} value={el.value} onChange={handleFilterClick} />
              <CustomLabel htmlFor={`filter-${el.id}`} $isSelected={filter === el.value}>
                {el.label}
              </CustomLabel>
            </FilterRadio>
          ))}
        </StatusFilters>

        <SelectWrapper>
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
        </SelectWrapper>
      </FilterContainer>
    </Sticky>
  );
}

const Sticky = styled.div`
  position: sticky;
  top: 100px;
  z-index: 10;
  padding: ${({ theme }) => theme.spacing.sm};
`;

const FilterContainer = styled(Row)`
  justify-content: space-between;
  align-items: center;
`;

const StatusFilters = styled(Row)`
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterRadio = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  input {
    display: none; /* Hide the default radio button */
  }
`;

const CustomLabel = styled.label<{ $isSelected: boolean }>`
  padding: 4px ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.background.box.blue.primary : theme.colors.background.box.default.primary};
  border: ${({ theme, $isSelected }) => ($isSelected ? 'none' : `1px solid ${theme.colors.line.box.primary}`)};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.text.white : theme.colors.text.inactive)};
  transition:
    background-color 0.2s,
    color 0.2s;
  cursor: pointer;

  ${({ theme }) => theme.typeScale.sm};
`;

const SelectWrapper = styled(Row)`
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StyledSelect = styled.select`
  padding: 6px ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border: 1px solid ${({ theme }) => theme.colors.line.input.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  color: inherit;
  ${({ theme }) => theme.typeScale.sm};

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.line.input.highlight};
  }
`;
