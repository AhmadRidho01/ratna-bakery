import { useState, useEffect } from "react";
import api from "../services/api";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useFetch = <T>(url: string): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    // Flag ini mencegah update state kalau komponen sudah unmount
    // Menghindari memory leak

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<{ success: boolean; data: T }>(url);
        if (isMounted) {
          setData(response.data.data ?? null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Terjadi kesalahan";
          setError(message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // cleanup
    };
  }, [url, trigger]);

  const refetch = () => setTrigger((prev) => prev + 1);

  return { data, loading, error, refetch };
};

export default useFetch;
