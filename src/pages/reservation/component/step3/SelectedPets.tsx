import styled from 'styled-components';

import { TbGenderMale, TbGenderFemale } from 'react-icons/tb';

import { ImageCentered, RoundedImageWrapper, Texts14h21 } from 'commonStyle';

export default function SelectedPets({ checkedPets }: any) {
  return (
    <PetSection>
      <PetSectionTitle>맡기시는 반려동물</PetSectionTitle>
      <ScrollContainer>
        {checkedPets.map((pet: any) => (
          <PetCard key={pet.id}>
            <PetImg>
              <ImageCentered
                src={
                  pet.photo
                    ? `${pet.photo}`
                    : pet.species === 'Dog'
                      ? '/imgs/DogProfile.png'
                      : pet.species === 'Cat'
                        ? '/imgs/CatProfile.png'
                        : undefined
                }
                alt={'pet_photo'}
              />
            </PetImg>
            <div>
              <span>{pet.name}</span>
              <span>
                {pet.gender === 'Male' ? (
                  <TbGenderMale color="#279EFF" />
                ) : pet.gender === 'Female' ? (
                  <TbGenderFemale color="#279EFF" />
                ) : null}
              </span>

              <div>
                <Texts14h21>{pet.age}살</Texts14h21>
              </div>
            </div>
          </PetCard>
        ))}
      </ScrollContainer>
    </PetSection>
  );
}

const PetSection = styled.section`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  padding: 24px;
  gap: 8px;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: ${(props) => props.theme.shadow.dp01};
`;

const PetSectionTitle = styled.h2`
  ${(props) => props.theme.fontSize.s16h24};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

const ScrollContainer = styled.ul`
  overflow: auto;
  display: flex;
`;

const PetCard = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 4px;
  border: 2px solid #279eff;
  border-radius: 12px;
  padding: 12px;
  margin: 4px;
`;

const PetImg = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;
`;
