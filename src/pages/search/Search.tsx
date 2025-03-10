import NavHeader from '@components/headers/NavHeader';
import Results from './component/Results';

export default function Search() {
  return (
    <>
      <NavHeader />

      {/* 검색 결과 */}
      <Results />
    </>
  );
}
