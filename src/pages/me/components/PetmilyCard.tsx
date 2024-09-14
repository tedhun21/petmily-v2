import { CenterContainer, ImageCentered, RoundedImageWrapper, Row } from 'commonStyle';
import styled from 'styled-components';

import { CgGenderFemale, CgGenderMale } from 'react-icons/cg';
import { Link } from 'react-router-dom';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;
export default function PetmilyCard({ pet }: any) {
  return (
    <PetCard to={`/me/${pet.id}/edit`}>
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
      </UpperContainer>

      <LowerContainer>
        <PetPropWrapper>
          <span>성별:</span>
          <CenterContainer>
            {pet.gender === 'MALE' ? (
              <CgGenderMale size="16px" />
            ) : pet.gender === 'FEMALE' ? (
              <CgGenderFemale size="16px" />
            ) : null}
          </CenterContainer>
        </PetPropWrapper>
        <PetPropWrapper>
          <span>품종: {pet.species}</span>
        </PetPropWrapper>
        <PetPropWrapper>
          <span>나이: {pet.age}살</span>
        </PetPropWrapper>
        <PetPropWrapper>
          <span>몸무게: {pet.weight}kg</span>
        </PetPropWrapper>
      </LowerContainer>
    </PetCard>
  );
}

const PetCard = styled(Link)`
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
  padding: 8px;
  border-radius: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: ${(props) => props.theme.shadow.dp01};
  text-decoration: none;
  color: inherit;

  &:hover {
    box-shadow: ${(props) => props.theme.shadow.dp03};
  }

  &:active {
    box-shadow: ${(props) => props.theme.shadow.inset};
  }

  &:visited {
    color: inherit;
  }
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

const LowerContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  width: 100%;
`;

const PetPropWrapper = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${(props) => props.theme.colors.subBlue};
  border-radius: 8px;
  padding: 8px;
`;
