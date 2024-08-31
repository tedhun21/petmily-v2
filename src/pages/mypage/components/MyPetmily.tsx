import styled from 'styled-components';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useCustomQuery } from 'hooks/useCustomQuery';
import { getPets } from '../api';
import { useEffect, useState } from 'react';
import PetmilyCard from './PetmilyCard';

// 펫 이미지 없을 때 디폴트 이미지 수정
// 펫밀리 카드 디자인 수정

type Pet = {
  id: number;
  type: 'DOG' | 'CAT';
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  species: string;
  neutering: boolean;
  weight: number;
  body?: string;
  photo?: string;
};

export default function MyPetmily() {
  const [petmily, setPetmily] = useState<Pet[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [hasMoreData, setHasMoreData] = useState(true);
  const { isSuccess, data } = useCustomQuery({
    queryFn: () => getPets({ page, pageSize }),
    enabled: hasMoreData,
  });

  useEffect(() => {
    if (isSuccess && data && data.results) {
      if (data.results.length < pageSize) {
        setHasMoreData(false);
      }

      setPetmily((prev) => [...prev, ...data.results]);
    }
  }, [isSuccess, data]);

  return (
    <PetmilyContainer>
      <TextContainer>
        <Text>나의 Petmily</Text>
        {petmily.length > 0 && (
          <Link to="/mypage/register">
            <PlusIcon />
          </Link>
        )}
      </TextContainer>
      {petmily.length > 0 ? (
        <CardContainer>
          {petmily.map((pet: Pet) => (
            <PetmilyCard key={pet.id} pet={pet} />
          ))}
        </CardContainer>
      ) : (
        <NoPetsContainer>
          <div>등록된 펫밀리가 없습니다.</div>
          <div>프로필을 등록하면 빠른 예약이 가능해요!</div>
          <Link to="/mypage/register">
            <Button variant="contained" sx={{ backgroundColor: '#279eff', mt: 5 }}>
              등록하러 가기
            </Button>
          </Link>
        </NoPetsContainer>
      )}
    </PetmilyContainer>
  );
}

const PetmilyContainer = styled.section`
  display: flex;
  flex-direction: column;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
`;

const Text = styled.span`
  font-weight: 900;
  font-size: 18px;
`;

const CardContainer = styled.ul`
  display: flex;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 20px;
  width: 100%;
`;

// 반려동물이 없을 때
const NoPetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  & > div {
    margin-bottom: 30px;
  }
`;

const PlusIcon = styled(AddCircleOutlineIcon)`
  margin: 0;
  color: gray;

  &:hover {
    color: #279eff;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const AdditionalInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;
