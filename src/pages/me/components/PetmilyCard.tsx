import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { TbGenderFemale, TbGenderMale } from 'react-icons/tb';

import { PetSpecies, type Pet, PetGender } from '@/types/pet.type';
import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import { Text } from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';

interface PetmilyCardProps {
  pet: Pet;
}

export default function PetmilyCard({ pet }: PetmilyCardProps) {
  return (
    <PetCard to={`/me/${pet?.id}/edit`}>
      <Flex justifyContent="space-between">
        <Flex alignItems="center" gap="sm">
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
          <Flex direction="column" gap="xs">
            <span>{pet?.name}</span>
            <Text size="xs" color="inverse">
              {pet?.species}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <LowerContainer>
        <PetPropWrapper>
          <Flex justifyContent="center" alignItems="center">
            {pet?.gender === PetGender.MALE ? (
              <TbGenderMale size="21px" color="white" />
            ) : pet?.gender === PetGender.FEMALE ? (
              <TbGenderFemale size="21px" color="white" />
            ) : null}
          </Flex>
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

// TODO: Link
const PetCard = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.space.sm};
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
  border-radius: ${({ theme }) => theme.radius.md};
  color: inherit;
  gap: ${({ theme }) => theme.space.sm};
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

const PetImage = styled(RoundedImageWrapper)`
  width: 50px;
  height: 50px;
`;

const LowerContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xs};
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
