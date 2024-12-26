import styled from 'styled-components';
import { ModalLayOut } from '../SearchBox';
import { Column, Divider, Row, Texts12h18 } from 'styles/commonStyle';
import { useFormContext } from 'react-hook-form';

const locations = ['강남구', '강동구', '서초구', '용산구', '종로구'];

export default function LocationModal({ setIsSelected }: any) {
  const { setValue } = useFormContext();

  const handleCapsuleClick = (e: React.MouseEvent, city: string, location: string) => {
    e.stopPropagation();
    setValue('location', `${city} ${location}`);
    setIsSelected('date');
  };

  return (
    <ModalLayOut>
      <Content>
        {
          <>
            <div>
              <Texts12h18>최근 검색 내역</Texts12h18>
            </div>
            <Divider orientation="vertical" thickness="1px" />
          </>
        }
        <SeoulContainer>
          <Texts12h18>서울</Texts12h18>
          <List>
            {locations.map((location) => (
              <Capsule key={location} onClick={(e) => handleCapsuleClick(e, '서울', location)}>
                {location}
              </Capsule>
            ))}
          </List>
        </SeoulContainer>
      </Content>
    </ModalLayOut>
  );
}

const Content = styled(Row)`
  gap: 12px;
`;

const SeoulContainer = styled(Column)`
  gap: 16px;
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Capsule = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 32px;
  border: 1px solid ${({ theme }) => theme.line.box.default};
  padding: 8px 20px;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeight.light};
  ${({ theme }) => theme.fontSize.s14h21};

  &:hover {
    border: 1px solid ${({ theme }) => theme.line.box.highlight};
  }

  &:active {
    transform: scale(0.95);
    transition: transform 0.1s ease-out;
  }
`;
