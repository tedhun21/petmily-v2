import { PiCatBold, PiDogBold } from 'react-icons/pi';
import styled from 'styled-components';
import { Texts16h24 } from 'styles/commonStyle';
import { timeRange, weekdays } from 'utils/date';

interface IProps {
  possiblePetSpecies: string[] | null;
  possibleDays: string[] | null;
  possibleStartTime: string | null;
  possibleEndTime: string | null;
  possibleLocations: string[] | null;
}

export default function PetsitterCapabilities({
  possiblePetSpecies,
  possibleDays,
  possibleStartTime,
  possibleEndTime,
  possibleLocations,
}: IProps) {
  return (
    <Wrapper>
      {/* 가능 펫 */}
      {possiblePetSpecies && (
        <Card>
          <Title>가능 펫</Title>
          <PetList>
            {possiblePetSpecies.map((species, index) => (
              <PetItem key={index}>
                {species === 'dog' ? (
                  <PiDogBold size="20px" color="white" />
                ) : species === 'cat' ? (
                  <PiCatBold size="20px" color="white" />
                ) : null}
              </PetItem>
            ))}
          </PetList>
        </Card>
      )}
      {/* 가능 요일 */}
      {possibleDays && (
        <Card>
          <Title>가능 요일</Title>
          <DayList>
            {possibleDays.map((day, index) => {
              const matchedDay = weekdays.find((weekday) => weekday.value === day);
              return <DayItem key={index}>{matchedDay?.label}</DayItem>;
            })}
          </DayList>
        </Card>
      )}
      {/* 가능 시간 */}
      {possibleStartTime && possibleEndTime && (
        <Card>
          <Title>가능 시간</Title>
          <span>{timeRange(possibleStartTime, possibleEndTime)}</span>
        </Card>
      )}
      {/* 가능 지역 */}
      {possibleLocations && (
        <Card>
          <Title>가능 지역</Title>
          <LocationList>
            {possibleLocations.map((location, index) => (
              <LocationItem key={index}>{location}</LocationItem>
            ))}
          </LocationList>
        </Card>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Card = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
  border-radius: ${({ theme }) => theme.radius.lg};
  gap: 8px;
`;

const Title = styled(Texts16h24)``;

const PetList = styled.ul`
  display: flex;
  gap: 8px;
`;

const PetItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border-radius: ${({ theme }) => theme.radius.base};
`;

const DayList = styled.ul`
  display: flex;
  gap: 8px;
`;

const DayItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: cetner;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border-radius: ${({ theme }) => theme.radius.base};
  color: white;
`;

const LocationList = styled.ul``;

const LocationItem = styled.li`
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border-radius: ${({ theme }) => theme.radius.base};
`;
