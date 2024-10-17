import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import styled from 'styled-components';

import { formatProgress } from 'utils/misc';
import { fetcherWithCookie } from 'api';

import PetsitterCard from './component/care_detail/PetsitterCard';
import PetContainer from './component/care_detail/PetContainer';
import DetailReservation from './component/care_detail/DetailReservation';
import ProgressButton from './component/care_detail/ProgressButton';

const API_URL = process.env.REACT_APP_API_URL;

export default function CareDetail() {
  const { id } = useParams();

  const { data: me } = useSWR(`${API_URL}/users/me`, fetcherWithCookie);
  const { data: reservation } = useSWR(`${API_URL}/reservations/${id}`, fetcherWithCookie);

  console.log(reservation?.review);
  console.log(reservation?.journal);
  return (
    <ReservationContainer>
      <Progress>
        <span>{formatProgress(reservation?.status)}...</span>
      </Progress>
      <PetsitterCard petsitter={reservation?.petsitter} />
      <PetContainer pets={reservation?.pets} />
      {/* <Maps location={reservation?.address} /> */}
      <span>{reservation?.address}</span>
      <DetailReservation reservation={reservation} />

      <ProgressButton meRole={me?.role} reservation={reservation} />
    </ReservationContainer>
  );
}

const ReservationContainer = styled.main`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 20px;
  gap: 20px;
`;

const Progress = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  > span {
    color: ${(props) => props.theme.colors.mainBlue};
    font-weight: ${(props) => props.theme.fontWeights.extrabold};
    ${(props) => props.theme.fontSize.s20h30};
  }
`;

export const PetInfoContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

export const PetInfoCapsule = styled.li`
  padding: 4px 8px;
  border-radius: 16px;
  color: white;
  background-color: ${(props) => props.theme.colors.subBlue};
  ${(props) => props.theme.fontSize.s14h21};
`;

const LocationContainer = styled.div``;
