import Results from './component/Results';
import NavHeader from '@components/headers/NavHeader';

export default function Search() {
  return (
    <>
      <NavHeader />

      {/* 검색 결과 */}
      <Results />
    </>
  );
}
