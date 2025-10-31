import styled from 'styled-components';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const ads = ['/imgs/HomeTitleAd.svg', '/imgs/HomeTitleAd.svg', '/imgs/HomeTitleAd.svg'];

export default function AdSwiper() {
  const delay = 5000 / ads.length;
  return (
    <CustomSwiper modules={[Pagination]} pagination={{ dynamicBullets: true, clickable: true }} autoplay={{ delay }}>
      {ads.map((ad, index) => (
        <SwiperSlide key={index}>
          <AdBox>
            <AdImage src={ad} alt="ad" />
          </AdBox>
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

const AdBox = styled.div`
  width: 100%;
`;

const AdImage = styled.img`
  width: 100%;
`;
