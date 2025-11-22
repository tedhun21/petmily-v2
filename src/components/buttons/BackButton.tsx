import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

import { Button } from '../styled/Button';

interface IProps {
  link?: string;
}

export default function BackButton({ link }: IProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    return link ? navigate(link) : navigate(-1);
  };
  return (
    <Button type="button" onClick={handleClick} variant="icon" borderRadius="circle" size="xl">
      <FaArrowLeft />
    </Button>
  );
}
