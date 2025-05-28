import styled from 'styled-components';
import { MdOutlineRateReview } from 'react-icons/md';
import { PiCatBold, PiDogBold, PiStarFill } from 'react-icons/pi';
import { Column, ImageCentered, RoundedImageWrapper, Row } from 'styles/commonStyle';
import { Link } from 'react-router-dom';
import { Petsitter } from 'types/user.type';
import { PetSpecies } from 'types/pet.type';

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
      <InfoWrapper>
        <span>{petsitter.nickname}</span>

        <StarReviewWrapper>
          <Wrapper>
            <PiStarFill size="20px" color="#279EFF" />
            <span>{petsitter?.star}</span>
          </Wrapper>
          <Wrapper>
            <MdOutlineRateReview size="20px" />
            <span>{petsitter?.reviewCount}</span>
          </Wrapper>
        </StarReviewWrapper>

        <PetList>
          {(petsitter?.possiblePetSpecies ?? []).map((species: PetSpecies) => (
            <PetCapsule key={species}>
              {species === PetSpecies.DOG ? <PiDogBold /> : species === PetSpecies.CAT ? <PiCatBold /> : null}
            </PetCapsule>
          ))}
        </PetList>
      </InfoWrapper>
    </Card>
  );
}

const Card = styled(Link)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
`;

const Wrapper = styled(Row)`
  align-items: center;
  gap: 4px;
`;

const InfoWrapper = styled(Column)`
  gap: 8px;
`;

const StarReviewWrapper = styled(Row)`
  gap: 16px;
`;

const PetList = styled.ul`
  display: flex;
  gap: 4px;
`;

const PetCapsule = styled.li`
  // border: 1px solid ${({ theme }) => theme.line.box.highlight};
`;
