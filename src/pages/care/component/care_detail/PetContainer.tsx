import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Mousewheel, Pagination } from 'swiper/modules';
import styled from 'styled-components';
import { Column, ImageCentered, RoundedImageWrapper, Row } from 'commonStyle';
import { PetInfoCapsule, PetInfoContainer } from '@pages/care/CareDetail';

export default function PetContainer({ pets }: any) {
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
      {pets?.map((pet: any) => (
        <SwiperSlide key={pet.id}>
          <PetCard>
            <PetImageName>
              <PetImage>
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
  border-radius: 20px;
  box-shadow: ${(props) => props.theme.shadow.dp03};
`;

const PetCard = styled(Column)`
  padding: 20px;
  height: 100%;
  background-color: white;

  justify-content: space-between;
`;

const PetImageName = styled(Row)`
  align-items: center;
  gap: 4px;
`;

const PetImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
`;
