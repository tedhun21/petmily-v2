import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Mousewheel, Pagination } from 'swiper/modules';
import styled from 'styled-components';
import { Column, ImageCentered, RoundedImageWrapper, Row } from 'styles/commonStyle';
import { PetInfoCapsule, PetInfoContainer } from '@pages/cares/:id/page';
import { Pet, PetSpecies } from 'types/pet.type';

interface PetContainerProps {
  pets: Pet[];
}

export default function PetContainer({ pets }: PetContainerProps) {
  return (
    <CustomSwiper
      direction={'vertical'}
      slidesPerView={1}
      mousewheel={true}
      pagination={{
        clickable: true,
      }}
      modules={[Mousewheel, Pagination]}
    >
      {pets?.map((pet: Pet) => (
        <SwiperSlide key={pet.id}>
          <PetCard>
            <PetImageName>
              <PetImage>
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
            </PetImageName>
            <PetInfoContainer>
              <PetInfoCapsule>{pet.age}살</PetInfoCapsule>
              <PetInfoCapsule>{pet.gender}</PetInfoCapsule>
              <PetInfoCapsule>{pet.species}</PetInfoCapsule>
              <PetInfoCapsule>{pet.breed}</PetInfoCapsule>
              <PetInfoCapsule>{pet.weight}kg</PetInfoCapsule>
            </PetInfoContainer>
          </PetCard>
        </SwiperSlide>
      ))}
    </CustomSwiper>
  );
}

const CustomSwiper = styled(Swiper)`
  width: 100%;
  height: 140px;
  flex-shrink: 0; /* 부모 크기 줄어듦에 따라 높이 축소 방지 */
  border-radius: ${({ theme }) => theme.radius.large};
  box-shadow: ${({ theme }) => theme.shadow.dp03};
`;

const PetCard = styled(Column)`
  justify-content: space-between;
  height: 100%;
  padding: 20px;
`;

const PetImageName = styled(Row)`
  align-items: center;
  gap: 4px;
`;

const PetImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.line.box.highlight};
`;
