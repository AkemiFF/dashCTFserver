import apiClient from "@/services/api-client"
import { useEffect, useState } from "react"
import useSWR, { type SWRConfiguration } from "swr"

// Fonction fetcher améliorée pour SWR avec gestion d'erreur
const fetcher = async (url: string) => {
  try {
    console.log(`Fetching data from: ${url}`)
    const response = await apiClient.get(url)
    console.log(`Response for ${url}:`, response.data)
    return response.data
  } catch (error: any) {
    console.error(`Error fetching ${url}:`, error)
    // Enrichir l'erreur avec plus d'informations
    const enhancedError = new Error(error.message)
    // @ts-ignore
    enhancedError.status = error.response?.status
    // @ts-ignore
    enhancedError.info = error.response?.data
    // @ts-ignore
    enhancedError.url = url
    throw enhancedError
  }
}
interface CustomSWRConfigProps {
  errorRetryInterval?: number;
  loadingTimeout?: number;
}

interface CustomSWRConfiguration<T>
  extends Omit<SWRConfiguration<T>, 'focusThrottleInterval'>,
  CustomSWRConfigProps {
  focusThrottleInterval?: number;
}

export function useApi<T>(url: string | null, options?: CustomSWRConfiguration<T>) {
  // Déstructuration avec valeurs par défaut
  const {
    errorRetryInterval = 1000,
    loadingTimeout = 3000,
    focusThrottleInterval = 5000,
    ...restOptions
  } = options || {};

  // Configuration SWR avec types explicites
  const swrOptions: SWRConfiguration<T> = {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
    errorRetryInterval,
    focusThrottleInterval,
    ...restOptions,
    onError: (err, key, config) => {
      console.error("SWR Error:", err);
      options?.onError?.(err, key, config);
    },
  };

  const { data, error, isLoading, mutate } = useSWR<T>(
    url ? url : null,
    url ? fetcher : null,
    swrOptions
  );

  // Gestion du timeout personnalisé
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => setTimedOut(true), loadingTimeout);
      return () => clearTimeout(timeout);
    }
    setTimedOut(false);
  }, [isLoading, loadingTimeout]);

  const results = (data as any)?.results;

  return {
    results,
    isLoading: timedOut ? false : isLoading,
    isError: !!error,
    error,
    mutate,
  };
}