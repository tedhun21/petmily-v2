interface SearchItem {
  id: number;
  name: string;
}

// 데이터 저장
export const saveToRecentSearch = (key: string, data: string) => {
  if (typeof window === 'undefined') return;

  const currentData = localStorage.getItem(key);
  const current: SearchItem[] = currentData ? JSON.parse(currentData) : [];

  const exist = current.some((search: SearchItem) => search.name === data);
  if (exist) return;

  if (current.length > 5) {
    current.pop();
  }
  const newData = { id: Date.now(), name: data };

  localStorage.setItem(key, JSON.stringify([newData, ...current]));
};

// 데이터 불러오기
export const getRecentSearches = (key: string) => {
  if (typeof window === 'undefined') return [];

  const recentSearches = localStorage.getItem(key);
  return recentSearches ? JSON.parse(recentSearches) : [];
};

// 데이터 삭제
export const deleteRecentSearch = (key: string, id: number) => {
  if (typeof window === 'undefined') return;

  const currentData = localStorage.getItem(key);
  const current = currentData ? JSON.parse(currentData) : [];

  const filtered = current.filter((search: SearchItem) => search.id !== id);

  if (filtered.length === 0) {
    localStorage.removeItem(key);
    return;
  }

  localStorage.setItem(key, JSON.stringify(filtered));
};
