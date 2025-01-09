import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useMemo, useState } from 'react';
import useMeasure from 'hooks/useMeasure';
import { CenterContainer } from 'styles/commonStyle';
import useCoords from 'hooks/useCoords';

interface IProps {
  address?: string;
  map: any;
  geocode: any;
}

export default function MapsDrawer({ address, map, geocode }: IProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [contentRef, contentBounds] = useMeasure();
  const headerHeight = 52;
  const { addresses } = geocode;
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

    const centerPosition = new naver.maps.LatLng(addresses[0].y, addresses[0].x);

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

  return (
    <StyledMotionDiv
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      animate={isOpen ? { top: `calc(100% - ${expandedHeight}px)` } : { top: `calc(100% - ${headerHeight}px)` }}
      onDragEnd={onDragEnd}
      dragElastic={0.2}
    >
      <div style={{ width: '100%' }}>
        <DrawerHeader>
          <DrawerHandle />
        </DrawerHeader>
        <Content ref={contentRef}>
          <span>{address}</span>
          <div>
            <button onClick={handleMarkerCenter}>
              <span>주소 위치</span>
            </button>
            <button onClick={handleMyLocation}>
              <span>내 위치</span>
            </button>
          </div>
        </Content>
      </div>
    </StyledMotionDiv>
  );
}

const StyledMotionDiv = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-color: ${({ theme }) => theme.background.primary};
  border-top-left-radius: ${({ theme }) => theme.radius.large};
  border-top-right-radius: ${({ theme }) => theme.radius.large};
  z-index: 1000;
`;

const DrawerHeader = styled(CenterContainer)`
  height: 52px;
`;

const DrawerHandle = styled.div`
  width: 52px;
  height: 4px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.background.highlight};
  cursor: grab;
`;

const Content = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.text.active};
`;
