import { Row } from 'commonStyle';
import { motion, useAnimation, useScroll } from 'framer-motion';
import { useEffect } from 'react';
import styled from 'styled-components';

const filters = [
  { id: 1, label: '모두', value: 'all' },
  { id: 2, label: '예정', value: `expected` },
  { id: 3, label: '완료', value: `finish` },
];

export default function Filter({ filter, handleFilter }: any) {
  //   const controls = useAnimation();
  //   const { scrollY } = useScroll();

  //   console.log(scrollY);
  //   useEffect(() => {
  //     return scrollY.onChange((latest) => {
  //       if (latest > 100) {
  //         controls.start({ y: -100, opacity: 0, transition: { duration: 0.3 } }); // 스크롤 내리면 감추기
  //       } else {
  //         controls.start({ y: 0, opacity: 1, transition: { duration: 0.3 } }); // 스크롤 올리면 보이기
  //       }
  //     });
  //   }, [scrollY, controls]);

  return (
    <FilterContainer>
      {filters.map((el) => (
        <FilterButtonStyle key={el.id} onClick={() => handleFilter(el)} $filter={filter.label === el.label}>
          {el.label}
        </FilterButtonStyle>
      ))}
    </FilterContainer>
    //   <MotionFilterContainer animate={controls}>
    // </MotionFilterContainer>
  );
}

// const MotionFilterContainer = styled(motion.div)`
//   position: sticky;
//   top: 0;
//   width: 100%;
//   background-color: white;
//   z-index: 1000;
// `;

const FilterContainer = styled(Row)`
  gap: 4px;
`;

const FilterButtonStyle = styled.div<{ $filter: boolean }>`
  padding: 4px 8px;
  border: ${({ theme, $filter }) => ($filter ? 'none' : `1px solid ${theme.colors.mainBlue}`)};
  border-radius: 4px;
  color: ${({ $filter }) => ($filter ? 'white' : 'black')};
  background-color: ${({ theme, $filter }) => ($filter ? theme.colors.mainBlue : 'white')};
  cursor: pointer;
`;
