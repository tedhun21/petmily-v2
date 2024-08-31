import { ImageCentered, RoundedImageWrapper, Row } from 'commonStyle';
import styled from 'styled-components';

import { CgGenderFemale, CgGenderMale } from 'react-icons/cg';
import { Link } from 'react-router-dom';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;
export default function PetmilyCard({ pet }: any) {
  return (
    <PetCard>
      <UpperContainer>
        <PetImageName>
          <PetImage>
            {pet.photo ? (
              <ImageCentered src={`${BUCKET_URL}${pet.photo.url}`} />
            ) : pet.type === 'DOG' ? (
              <img src="/imgs/DogProfile.png" alt="dogPhoto" width="100%" height="100%" />
            ) : pet.type === 'CAT' ? (
              <img src="/imgs/CatProfile.png" alt="catPhoto" width="100%" height="100%" />
            ) : null}
          </PetImage>
          <span>{pet.name}</span>
        </PetImageName>
        <EditLink to={`/mypage/${pet.id}/edit`}>편집</EditLink>
      </UpperContainer>

      <LowerContainer>
        <PetPropWrapper>
          <span>성별</span>
          <div>
            {pet.gender === 'MALE' ? (
              <CgGenderMale size="24px" />
            ) : pet.gender === 'FEMALE' ? (
              <CgGenderFemale size="24px" />
            ) : null}
          </div>
        </PetPropWrapper>
        <PetPropWrapper>
          <span>품종: </span>
          <span>{pet.species}</span>
        </PetPropWrapper>
        <PetPropWrapper>
          <span>나이: </span>
          <span>{pet.age}살</span>
        </PetPropWrapper>
        <PetPropWrapper>
          <span>몸무게: </span>
          <span>{pet.weight}kg</span>
        </PetPropWrapper>
      </LowerContainer>
    </PetCard>
  );
}

const PetCard = styled.li`
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
  padding: 8px;
  border-radius: 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UpperContainer = styled(Row)`
  display: flex;
  justify-content: space-between;
`;

const PetImageName = styled(Row)`
  gap: 8px;
  align-items: center;
`;

const PetImage = styled(RoundedImageWrapper)`
  width: 50px;
  height: 50px;
`;

const EditLink = styled(Link)`
  &:visited {
    color: black;
  }
`;

const LowerContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  width: 100%;
`;

const PetPropWrapper = styled.li`
  display: flex;
  align-items: center;
  border: 2px solid ${(props) => props.theme.colors.subBlue};
  border-radius: 4px;
  padding: 4px 8px;
`;
