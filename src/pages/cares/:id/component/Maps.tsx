import { fetcher, imageFetcher } from 'api';
import styled from 'styled-components';
import useSWR from 'swr';

const API_URL = process.env.REACT_APP_API_URL;

export default function Maps({ reservation }: any) {
  // 예약에서 latitude와 longitude가 없을 때만 geocode를 요청

  const { data: geocode, error: geocodeError } = useSWR(
    reservation?.address ? `${API_URL}/maps/geocode?location=${reservation?.address}` : null,
    fetcher,
  );

  const { data: staticMaps, error: staticMapsError } = useSWR(
    geocode && geocode.status === 'OK' && geocode.addresses.length > 0 // geocode 유효성 체크
      ? `${API_URL}/maps/static?longitude=${geocode.addresses[0].x}&latitude=${geocode.addresses[0].y}`
      : null,
    imageFetcher,
  );

  // 에러 핸들링
  if (geocodeError || staticMapsError) {
    return <div>Error loading map data</div>;
  }

  // 로딩 상태 처리
  if (!geocode || !staticMaps) {
    return <div>Loading...</div>;
  }

  const blobUrl = URL.createObjectURL(new Blob([staticMaps], { type: 'image/jpg,jpeg' }));
  return (
    <LocationImageWrapper>
      <LocationImg src={blobUrl} alt="Static Map" />
    </LocationImageWrapper>
  );
}

const LocationImageWrapper = styled.div`
  display: flex;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadow.dp03};
`;

const LocationImg = styled.img`
  width: 100%;
`;
