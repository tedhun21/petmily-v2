import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useMemo, useState } from 'react';
import useMeasure from '@/hooks/useMeasure';
import useCoords from '@/hooks/useCoords';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { TbCurrentLocation } from 'react-icons/tb';
import { GrMapLocation } from 'react-icons/gr';
import { Button } from '@/components/styled/Button';
import XButton from '@/components/buttons/XButton';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';

interface MapsDrawerProps {
  address?: string;
  map: any;
  geocode?: any;
}

export default function MapsDrawer({ address, map, geocode }: MapsDrawerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [contentRef, contentBounds] = useMeasure();
  const headerHeight = 52;

  const { latitude, longitude } = useCoords();

  // 초과하지 않게
  const expandedHeight = useMemo(
    () => Math.min((contentBounds?.height ?? 0) + headerHeight, window.innerHeight - headerHeight),
    [contentBounds?.height],
  );

  const onDragEnd = (event: any, info: any) => {
    // info : {point, offset, velocity}
    // offset: 드래그 시작점에서 종료 지점까지 이동한 거리,

    // 드래그의 Y 좌표 이동량을 기준으로 드로어 상태 결정
    const dragDistance = info.offset.y;

    if (dragDistance > 80) {
      setIsOpen(false);
    } else if (dragDistance < -80) {
      setIsOpen(true);
    }
  };

  const handleMarkerCenter = () => {
    const { naver } = window as any;

    const centerPosition = new naver.maps.LatLng(geocode.addresses[0].y - 0.005, geocode.addresses[0].x);

    // 지도 중심 변경
    map.setCenter(centerPosition);
    map.setZoom(15);
  };

  const handleMyLocation = () => {
    const { naver } = window as any;

    const myPosition = new naver.maps.LatLng(latitude, longitude);

    //   <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #237EFF" />
    // <span>📍</span>

    const icon = {
      content: `<div style="width: 20px; height: 20px; border-radius: 50%; background-color: #237EFF" />`,
      anchor: new naver.maps.Point(12, 12), // 아이콘의 앵커 포인트 설정
    };

    // 새 마커 추가
    new naver.maps.Marker({
      position: myPosition,
      map,
      icon: icon,
    });

    // 지도 중심 이동
    map.setCenter(myPosition);
    map.setZoom(15);
  };

  const handleRouteSearch = () => {
    if (geocode && address) {
      const startLng = longitude; // 현재 위치 경도
      const startLat = latitude; // 현재 위치 위도

      // 목적지 경도 및 위도 가져오기
      const endLng = geocode.addresses[0]?.x;
      const endLat = geocode.addresses[0]?.y;

      if (!startLng || !startLat || !endLng || !endLat) {
        console.error('경로를 계산할 수 없습니다. 필요한 좌표가 없습니다.');
        return;
      }

      // 출발지와 도착지 이름 설정 (주소 또는 임의 문자열)
      const startPlace = '내위치'; // 출발지명
      const endPlace = address || '도착지'; // 도착지명

      // URL 생성
      const url = `https://map.naver.com/v5/directions/${startLng},${startLat},${startPlace},,/${endLng},${endLat},${endPlace},,/-/transit`;

      // 새 탭에서 열기
      window.open(url, '_blank');
    } else {
      console.error('Geocode 또는 Address 데이터가 부족합니다.');
    }
  };

  return (
    <StyledMotionDiv
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      animate={isOpen ? { top: `calc(100% - ${expandedHeight}px)` } : { top: `calc(100% - ${headerHeight}px)` }}
      onDragEnd={onDragEnd}
      dragElastic={0.2}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        <Box h="52px">
          <Flex justifyContent="center" alignItems="center">
            <DrawerHandle />
          </Flex>
        </Box>
        <div ref={contentRef}>
          <Flex justifyContent="center" alignItems="center">
            <span>{address}</span>
          </Flex>
          <ButtonWrapper>
            <Button onClick={handleMarkerCenter}>
              <HiOutlineLocationMarker size="24px" />
              <span>주소 위치</span>
            </Button>
            <Button onClick={handleMyLocation}>
              <TbCurrentLocation size="24px" />
              <span>내 위치</span>
            </Button>
            <Button onClick={handleRouteSearch}>
              <GrMapLocation size="24px" />
              <span>길 찾기</span>
            </Button>
          </ButtonWrapper>
        </div>

        {isOpen && (
          <Absolute>
            <XButton onClick={() => setIsOpen(false)} />
          </Absolute>
        )}
      </div>
    </StyledMotionDiv>
  );
}

const StyledMotionDiv = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-top-left-radius: ${({ theme }) => theme.radius.lg};
  border-top-right-radius: ${({ theme }) => theme.radius.lg};
`;

const DrawerHandle = styled.div`
  width: 52px;
  height: ${({ theme }) => theme.space.xs};
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border-radius: ${({ theme }) => theme.space.xl};
  cursor: grab;
`;

const Absolute = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
`;

// TODO
const ButtonWrapper = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.space.xl};
  gap: ${({ theme }) => theme.space.xs};

  button {
    flex: 1;
  }
`;
