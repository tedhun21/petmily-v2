import { useEffect, useState } from 'react';

export const useCustomQuery = ({ queryFn, enabled }: any) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await queryFn();

        setData(response);
      } catch (error) {
        // setError()
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [enabled]);

  return { data, isLoading, error };
};
