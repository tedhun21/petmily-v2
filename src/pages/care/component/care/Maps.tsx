import axios from 'axios';
import { useEffect, useState } from 'react';

const NaverMapGeoUrl = '/map-geocode/v2/geocode';
const NaverMapStaticUrl = '/map-static/v2/raster';
const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_MAP_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.REACT_APP_NAVER_MAP_CLIENT_SECRET;

export default function Maps({ location }: any) {
  const geo = useState(null);

  const addressWithoutZip = location && location.split(' ').slice(1).join(' ');
  console.log('🚀 ~ Maps ~ addressWithoutZip:', addressWithoutZip);

  // 1. geocode
  // 2. static map

  const headers = { 'X-NCP-APIGW-API-KEY-ID': `${NAVER_CLIENT_ID}`, 'X-NCP-APIGW-API-KEY': `${NAVER_CLIENT_SECRET}` };

  const getGeo = async () => {
    const response = await axios.get(`${NaverMapGeoUrl}?query=${addressWithoutZip}`, {
      headers,
    });
    console.log(response);
    return response;
  };

  async function fetchStaticMap() {
    const response = await axios(`${NaverMapStaticUrl}`, {
      headers,
    });
    console.log(response);
  }

  useEffect(() => {
    if (location) {
      getGeo();
    }
  }, [location]);

  return <div>maps</div>;
}
