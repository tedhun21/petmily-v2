import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TbGenderFemale, TbGenderMale } from 'react-icons/tb';

import { Pet, PetGender, PetSpecies } from 'types/pet.type';
import { CenterContainer, Column, ImageCentered, RoundedImageWrapper, Row, Texts12h18 } from 'styles/commonStyle';

interface PetmilyCardProps {
  pet: Pet;
}

export default function PetmilyCard({ pet }: PetmilyCardProps) {
  return (
    <PetCard to={`/me/${pet?.id}/edit`}>
      <UpperContainer>
        <PetImageNameSpecies>
          <PetImage>
            <ImageCentered
              src={
                pet?.photo
                  ? `${pet.photo}`
                  : pet.species === PetSpecies.DOG
                    ? '/imgs/DogProfile.png'
                    : pet.species === PetSpecies.CAT
                      ? '/imgs/CatProfile.png'
                      : undefined
              }
            />
          </PetImage>
          <PetNameSpecies>
            <span>{pet?.name}</span>
            <Species>{pet?.species}</Species>
          </PetNameSpecies>
        </PetImageNameSpecies>
      </UpperContainer>

      <LowerContainer>
        <PetPropWrapper>
          <CenterContainer>
            {pet?.gender === PetGender.MALE ? (
              <TbGenderMale size="21px" color="white" />
            ) : pet?.gender === PetGender.FEMALE ? (
              <TbGenderFemale size="21px" color="white" />
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 8px;
  border: 2px solid ${({ theme }) => theme.line.box.highlight};
  border-radius: 16px;
  color: inherit;
  gap: 8px;
  box-shadow: ${({ theme }) => theme.shadow.dp01};
  text-decoration: none;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.dp02};
  }

  &:active {
    box-shadow: ${({ theme }) => theme.shadow.inset};
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
  color: ${({ theme }) => theme.text.inactive};
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
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.background.highlight};

  > span {
    color: white;
    ${({ theme }) => theme.fontSize.s14h21};
  }
`;
