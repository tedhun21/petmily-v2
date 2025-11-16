import styled from 'styled-components';
import { MdOutlineRateReview } from 'react-icons/md';
import { PiCatBold, PiDogBold, PiStarFill } from 'react-icons/pi';
import { ImageCentered, RoundedImageWrapper } from 'styles/commonStyle';
import { Link } from 'react-router-dom';
import { Petsitter } from 'types/user.type';
import { PetSpecies } from 'types/pet.type';
import { Flex } from '@components/Flex';

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

        <li>
          <Flex gap="xs">
            {(petsitter?.possiblePetSpecies ?? []).map((species: PetSpecies) => (
              <li key={species}>
                {species === PetSpecies.DOG ? <PiDogBold /> : species === PetSpecies.CAT ? <PiCatBold /> : null}
              </li>
            ))}
          </Flex>
        </li>
      </Flex>
    </Card>
  );
}

// TODO: 버튼 + shadow
const Card = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
`;
