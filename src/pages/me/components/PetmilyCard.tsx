import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TbGenderFemale, TbGenderMale } from 'react-icons/tb';

import { Pet, PetGender, PetSpecies } from 'types/pet.type';
import { Center, Column, ImageCentered, RoundedImageWrapper, Row, Texts12h16 } from 'styles/commonStyle';

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
          <Center>
            {pet?.gender === PetGender.MALE ? (
              <TbGenderMale size="21px" color="white" />
            ) : pet?.gender === PetGender.FEMALE ? (
              <TbGenderFemale size="21px" color="white" />
            ) : null}
          </Center>
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
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
  border-radius: ${({ theme }) => theme.radius.md};
  color: inherit;
  gap: ${({ theme }) => theme.spacing.sm};
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
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const PetNameSpecies = styled(Column)`
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Species = styled(Texts12h16)`
  color: ${({ theme }) => theme.colors.text.inactive};
`;

const PetImage = styled(RoundedImageWrapper)`
  width: 50px;
  height: 50px;
`;

const LowerContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
`;

const PetPropWrapper = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border-radius: ${({ theme }) => theme.radius.md};

  > span {
    color: ${({ theme }) => theme.colors.text.white};
    ${({ theme }) => theme.typeScale.sm};
  }
`;
