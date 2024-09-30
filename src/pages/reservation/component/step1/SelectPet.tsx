import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import styled from 'styled-components';
import { ImageCentered, RoundedImageWrapper } from 'commonStyle';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

export default function SelectPet({ pet }: any) {
  const { setValue, watch } = useFormContext();

  const checkedPets = watch('checkedPets') || []; // 선택된 체크박스의 ID 배열을 가져옴
  const petTypes = watch('petType') || [];

  const isChecked = checkedPets.some((p: any) => p.id === pet.id); // pet.id로 체크 여부 판단

  const handleCheckboxChange = () => {
    if (isChecked) {
      // 체크 해제 시 배열에서 pet 제거
      const updatedCheckedPets = checkedPets.filter((p: any) => p.id !== pet.id);
      setValue('checkedPets', updatedCheckedPets);
    } else {
      // 체크 시 배열에 pet 추가
      setValue('checkedPets', [...checkedPets, pet]);
    }
  };

  useEffect(() => {
    const currentPetType = pet.type; // 현재 pet의 타입

    if (isChecked) {
      // 체크박스가 선택된 상태라면
      if (!petTypes.includes(currentPetType)) {
        // petType 배열에 현재 pet의 타입이 없다면 추가
        setValue('petType', [...petTypes, currentPetType]);
      }
    } else {
      // 체크박스가 해제된 상태라면
      if (petTypes.includes(currentPetType)) {
        // petType 배열에서 현재 pet의 타입을 제거
        const updatedPetTypes = petTypes.filter((type: string) => type !== currentPetType);
        setValue('petType', updatedPetTypes);
      }
    }
  }, [isChecked, pet.type, petTypes, setValue]); // isChecked, pet.type, petTypes가 변경될 때마다 실행

  return (
    <PetLabel htmlFor={`checkedPet ${pet.id}`}>
      <PetImageWrapper isChecked={isChecked}>
        <ImageCentered
          src={
            pet.photo
              ? `${BUCKET_URL}${pet.photo.url}`
              : pet.type === 'DOG'
                ? '/imgs/DogProfile.png'
                : pet.type === 'CAT'
                  ? '/imgs/CatProfile.png'
                  : undefined
          }
          alt={
            pet.photo
              ? 'pet_photo'
              : pet.type === 'DOG'
                ? 'default_dog'
                : pet.type === 'CAT'
                  ? 'default_cat'
                  : undefined
          }
        />
      </PetImageWrapper>
      <span>{pet.name}</span>
      {isChecked ? <Check isChecked={isChecked}>✓</Check> : null}
      <input
        id={`checkedPet ${pet.id}`}
        key={pet.id}
        value={pet.id}
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange} // 체크박스 클릭 시 처리
        hidden
      />
    </PetLabel>
  );
}

const PetLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const PetImageWrapper = styled(RoundedImageWrapper)<{ isChecked: boolean }>`
  display: flex;
  cursor: pointer;
  width: 80px;
  height: 80px;
  filter: ${(props) => (props.isChecked ? 'brightness(1.05)' : 'brightness(1)')};
  transform ${(props) => (props.isChecked ? 'scale(1)' : 'scale(0.95)')};
  transition:
    transform 0.3s ease-in-out;
`;

const Check = styled.div<{ isChecked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: ${(props) => props.theme.colors.mainBlue};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  z-index: 2;
  right: 0;
  top: 0;
  border: 1px solid ${(props) => props.theme.colors.subBlue};
  opacity: ${(props) => (props.isChecked ? 1 : 0)};
  transform: ${(props) => (props.isChecked ? 'scale(1)' : 'scale(0.5)')};
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
`;
