import { Texts14h20 } from 'styles/commonStyle';
import { PiCatBold, PiDogBold } from 'react-icons/pi';
import styled from 'styled-components';
import { PetSpecies } from 'types/pet.type';
import { timeRange, weekdays } from 'utils/date';

export default function MyPetsitterSettings({ petsitter }: any) {
  return (
    <InfoList>
      {petsitter?.possiblePetSpecies && (
        <InfoItem>
          <span>케어 가능 동물</span>
          <ItemWrapper>
            {petsitter.possiblePetSpecies.map((species: PetSpecies) => (
              <ItemLabel key={species}>
                {species === PetSpecies.DOG ? (
                  <PiDogBold size="20px" color="white" />
                ) : species === PetSpecies.CAT ? (
                  <PiCatBold size="20px" color="white" />
                ) : null}
              </ItemLabel>
            ))}
          </ItemWrapper>
        </InfoItem>
      )}
      {petsitter?.possibleLocations && (
        <InfoItem>
          <span>케어 가능 지역</span>
          <ItemWrapper>
            {petsitter.possibleLocations.map((location: string) => (
              <ItemLabel key={location}>{location}</ItemLabel>
            ))}
          </ItemWrapper>
        </InfoItem>
      )}
      {petsitter?.possibleDays && (
        <InfoItem>
          <span>케어 가능 요일</span>
          <ItemWrapper>
            {petsitter.possibleDays.map((day: string) => {
              const matchedDay = weekdays.find((weekday) => weekday.value === day);
              return <ItemLabel key={day}>{matchedDay?.label}</ItemLabel>;
            })}
          </ItemWrapper>
        </InfoItem>
      )}
      {petsitter?.possibleStartTime && petsitter?.possibleEndTime && (
        <InfoItem>
          <span>케어 가능 시간</span>
          <ItemLabel>{timeRange(petsitter?.possibleStartTime, petsitter?.possibleEndTime)}</ItemLabel>
        </InfoItem>
      )}
    </InfoList>
  );
}

const InfoList = styled.ul`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const InfoItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 8px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
  border-radius: 12px;
`;

const ItemWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const ItemLabel = styled(Texts14h20)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.colors.text.highlight};
  border-radius: ${({ theme }) => theme.radius.base};
  color: white;
`;
