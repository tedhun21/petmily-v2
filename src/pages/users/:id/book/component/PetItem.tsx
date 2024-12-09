import { ImageCentered, RoundedImageWrapper } from 'commonStyle';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

export default function PetItem({ pet }: any) {
  const { setValue, watch } = useFormContext();
  const checkedPets = watch('checkedPets') || [];

  const isChecked = checkedPets.some((item: any) => item.id === pet.id);

  const handleCheckChange = () => {
    if (isChecked) {
      const updatedCheckedPets = checkedPets.filter((item: any) => item.id !== pet.id);
      setValue('checkedPets', updatedCheckedPets);
    } else {
      setValue('checkedPets', [...checkedPets, pet]);
    }
  };

  return (
    <Item onClick={handleCheckChange}>
      <PetImage isChecked={isChecked}>
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
          alt="pet_photo"
        />
      </PetImage>
      <span>{pet.name}</span>
      {isChecked ? <Check isChecked={isChecked}>✓</Check> : null}
    </Item>
  );
}

const Item = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  gap: 8px;
  cursor: pointer;
`;

const PetImage = styled(RoundedImageWrapper)<{ isChecked: boolean }>`
  width: 80px;
  height: 80px;
  transform: ${({ isChecked }) => (isChecked ? 'brightness(1.05)' : 'brightness(1)')};
  transition: transform 0.3s ease-in-out;
`;

const Name = styled.label``;

const Check = styled.div<{ isChecked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.background.highlight};
  opacity: ${({ isChecked }) => (isChecked ? 1 : 0)};
  transform: ${({ isChecked }) => (isChecked ? 'scale(1)' : 'scale(0.5)')};
`;
