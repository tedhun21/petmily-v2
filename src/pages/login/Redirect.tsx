import axios from 'axios';
import { useEffect } from 'react';

const Redirect = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const urlParams = new URLSearchParams(window.location.search);
  const idToken = urlParams.get('id_token');
  const accessToken = urlParams.get('access_token');

  console.log('idToken: ', idToken);
  console.log('accessToken:', accessToken);

  useEffect(() => {
    axios.get(`${apiUrl}/auth/google/callback?access_token=${accessToken}`).then((res) => {
      console.log(res);
      window.location.assign(`${apiUrl}/signup/branch`);
    });
  }, []);
  return <div>hi</div>;
};

export default Redirect;
