export function getCookie(cookieName: string) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === cookieName) {
      return value;
    }
  }
  return null; // 해당 쿠키가 없는 경우
}

export function setCookie(name: string, cookie: string) {
  const oneDayInSeconds = 60 * 60; // '1h'
  document.cookie = `${name}=${cookie}; Max-age=${oneDayInSeconds}; path=/;`;
}
export function removeCookie(cookieName: string) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
