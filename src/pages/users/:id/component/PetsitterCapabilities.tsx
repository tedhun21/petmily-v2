import { PiCatBold, PiDogBold } from 'react-icons/pi';
import styled from 'styled-components';
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
          <span>가능 펫</span>
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
          <span>가능 요일</span>
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
          <span>가능 시간</span>
          <span>{timeRange(possibleStartTime, possibleEndTime)}</span>
        </Card>
      )}
      {/* 가능 지역 */}
      {possibleLocations && (
        <Card>
          <span>가능 지역</span>
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
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Card = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
  border-radius: ${({ theme }) => theme.radius.lg};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PetList = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PetItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const DayList = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DayItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: cetner;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border-radius: ${({ theme }) => theme.radius.md};
  color: white;
`;

const LocationList = styled.ul``;

const LocationItem = styled.li`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border-radius: ${({ theme }) => theme.radius.md};
`;
