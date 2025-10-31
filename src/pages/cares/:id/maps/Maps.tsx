import { fetcher } from 'api';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSWR from 'swr';

import MapsDrawer from './component/Drawer';

const NAVER_MAPS_CLIENT_ID = process.env.REACT_APP_NAVER_MAPS_CLIENT_ID;

export default function Maps() {
  const [params] = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapObj, setMapObj] = useState<any>(null);

  const address = params.get('address');

  // 주소(address)로 위도(latitude) 경도(longitude) 불러오기
  const { data: geocode } = useSWR(address ? `/maps/geocode?location=${address}` : null, fetcher);

  useEffect(() => {
    if (geocode && geocode.status === 'OK' && geocode.addresses.length > 0) {
      const { addresses } = geocode;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAPS_CLIENT_ID}`;
      script.async = true;

      // 스크립트를 head에 추가
      document.head.appendChild(script);

      script.onload = () => {
        const { naver } = window as any;

        if (!naver || !mapRef.current || !addresses[0]) return;

        // 마커의 위치
        const markerPosition = new naver.maps.LatLng(addresses[0].y, addresses[0].x);

        // 지도 중심 위치를 마커 위치보다 약간 아래로 이동
        const centerPosition = new naver.maps.LatLng(addresses[0].y - 0.005, addresses[0].x);

        // 지도 생성
        const map = new naver.maps.Map(mapRef.current, {
          center: centerPosition,
          zoom: 15,
        });

        // map 객체를 상태로 설정
        setMapObj(map);

        // 마커 추가
        new naver.maps.Marker({
          position: markerPosition,
          map: map,
        });
      };

      // useEffect 클린업: 언마운트 시 스크립트 삭제
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [geocode]);

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <MapsDrawer address={address ?? undefined} map={mapObj} geocode={geocode ?? undefined} />
    </div>
  );
}
