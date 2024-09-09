import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Drawer } from '@mui/material';

import { FiFilter } from 'react-icons/fi';
import { Column, Row } from 'commonStyle';
import { CgOptions } from 'react-icons/cg';

import { useCustomQuery } from 'hooks/useCustomQuery';
import { getPetsitters } from './api';
import { useFormContext } from 'react-hook-form';
import PetsitterCard from './component/step2/PetsitterCard';

const filterList = [
  { id: 1, item: '예약 정보 기반 펫시터' },
  { id: 2, item: '내가 찜한 펫시터' },
  { id: 3, item: '별점이 높은 펫시터' },
  { id: 4, item: '리뷰가 많은 펫시터' },
  { id: 5, item: '새로 온 펫시터' },
];

export default function Step2({ onNext }: any) {
  const { getValues } = useFormContext();

  const { date, startTime, endTime, address, petType } = getValues();

  const [properPetsitters, setProperPetsitters] = useState<number[]>([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState(1);

  const [page, setPage] = useState(1);
  const pageSize = 20;
  // let filter = {};

  const { isSuccess, data } = useCustomQuery({
    queryFn: () => getPetsitters({ date, startTime, endTime, address, petType, page, pageSize }),
    enabled: !!date && !!startTime && !!endTime && !!address && !!petType,
  });

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

  useEffect(() => {
    if (isSuccess && data) {
      setProperPetsitters((prev) => [...prev, data.results]);
    }
  }, [isSuccess, data]);

  // useEffect(() => {
  //   if (filterType && getValues()) {
  //     filter = getFilter(filterType, getValues());
  //   }
  // }, [filterType]);

  // useEffect(() => {
  //   if (!reservationDate || !reservationTimeStart || !reservationTimeEnd || !address || !petId) {
  //     alert('예약을 처음부터 해주세요.');
  //     navigate('/reservation');
  //   }
  // }, []);

  // useEffect(() => {
  //   if (filterType === '요청한 예약 날짜에 맞는 펫시터') {
  //     const getProperPetsitters = async () => {
  //       const accessToken = getCookie('access_token');
  //       try {
  //         const response = await axios.post(
  //           `${apiUrl}/reservations/petsitters`,
  //           {
  //             reservationDate,
  //             reservationTimeStart,
  //             reservationTimeEnd,
  //             address,
  //             petId,
  //           },
  //           { headers: { Authorization: `Bearer ${accessToken}` } },
  //         );
  //         if (response.status === 200) {
  //           setProperPetsitters(response.data);
  //         }
  //       } catch (error: any) {
  //         console.log(error);
  //         if (error.response.status === 401) {
  //           try {
  //             const newAccessToken = await refreshAccessToken();
  //             if (newAccessToken) {
  //               const response = await axios.post(
  //                 `${apiUrl}/reservations/petsitters`,
  //                 {
  //                   reservationDate,
  //                   reservationTimeStart,
  //                   reservationTimeEnd,
  //                   address,
  //                   petId,
  //                 },
  //                 { headers: { Authorization: `Bearer ${newAccessToken}` } },
  //               );
  //               setProperPetsitters(response.data);
  //             }
  //           } catch (error) {
  //             console.log(error);
  //           }
  //         }
  //       }
  //     };
  //     getProperPetsitters();
  //   } else if (filterType === '내가 찜한 펫시터') {
  //     const getFavoritePetsitters = async () => {
  //       const accessToken = getCookie('access_token');
  //       try {
  //         const response = await axios.get(`${apiUrl}/members/favorite`, {
  //           headers: { Authorization: `Bearer ${accessToken}` },
  //         });
  //         setProperPetsitters(response.data);
  //       } catch (error: any) {
  //         if (error.response.status === 401) {
  //           try {
  //             const newAccessToken = await refreshAccessToken();
  //             if (newAccessToken) {
  //               const response = await axios.get(`${apiUrl}/members/favorite`, {
  //                 headers: { Authorization: `Bearer ${newAccessToken}` },
  //               });
  //               setProperPetsitters(response.data);
  //             }
  //           } catch (refreshError) {
  //             console.log(refreshError);
  //             alert('로그인 세션이 만료되었습니다. 다시 로그인해 주시기 바랍니다.');
  //             dispatch(deleteUser());
  //             dispatch(deleteReservation());
  //             deleteCookie('access_token');
  //             deleteCookie('refresh_token');
  //           }
  //         }
  //         setProperPetsitters([]);
  //       }
  //     };
  //     getFavoritePetsitters();
  //   } else if (filterType === '새로 온 펫시터') {
  //     const getNewPetsitters = async () => {
  //       try {
  //         const response = await axios.get(`${apiUrl}/members/search`);
  //         setProperPetsitters(response.data.data);
  //       } catch (error) {
  //         setProperPetsitters([]);
  //       }
  //     };
  //     getNewPetsitters();
  //   } else if (filterType === '별점이 높은 펫시터') {
  //     const getHighPetsitters = async () => {
  //       try {
  //         const response = await axios.get(`${apiUrl}/members/search?star=0`);
  //         setProperPetsitters(response.data.data);
  //       } catch (error) {
  //         setProperPetsitters([]);
  //       }
  //     };
  //     getHighPetsitters();
  //   } else if (filterType === '리뷰가 많은 펫시터') {
  //     const getManyReviewsPetsitters = async () => {
  //       try {
  //         const response = await axios.get(`${apiUrl}/members/search?reviewCount=0`);
  //         setProperPetsitters(response.data.data);
  //       } catch (error) {
  //         setProperPetsitters([]);
  //       }
  //     };
  //     getManyReviewsPetsitters();
  //   }
  // }, [filterType]);

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

      <PetsitterContainer>
        {Array.isArray(properPetsitters[0]) &&
          properPetsitters[0].length > 0 &&
          properPetsitters.map((page: any) =>
            page.map((petsitter: any) => <PetsitterCard key={petsitter.id} petsitter={petsitter} onNext={onNext} />),
          )}
      </PetsitterContainer>

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

const PetsitterContainer = styled(Column)`
  gap: 8px;
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
