import { PiCatBold, PiDogBold } from 'react-icons/pi';
import styled from '@emotion/styled';
import { Text } from '@components/styled/Text';
import { PetSpecies } from '@/types/pet.type';
import { timeRange, weekdays } from '@/utils/date';
import Box from '@components/styled/Box';
import { Label } from '@/components/styled/Label';

export default function MyPetsitterSettings({ petsitter }: any) {
  return (
    <InfoList>
      {petsitter?.possiblePetSpecies && (
        <Box p="md" br="lg" bg="background.box.default.primary">
          <span>케어 가능 동물</span>
          <ItemWrapper>
            {petsitter.possiblePetSpecies.map((species: PetSpecies) => (
              <Label key={species} size="sm" borderRadius="lg" color="blue">
                {species === PetSpecies.DOG ? (
                  <PiDogBold size="20px" color="white" />
                ) : species === PetSpecies.CAT ? (
                  <PiCatBold size="20px" color="white" />
                ) : null}
              </Label>
            ))}
          </ItemWrapper>
        </Box>
      )}
      {petsitter?.possibleLocations && (
        <Box p="md" br="lg" bg="background.box.default.primary">
          <span>케어 가능 지역</span>
          <ItemWrapper>
            {petsitter.possibleLocations.map((location: string) => (
              <Label key={location} size="sm" borderRadius="lg" color="blue">
                <Text size="sm" color="white">
                  {location}
                </Text>
              </Label>
            ))}
          </ItemWrapper>
        </Box>
      )}
      {petsitter?.possibleDays && (
        <Box p="md" br="lg" bg="background.box.default.primary">
          <span>케어 가능 요일</span>
          <ItemWrapper>
            {petsitter.possibleDays.map((day: string) => {
              const matchedDay = weekdays.find((weekday) => weekday.value === day);
              return (
                <Label key={day} size="sm" borderRadius="lg" color="blue">
                  <Text size="sm" color="white">
                    {matchedDay?.label}
                  </Text>
                </Label>
              );
            })}
          </ItemWrapper>
        </Box>
      )}
      {petsitter?.possibleStartTime && petsitter?.possibleEndTime && (
        <Box p="md" br="lg" bg="background.box.default.primary">
          <span>케어 가능 시간</span>
          <Label size="sm" borderRadius="lg" color="blue">
            <Text size="sm" color="white">
              {timeRange(petsitter?.possibleStartTime, petsitter?.possibleEndTime)}
            </Text>
          </Label>
        </Box>
      )}
    </InfoList>
  );
}

const InfoList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ItemWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;
