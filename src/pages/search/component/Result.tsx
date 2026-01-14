import styled from '@emotion/styled';
import { MdOutlineRateReview } from 'react-icons/md';
import { PiCatBold, PiDogBold, PiStarFill } from 'react-icons/pi';

import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import { Link } from 'react-router-dom';
import type { Petsitter } from '@/types/user.type';
import { PetSpecies, type PetSpeciesType } from '@/types/pet.type';
import Flex from '@/components/styled/Flex';

interface ResultProps {
  petsitter: Petsitter;
}

export default function Result({ petsitter }: ResultProps) {
  return (
    <Card to={`/users/${petsitter.nickname}`}>
      <PetsitterImage>
        <ImageCentered
          src={petsitter?.photo ? `${petsitter.photo}` : '/imgs/DefaultUserProfile.jpg'}
          alt="petsitter_photo"
        />
      </PetsitterImage>

      <Flex direction="column" gap="sm">
        <span>{petsitter.nickname}</span>

        <Flex gap="lg">
          <Flex alignItems="center" gap="xs">
            <PiStarFill size="20px" color="#279EFF" />
            <span>{petsitter?.star}</span>
          </Flex>
          <Flex alignItems="center" gap="xs">
            <MdOutlineRateReview size="20px" />
            <span>{petsitter?.reviewCount}</span>
          </Flex>
        </Flex>

        <ul>
          <Flex gap="xs">
            {(petsitter?.possiblePetSpecies ?? []).map((species: PetSpeciesType) => (
              <li key={species}>
                {species === PetSpecies.DOG ? <PiDogBold /> : species === PetSpecies.CAT ? <PiCatBold /> : null}
              </li>
            ))}
          </Flex>
        </ul>
      </Flex>
    </Card>
  );
}

const Card = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.space.xl};
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
`;
