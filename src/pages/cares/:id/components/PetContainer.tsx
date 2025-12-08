import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import styled from '@emotion/styled';
import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import { PetSpecies } from '@/types/pet.type';
import type { Pet } from '@/types/pet.type';

import Flex from '@/components/styled/Flex';
import { Label } from '@/components/styled/Label';
import Box from '@/components/styled/Box';

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
          <Box w="100%" p="md" br="lg" shadow="dp03">
            <Flex direction="column" gap="md">
              <Flex alignItems="center" gap="sm">
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
              <Flex as="ul" gap="xs" css={{ flexWrap: 'wrap' }}>
                <Label size="sm">{pet.age}살</Label>
                <Label size="sm">{pet.gender}</Label>
                <Label size="sm">{pet.species}</Label>
                <Label size="sm">{pet.breed}</Label>
                <Label size="sm">{pet.weight}kg</Label>
              </Flex>
            </Flex>
          </Box>
        </SwiperSlide>
      ))}
    </CustomSwiper>
  );
}

const CustomSwiper = styled(Swiper)`
  width: 100%;
`;

const PetImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;
