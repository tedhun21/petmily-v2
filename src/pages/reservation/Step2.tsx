import { useState } from 'react';
import styled from 'styled-components';

import { Drawer } from '@mui/material';

import { FiFilter } from 'react-icons/fi';
import { CgOptions } from 'react-icons/cg';

import { CenterContainer, Divider, Row, Texts18h27, Texts20h30 } from 'styles/commonStyle';
import PossiblePetsitters from './component/step2/PossiblePetsitters';

const filterList = [
  { id: 1, item: '예약 정보 기반 펫시터', ref: 'possible' },
  { id: 2, item: '내가 찜한 펫시터', ref: 'favorite' },
  { id: 3, item: '별점이 높은 펫시터', ref: 'star' },
  { id: 4, item: '리뷰가 많은 펫시터', ref: 'review' },
  { id: 5, item: '새로 온 펫시터', ref: 'new' },
];

export default function Step2({ onNext }: any) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState('possible');

  const handleFilterOpen = () => {
    setIsFilterOpen(true);
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };

  const handleFilterButtonClick = (ref: string) => {
    setFilter(ref);
    setIsFilterOpen(false);
  };

  return (
    <MainContainer>
      <FilterContainer>
        <TitleWrap>
          <TitleText>{filterList.map((list: any) => list.ref === filter && list.item)}</TitleText>
          {/* <ItemCountbox>0</ItemCountbox> */}
        </TitleWrap>
        <button type="button" onClick={handleFilterOpen}>
          <CgOptions size="24px" />
        </button>
      </FilterContainer>

      <PossiblePetsitters filter={filter} onNext={onNext} />

      <Drawer anchor="bottom" open={isFilterOpen} onClose={handleFilterClose}>
        <Container>
          <DrawerHeader>
            <FiFilter size="28px" color="#279EFF" />
            <HeaderTitle>필터</HeaderTitle>
          </DrawerHeader>
          <BlueDivider />
          <ListContainer>
            {filterList.map((filter) => (
              <li key={filter.id}>
                <ItemButton onClick={() => handleFilterButtonClick(filter.ref)}>{filter.item}</ItemButton>
              </li>
            ))}
          </ListContainer>
        </Container>
      </Drawer>
    </MainContainer>
  );
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  padding: 12px;
`;

const FilterContainer = styled(Row)`
  align-items: center;
  justify-content: space-between;
  padding: 8px;
`;

const TitleWrap = styled(Row)`
  gap: 4px;
  align-items: center;
`;

const TitleText = styled(Texts20h30)`
  font-weight: ${({ theme }) => theme.fontWeight.extrabold};
`;

const ItemCountbox = styled(CenterContainer)`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.background.box.default.primary};
`;

const Container = styled.div`
  color: ${({ theme }) => theme.text.active};
  background-color: ${({ theme }) => theme.background.box.default.primary};
`;

const DrawerHeader = styled(Row)`
  align-items: center;
  gap: 8px;
  padding: 12px;
`;

const HeaderTitle = styled(Texts18h27)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const BlueDivider = styled(Divider)`
  background-color: ${({ theme }) => theme.background.highlight};
`;

const ListContainer = styled.ul`
  padding: 8px;
`;

const ItemButton = styled.button`
  padding: 16px;
  ${({ theme }) => theme.fontSize.s16h24}
`;
