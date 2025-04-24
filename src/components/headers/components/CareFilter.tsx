import dayjs from 'dayjs';
import styled from 'styled-components';
import { Row } from 'styles/commonStyle';
import { Status } from 'types/reservation.type';
import useSWR from 'swr';
import { fetcherWithCookie } from 'api';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { setFilter, setMonth } from 'store/contextSlice';

export type FilterType = {
  id: number;
  label: '전체' | '대기' | '예정' | '완료' | '취소';
  value: 'all' | Status;
};

const filters: FilterType[] = [
  { id: 1, label: '전체', value: 'all' },
  { id: 2, label: '대기', value: Status.PENDING },
  { id: 3, label: '예정', value: Status.ACCEPTED },
  { id: 4, label: '완료', value: Status.COMPLETED },
  { id: 5, label: '취소', value: Status.CANCELED },
];

const API_URL = process.env.REACT_APP_API_URL;

export default function CareFilter() {
  const dispatch = useDispatch();
  const {
    reservation: { month, filter },
  } = useSelector((state: RootState) => state.context);

  const { data: monthData } = useSWR(`${API_URL}/reservations/month`, fetcherWithCookie);

  const handleFilterClick = (e: any) => {
    dispatch(setFilter(e.target.value));
  };

  const handleMonthChange = (e: any) => {
    dispatch(setMonth(e.target.value));
  };

  return (
    <Sticky>
      <FilterContainer>
        <StatusFilters>
          {filters.map((el) => (
            <FilterRadio key={el.id}>
              <input type="radio" id={`filter-${el.id}`} value={el.value} onClick={handleFilterClick} />
              <CustomLabel htmlFor={`filter-${el.id}`} $isSelected={filter === el.value}>
                {el.label}
              </CustomLabel>
            </FilterRadio>
          ))}
        </StatusFilters>

        <SelectWrapper>
          <StyledSelect value={month} onChange={handleMonthChange}>
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
  background-color: inherit;
  box-shadow: ${({ theme }) => theme.shadow.onlyBottom};
`;

const FilterContainer = styled(Row)`
  align-items: center;
  justify-content: space-between;
  background-color: inherit;
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
