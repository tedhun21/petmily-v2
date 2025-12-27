import styled from '@emotion/styled';
import { TbGenderFemale, TbGenderMale } from 'react-icons/tb';

import { PetSpecies, type Pet, PetGender } from '@/types/pet.type';
import { ImageCentered } from '@/styles/commonStyle';
import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';
import { Link } from 'react-router-dom';
import Box from '@/components/styled/Box';
import { Label } from '@/components/styled/Label';

interface IProps {
  pet: Pet;
}

export default function PetmilyCard({ pet }: IProps) {
  return (
    <Link to={`/me/pets/${pet?.id}/edit`}>
      <CardBox p="md" br="md">
        <Flex direction="column" gap="lg">
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

          <Flex gap="lg" alignItems="flex-end">
            <Text size="2xl">{pet?.name}</Text>
            <Text size="sm">{pet?.breed}</Text>
          </Flex>

          <Flex flexWrap="wrap" gap="xs">
            <Label size="sm">
              <Flex justifyContent="center" alignItems="center">
                {pet?.gender === PetGender.MALE ? (
                  <TbGenderMale size="21px" color="white" />
                ) : pet?.gender === PetGender.FEMALE ? (
                  <TbGenderFemale size="21px" color="white" />
                ) : null}
              </Flex>
            </Label>

            <Label size="sm">
              <span>{pet.age}살</span>
            </Label>
            <Label size="sm">
              <span>{pet.weight}kg</span>
            </Label>
          </Flex>
        </Flex>
      </CardBox>
    </Link>
  );
}

const CardBox = styled(Box)`
  border: 2px solid ${({ theme }) => theme.colors.line.box.active};
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.02);
  }
`;

const PetImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
`;
