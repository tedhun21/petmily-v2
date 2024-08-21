import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

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

export function setCookie(cookie: string) {
  document.cookie = `access_token=${cookie}; Max-age=3600; path=/;`;
}
export function deleteCookie(cookieName: string) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export async function refreshAccessToken() {
  const refreshToken = getCookie('refresh_token');
  try {
    const response = await axios.post(`${apiUrl}/refreshToken`, {}, { headers: { Refresh: refreshToken } });
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    document.cookie = `access_token=${response.data.accessToken}; path=/;`;
    document.cookie = `refresh_token=${response.data.refreshToken}; path=/; expires=${expirationDate.toUTCString()};`;
    return response.data.accessToken;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
