import { useState } from 'react';
import styled from 'styled-components';

import { Drawer } from '@mui/material';

import { FiFilter } from 'react-icons/fi';
import { CgOptions } from 'react-icons/cg';

import { Row } from 'commonStyle';
import PossiblePetsitters from './component/step2/PossiblePetsitters';

const filterList = [
  { id: 1, item: '예약 정보 기반 펫시터' },
  { id: 2, item: '내가 찜한 펫시터' },
  { id: 3, item: '별점이 높은 펫시터' },
  { id: 4, item: '리뷰가 많은 펫시터' },
  { id: 5, item: '새로 온 펫시터' },
];

export default function Step2({ onNext }: any) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState(1);

  const handleFilterOpen = () => {
    setIsFilterOpen(true);
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };

  const handleFilterButtonClick = (type: number) => {
    setFilterType(type);
    setIsFilterOpen(false);
  };

  return (
    <MainContainer>
      <FilterContainer>
        <TitleWrap>
          <TitleText>{filterList.map((list: any) => list.id === filterType && list.item)}</TitleText>
          <ItemCountbox>0</ItemCountbox>
        </TitleWrap>
        <FilterButton type="button" onClick={handleFilterOpen}>
          <CgOptions size="24px" />
        </FilterButton>
      </FilterContainer>

      <PossiblePetsitters onNext={onNext} />

      <Drawer
        anchor="bottom"
        open={isFilterOpen}
        onClose={handleFilterClose}
        // ModalProps={{ container: document.getElementById('steptwo-main'), style: { position: 'absolute' } }}
      >
        <>
          <DrawerHeader>
            <FiFilter size="28px" color="#279EFF" />
            <HeaderTitle>필터</HeaderTitle>
          </DrawerHeader>
          <Divider />
          <ListContainer>
            {filterList.map((filter) => (
              <li key={filter.id}>
                <ItemButton onClick={() => handleFilterButtonClick(filter.id)}>{filter.item}</ItemButton>
              </li>
            ))}
          </ListContainer>
        </>
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
  padding: 8px;
  justify-content: space-between;
  align-items: center;
`;

const TitleWrap = styled(Row)`
  gap: 4px;
  align-items: center;
`;

const TitleText = styled.span`
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
  font-size: ${(props) => props.theme.fontSize.s20h30};
`;

const ItemCountbox = styled.div`
  display: flex;
  justify-content: center;
  align-itmes: center;
  padding: 4px 8px;
  border-radius: 4px;
  color: ${(props) => props.theme.colors.white};
  font-size: 14px;
  background-color: ${(props) => props.theme.colors.mainBlue};
`;

const FilterButton = styled.button`
  cursor: pointer;
`;

const DrawerHeader = styled(Row)`
  align-items: center;
  gap: 8px;
  padding: 12px;
`;

const HeaderTitle = styled.span`
  ${(props) => props.theme.fontSize.s18h27}
  font-weight:${(props) => props.theme.fontWeights.bold}
`;

const Divider = styled.div`
  border: 1px solid ${(props) => props.theme.colors.mainBlue};
`;

const ListContainer = styled.ul`
  padding: 8px;
`;

const ItemButton = styled.button`
  padding: 16px;
  ${(props) => props.theme.fontSize.s16h24}
`;
