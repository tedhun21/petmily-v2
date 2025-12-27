import { PiCatBold, PiDogBold } from 'react-icons/pi';
import styled from '@emotion/styled';
import Text from '@/components/styled/Text';
import { PetSpecies } from '@/types/pet.type';
import type { PetSpeciesType } from '@/types/pet.type';
import { timeRange, weekdays } from '@/utils/date';
import Box from '@/components/styled/Box';
import { Label } from '@/components/styled/Label';
import type { Petsitter } from '@/types/user.type';
import Flex from '@/components/styled/Flex';

export default function MyPetsitterSettings({ petsitter }: { petsitter: Petsitter }) {
  return (
    <InfoList>
      {petsitter?.possiblePetSpecies && (
        <Box p="md" br="lg" bg="background.box.default.primary">
          <Flex direction="column" gap="md">
            <span>케어 가능 동물</span>
            <ItemWrapper>
              {petsitter.possiblePetSpecies.map((species: PetSpeciesType) => (
                <Label key={species} size="sm" borderRadius="lg" color="blue">
                  {species === PetSpecies.DOG ? (
                    <PiDogBold size="20px" color="white" />
                  ) : species === PetSpecies.CAT ? (
                    <PiCatBold size="20px" color="white" />
                  ) : null}
                </Label>
              ))}
            </ItemWrapper>
          </Flex>
        </Box>
      )}
      {petsitter?.possibleLocations && (
        <Box p="md" br="lg" bg="background.box.default.primary">
          <Flex direction="column" gap="md">
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
          </Flex>
        </Box>
      )}
      {petsitter?.possibleDays && (
        <Box p="md" br="lg" bg="background.box.default.primary">
          <Flex direction="column" gap="md">
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
          </Flex>
        </Box>
      )}
      {petsitter?.possibleStartTime && petsitter?.possibleEndTime && (
        <Box p="md" br="lg" bg="background.box.default.primary">
          <Flex direction="column" gap="md">
            <span>케어 가능 시간</span>
            <Label size="sm" borderRadius="lg" color="blue">
              <Text size="sm" color="white">
                {timeRange(petsitter?.possibleStartTime, petsitter?.possibleEndTime)}
              </Text>
            </Label>
          </Flex>
        </Box>
      )}
    </InfoList>
  );
}

const InfoList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.space.sm};
`;

const ItemWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xs};
`;
