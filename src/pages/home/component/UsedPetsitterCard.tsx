import styled from 'styled-components';
import { PiStarFill } from 'react-icons/pi';

import { timeRange, weekdays } from 'utils/date';
import { Column, ImageCentered, RoundedImageWrapper, Row, Texts12h16 } from 'styles/commonStyle';
import { Petsitter } from 'types/user.type';
import { Link } from 'react-router-dom';

interface IProps {
  petsitter: Petsitter;
}

export default function UsedPetsitterCard({ petsitter }: IProps) {
  console.log(petsitter);
  const possibleTimeRange = timeRange(petsitter?.possibleStartTime ?? null, petsitter?.possibleEndTime ?? null);

  return (
    <Card to={`/users/${petsitter.nickname}`}>
      <ImageWrapper>
        <ImageCentered
          src={petsitter?.photo ? `${petsitter.photo}` : '/imgs/DefaultUserProfile.jpg'}
          alt="petsitter_photo"
        />
      </ImageWrapper>

      <InfoContainer>
        <div style={{ display: 'flex' }}>
          <span>{petsitter?.nickname}</span>
          <span>·</span>
          {petsitter.star && (
            <StarWrapper>
              <PiStarFill size="16px" color="#279EFF" />
              <span>{petsitter?.star}</span>
            </StarWrapper>
          )}
        </div>
        <PossibleWrapper>
          {petsitter?.possibleDays?.map((day: string, index: number) => {
            const matchedDay = weekdays.find((weekday) => weekday.value === day);
            return <SubTitle key={index}>{matchedDay?.label}</SubTitle>;
          })}
        </PossibleWrapper>
        <PossibleWrapper>
          <SubTitle>{possibleTimeRange}</SubTitle>
        </PossibleWrapper>
      </InfoContainer>
    </Card>
  );
}

const Card = styled(Link)`
  display: flex;
  gap: 8px;
  padding: 12px;
`;

const ImageWrapper = styled(RoundedImageWrapper)`
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;

const InfoContainer = styled(Column)`
  flex: 1;
  justify-content: space-between;
  gap: 8px;
`;

const StarWrapper = styled(Row)`
  align-items: center;
  gap: 4px;
`;

const PossibleWrapper = styled(Row)`
  gap: 4px;
`;

const SubTitle = styled(Texts12h16)`
  color: ${({ theme }) => theme.colors.text.secondary};
`;
