import { useEffect, useState } from "react";

export function useAPI({ searchParams }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://jscamp-api.vercel.app/api/jobs?${searchParams.toString()}`,
          /* `http://localhost:3000/jobs?${searchParams.toString()}`, */
        );
        if(!response.ok) throw new Error(`No se pudo obtener los datos de https://jscamp-api.vercel.app/api/jobs?${searchParams.toString()}`)

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
  }, [searchParams]);

  return {
    loading,
    error,
    data,
  };
}
