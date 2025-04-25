import NavHeader from '@components/headers/NavHeader';
import Results from './component/Results';
import SearchBox from './component/SearchBox';

export default function Search() {
  return (
    <>
      <NavHeader />

      <SearchBox />
      <Results />
    </>
  );
}
