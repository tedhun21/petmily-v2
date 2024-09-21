import { CenterContainer, Column, ImageCentered, RoundedImageWrapper, Row, Texts12h18, Texts14h21 } from 'commonStyle';
import styled from 'styled-components';

import { CgGenderFemale, CgGenderMale } from 'react-icons/cg';
import { Link } from 'react-router-dom';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;
export default function PetmilyCard({ pet }: any) {
  return (
    <PetCard to={`/me/${pet.id}/edit`}>
      <UpperContainer>
        <PetImageNameSpecies>
          <PetImage>
            {pet.photo ? (
              <ImageCentered src={`${BUCKET_URL}${pet.photo.url}`} />
            ) : pet.type === 'DOG' ? (
              <img src="/imgs/DogProfile.png" alt="dogPhoto" width="100%" height="100%" />
            ) : pet.type === 'CAT' ? (
              <img src="/imgs/CatProfile.png" alt="catPhoto" width="100%" height="100%" />
            ) : null}
          </PetImage>
          <PetNameSpecies>
            <span>{pet.name}</span>
            <Species>{pet.species}</Species>
          </PetNameSpecies>
        </PetImageNameSpecies>
      </UpperContainer>

      <LowerContainer>
        <PetPropWrapper>
          <CenterContainer>
            {pet.gender === 'MALE' ? (
              <CgGenderMale size="21px" color="white" />
            ) : pet.gender === 'FEMALE' ? (
              <CgGenderFemale size="21px" color="white" />
            ) : null}
          </CenterContainer>
        </PetPropWrapper>

        <PetPropWrapper>
          <span>{pet.age}살</span>
        </PetPropWrapper>
        <PetPropWrapper>
          <span>{pet.weight}kg</span>
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
  justify-content: space-between;
  gap: 8px;
  box-shadow: ${(props) => props.theme.shadow.dp01};
  text-decoration: none;
  color: inherit;

  &:hover {
    box-shadow: ${(props) => props.theme.shadow.dp02};
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

const PetImageNameSpecies = styled(Row)`
  gap: 8px;
  align-items: center;
`;

const PetNameSpecies = styled(Column)`
  gap: 4px;
`;

const Species = styled(Texts12h18)`
  color: ${(props) => props.theme.textColors.gray10};
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
  background-color: ${(props) => props.theme.colors.subBlue};
  border-radius: 16px;
  padding: 4px 8px;

  > span {
    color: white;
    ${(props) => props.theme.fontSize.s14h21};
  }
`;
