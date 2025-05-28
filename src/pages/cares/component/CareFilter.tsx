import dayjs from 'dayjs';
import styled from 'styled-components';
import { Row } from 'styles/commonStyle';
import { ReservationStatus } from 'types/reservation.type';
import useSWR from 'swr';
import { fetcherWithCookie } from 'api';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { setFilter, setMonth } from 'store/contextSlice';
import { API_URL } from 'config';

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

  const { data: monthData } = useSWR(`${API_URL}/reservations/month`, fetcherWithCookie);

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
  padding: 8px;
  z-index: 10;
`;

const FilterContainer = styled(Row)`
  align-items: center;
  justify-content: space-between;
`;

const StatusFilters = styled(Row)`
  gap: 8px;
`;

const FilterRadio = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  input {
    display: none; /* Hide the default radio button */
  }
`;

const CustomLabel = styled.label<{ $isSelected: boolean }>`
  padding: 4px 8px;
  border: ${({ theme, $isSelected }) => ($isSelected ? 'none' : `1px solid ${theme.line.box.primary}`)};
  border-radius: ${({ theme }) => theme.radius.normal};
  color: ${({ $isSelected, theme }) => ($isSelected ? 'white' : theme.text.inactive)};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.background.box.blue.primary : theme.background.box.default.primary};
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;

  ${({ theme }) => theme.fontSize.s14h21};
`;

const SelectWrapper = styled(Row)`
  gap: 4px;
`;

const StyledSelect = styled.select`
  padding: 6px 8px;
  border: 1px solid ${({ theme }) => theme.line.input.primary};
  border-radius: ${({ theme }) => theme.radius.normal};
  background-color: ${({ theme }) => theme.background.box.default.primary};
  color: inherit;
  ${({ theme }) => theme.fontSize.s14h21};

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.line.input.highlight};
  }
`;
