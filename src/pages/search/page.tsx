import NavHeader from '@components/headers/NavigationHeader';
import Results from './component/Results';
import SearchBox from './component/SearchBox';

export default function SearchPage() {
  return (
    <>
      <NavHeader />

      <SearchBox />

      <Results />
    </>
  );
}
