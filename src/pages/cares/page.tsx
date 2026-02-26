import CareContainer from './components/CareContainer';
import NavHeader from '@/components/headers/NavigationHeader';
import CareFilter from '@/pages/cares/components/CareFilter';

export default function CaresPage() {
  return (
    <>
      <NavHeader />
      <CareFilter />
      <CareContainer />
    </>
  );
}
