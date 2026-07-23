import { useEffect, useState } from "react";

export function useAPI({ queryParams }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)
        const response = await fetch(
          `https://jscamp-api.vercel.app/api/jobs?${queryParams}`,
        );
        const json = await response.json();
        setData(json);
      } catch (error) {
        setError(true);
        console.error("Error fetching jobs", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [queryParams]);

  return {
    loading,
    error,
    data,
  };
}
