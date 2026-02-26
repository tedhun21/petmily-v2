import { useFormContext } from 'react-hook-form';
import styled from '@emotion/styled';

import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import { type Pet, PetSpecies } from '@/types/pet.type';
import Flex from '@/components/styled/Flex';

interface PetItemProps {
  pet: Pet;
}

export default function PetItem({ pet }: PetItemProps) {
  const { setValue, watch } = useFormContext();
  const checkedPets = watch('checkedPets') || [];

  const isChecked = checkedPets.some((item: Pet) => item.id === pet.id);

  const handleCheckChange = () => {
    if (isChecked) {
      const updatedCheckedPets = checkedPets.filter((item: Pet) => item.id !== pet.id);
      setValue('checkedPets', updatedCheckedPets);
    } else {
      setValue('checkedPets', [...checkedPets, pet]);
    }
  };

  return (
    <Flex direction="column" alignItems="center" gap="sm">
      <button type="button" onClick={handleCheckChange} css={{ position: 'relative', backgroundColor: 'transparent' }}>
        <PetImage $isChecked={isChecked}>
          <ImageCentered
            src={
              pet.photo
                ? `${pet.photo}`
                : pet.species === PetSpecies.DOG
                  ? '/imgs/DogProfile.png'
                  : pet.species === PetSpecies.CAT
                    ? '/imgs/CatProfile.png'
                    : undefined
            }
            alt="pet_photo"
          />
        </PetImage>

        <Check $isChecked={isChecked}>✓</Check>
      </button>
      <span>{pet.name}</span>
    </Flex>
  );
}

const PetImage = styled(RoundedImageWrapper)<{ $isChecked: boolean }>`
  width: 80px;
  height: 80px;
  transform: ${({ $isChecked }) => ($isChecked ? 'scale(1.05)' : 'scale(1)')};
  transition: transform 0.2s ease-in-out;
`;

const Check = styled.div<{ $isChecked: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ theme }) => theme.space['2xl']};
  height: ${({ theme }) => theme.space['2xl']};
  background-color: ${({ theme }) => theme.colors.background.accent};
  border-radius: ${({ theme }) => theme.radius.circle};
  transform: ${({ $isChecked }) => ($isChecked ? 'scale(1)' : 'scale(0)')};
  transition: transform 0.2s ease-in-out;
  color: ${({ theme }) => theme.colors.text.white};
`;
