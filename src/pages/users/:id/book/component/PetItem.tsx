import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { ImageCentered, RoundedImageWrapper } from 'styles/commonStyle';
import { Pet, PetSpecies } from 'types/pet.type';

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
    <Item onClick={handleCheckChange}>
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
      <span>{pet.name}</span>
      {isChecked ? <Check $isChecked={isChecked}>✓</Check> : null}
    </Item>
  );
}

const Item = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  gap: 8px;
`;

const PetImage = styled(RoundedImageWrapper)<{ $isChecked: boolean }>`
  width: 80px;
  height: 80px;
  transform: ${({ $isChecked }) => ($isChecked ? 'brightness(1.05)' : 'brightness(1)')};
  transition: transform 0.3s ease-in-out;
`;

const Check = styled.div<{ $isChecked: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border-radius: 50%;
  opacity: ${({ $isChecked }) => ($isChecked ? 1 : 0)};
  transform: ${({ $isChecked }) => ($isChecked ? 'scale(1)' : 'scale(0.5)')};
`;
