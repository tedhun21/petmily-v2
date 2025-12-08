import Box from '@/components/styled/Box';
import styled from '@emotion/styled';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

const ads = ['/imgs/HomeTitleAd.svg', '/imgs/HomeTitleAd.svg', '/imgs/HomeTitleAd.svg'];

export default function AdSwiper() {
  const delay = 5000 / ads.length;
  return (
    <CustomSwiper modules={[Pagination]} pagination={{ dynamicBullets: true, clickable: true }} autoplay={{ delay }}>
      {ads.map((ad, index) => (
        <SwiperSlide key={index}>
          <Box w="100%">
            <AdImage src={ad} alt="ad" />
          </Box>
        </SwiperSlide>
      ))}
    </CustomSwiper>
  );
}

const CustomSwiper = styled(Swiper)`
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const AdImage = styled.img`
  width: 100%;
`;
