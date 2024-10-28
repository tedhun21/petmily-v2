import styled from 'styled-components';

import { Row, Texts12h18 } from 'commonStyle';

const filters = [
  { id: 1, label: '모두', value: 'all' },
  { id: 2, label: '예정', value: `expected` },
  { id: 3, label: '완료', value: `done` },
];

const orders = [
  { id: 1, label: '최신순', value: 'desc' },
  { id: 2, label: '오래된 순', value: 'asc' },
];

export default function Filter({ filter, order, handleFilter, handleOrder }: any) {
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
            <CustomLabel htmlFor={`filter-${el.id}`} isSelected={filter.value === el.value}>
              {el.label}
            </CustomLabel>
          </FilterRadio>
        ))}
      </StatusFilters>
      <OrderFilters>
        {orders.map((el, index) => (
          <OrderRadio key={el.id}>
            <input
              type="radio"
              id={`order-${el.id}`}
              name="order"
              value={el.value}
              checked={order.value === el.value}
              onChange={() => handleOrder(el)}
            />
            <CustomOrderLabel htmlFor={`order-${el.id}`} isSelected={order.value === el.value}>
              {el.label}
            </CustomOrderLabel>
            {index === 0 && <Texts12h18>•</Texts12h18>}
          </OrderRadio>
        ))}
      </OrderFilters>
    </FilterContainer>
  );
}

const FilterContainer = styled(Row)`
  gap: 16px;
  justify-content: space-between;
  align-items: center;
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

const OrderFilters = styled(Row)`
  gap: 8px;
  align-items: flex-end;
`;

const OrderRadio = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  input {
    display: none; /* Hide the default radio button */
  }
`;

const CustomLabel = styled.label<{ isSelected: boolean }>`
  padding: 4px 8px;
  border: ${({ theme, isSelected }) => (isSelected ? 'none' : `1px solid ${theme.colors.mainBlue}`)};
  border-radius: 4px;
  color: ${({ isSelected }) => (isSelected ? 'white' : 'black')};
  background-color: ${({ theme, isSelected }) => (isSelected ? theme.colors.mainBlue : 'white')};
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
`;

const CustomOrderLabel = styled.label<{ isSelected: boolean }>`
  cursor: pointer;
  color: ${({ isSelected, theme }) => (isSelected ? theme.colors.mainBlue : 'black')};
  font-weight: ${({ isSelected }) => (isSelected ? 'bold' : 'normal')};
  ${(props) => props.theme.fontSize.s14h21}
`;
