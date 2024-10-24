import { PiCatBold, PiDogBold } from 'react-icons/pi';
import styled from 'styled-components';
import { Species } from 'types/pet.type';
import { timeRange, weekdays } from 'utils/date';

export default function MyPetsitterSettings({ me }: any) {
  return (
    <InfoList>
      {me?.possiblePetSpecies && (
        <InfoItem>
          <span>케어 가능 동물</span>
          <ItemWrapper>
            {me.possiblePetSpecies.map((species: Species) => (
              <ItemLabel key={species}>
                {species === 'Dog' ? (
                  <PiDogBold size="20px" color="white" />
                ) : species === 'Cat' ? (
                  <PiCatBold size="20px" color="white" />
                ) : null}
              </ItemLabel>
            ))}
          </ItemWrapper>
        </InfoItem>
      )}
      {me?.possibleLocations && (
        <InfoItem>
          <span>케어 가능 지역</span>
          <ItemWrapper>
            {me.possibleLocations.map((location: string) => (
              <ItemLabel key={location}>{location}</ItemLabel>
            ))}
          </ItemWrapper>
        </InfoItem>
      )}
      {me?.possibleDays && (
        <InfoItem>
          <span>케어 가능 요일</span>
          <ItemWrapper>
            {me.possibleDays.map((day: string) => {
              const matchedDay = weekdays.find((weekday) => weekday.value === day);
              return <ItemLabel key={day}>{matchedDay ? matchedDay.label : day}</ItemLabel>;
            })}
          </ItemWrapper>
        </InfoItem>
      )}
      {me?.possibleStartTime && me?.possibleEndTime && (
        <InfoItem>
          <span>케어 가능 시간</span>
          <ItemLabel>{timeRange(me?.possibleStartTime, me?.possibleEndTime)}</ItemLabel>
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
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
  border-radius: 12px;
`;

const ItemWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const ItemLabel = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  color: white;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.mainBlue};
  ${(props) => props.theme.fontSize.s14h21};
`;
