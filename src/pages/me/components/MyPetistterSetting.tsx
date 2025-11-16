import { PiCatBold, PiDogBold } from 'react-icons/pi';
import styled from 'styled-components';
import { Text } from '@components/Text';
import { PetSpecies } from 'types/pet.type';
import { timeRange, weekdays } from 'utils/date';
import Box from '@components/Box';
import { flex } from '@components/Flex';

export default function MyPetsitterSettings({ petsitter }: any) {
  return (
    <InfoList>
      {petsitter?.possiblePetSpecies && (
        <InfoItem>
          <span>케어 가능 동물</span>
          <ItemWrapper>
            {petsitter.possiblePetSpecies.map((species: PetSpecies) => (
              <ItemLabel as="li" key={species}>
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
              <ItemLabel as="li" key={location}>
                <Text size="sm" color="white">
                  {location}
                </Text>
              </ItemLabel>
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
              return (
                <ItemLabel as="li" key={day}>
                  <Text size="sm" color="white">
                    {matchedDay?.label}
                  </Text>
                </ItemLabel>
              );
            })}
          </ItemWrapper>
        </InfoItem>
      )}
      {petsitter?.possibleStartTime && petsitter?.possibleEndTime && (
        <InfoItem>
          <span>케어 가능 시간</span>
          <ItemLabel as="li">
            <Text size="sm" color="white">
              {timeRange(petsitter?.possibleStartTime, petsitter?.possibleEndTime)}
            </Text>
          </ItemLabel>
        </InfoItem>
      )}
    </InfoList>
  );
}

const InfoList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InfoItem = styled(Box).attrs(() => ({ p: 'md', br: 'lg', bg: 'background.box.default.primary' }))`
  ${flex({ direction: 'column', gap: 'sm' })}
`;

const ItemWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

// TODO
const ItemLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.colors.text.highlight};
  border-radius: ${({ theme }) => theme.radius.md};
`;
