import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { IconButton } from '../styled/IconButtonAndLink';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <IconButton type="button" onClick={() => navigate(-1)}>
      <FaArrowLeft size="20px" />
    </IconButton>
  );
}
