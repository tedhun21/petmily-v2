import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Mousewheel, Pagination } from 'swiper/modules';
import styled from 'styled-components';
import { ImageCentered, RoundedImageWrapper } from 'styles/commonStyle';
import { Pet, PetSpecies } from 'types/pet.type';
import { Flex } from '@components/Flex';

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
          <Flex direction="column" justifyContent="space-between">
            <Flex alignItems="center" gap="xs">
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
            </Flex>
            <Flex as="ul">
              <PetInfoCapsule>{pet.age}살</PetInfoCapsule>
              <PetInfoCapsule>{pet.gender}</PetInfoCapsule>
              <PetInfoCapsule>{pet.species}</PetInfoCapsule>
              <PetInfoCapsule>{pet.breed}</PetInfoCapsule>
              <PetInfoCapsule>{pet.weight}kg</PetInfoCapsule>
            </Flex>
          </Flex>
        </SwiperSlide>
      ))}
    </CustomSwiper>
  );
}

const CustomSwiper = styled(Swiper)`
  flex-shrink: 0;
  width: 100%;
  height: 140px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.dp03};
`;

const PetImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;

const PetInfoCapsule = styled.li`
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.colors.background.box.accent.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.text.white};
  ${({ theme }) => theme.typeScale.sm};
`;
