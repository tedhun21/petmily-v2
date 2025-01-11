import styled from 'styled-components';

import { Row } from 'styles/commonStyle';
import { Status } from 'types/reservation.type';

const filters = [
  { id: 1, label: '전체', value: 'all' },
  { id: 2, label: '대기', value: Status.PENDING },
  { id: 3, label: '예정', value: Status.ACCEPTED },
  { id: 4, label: '완료', value: Status.COMPLETED },
  { id: 5, label: '취소', value: Status.CANCELED },
];

export default function Filter({ filter, handleFilter, date, setDate }: any) {
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDate((prev: any) => ({ ...prev, month: e.target.value }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDate((prev: any) => ({ ...prev, year: e.target.value }));
  };

  return (
    <FilterContainer>
      <StatusFilters>
        {filters.map((el) => (
          <FilterRadio key={el.id}>
            <input
              type="radio"
              id={`filter-${el.id}`}
              name="status"
              value={el.value}
              checked={filter.value === el.value}
              onChange={() => handleFilter(el)}
            />
            <CustomLabel htmlFor={`filter-${el.id}`} $isSelected={filter.value === el.value}>
              {el.label}
            </CustomLabel>
          </FilterRadio>
        ))}
      </StatusFilters>

      <SelectWrapper>
        <StyledSelect name="month" value={date.month} onChange={handleMonthChange}>
          <option value="12">12월</option>
          <option value="11">11월</option>
          <option value="10">10월</option>
          <option value="09">9월</option>
          <option value="08">8월</option>
          <option value="07">7월</option>
          <option value="06">6월</option>
          <option value="05">5월</option>
          <option value="04">4월</option>
          <option value="03">3월</option>
          <option value="02">2월</option>
          <option value="01">1월</option>
        </StyledSelect>
        <StyledSelect name="year" value={date.year} onChange={handleYearChange}>
          <option value="2024">2024년</option>
          <option value="2025">2025년</option>
          <option value="2026">2026년</option>
          <option value="2027">2027년</option>
          <option value="2028">2028년</option>
          <option value="2029">2029년</option>
          <option value="2030">2030년</option>
          <option value="2031">2031년</option>
          <option value="2032">2032년</option>
        </StyledSelect>
      </SelectWrapper>
    </FilterContainer>
  );
}

const FilterContainer = styled(Row)`
  flex: 1;
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
