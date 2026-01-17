import { ImagePickerAsset } from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

// Define valid param type
export type AppwriteParamValue = string | number | boolean | string[] | number[] | ImagePickerAsset[] | undefined;

interface UseAppwriteOptions<T, P extends Record<string, AppwriteParamValue>> {
  fn: (params: P) => Promise<T>;
  params?: Partial<P>;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams: P) => Promise<void>;
}

// Custom hook for managing Appwrite API calls with state handling
export const useAppwrite = <T, P extends Record<string, AppwriteParamValue>>({
        fn, // Async function to fetch data
        params = {} as P, // Parameters for the function
        skip = false, // Whether to skip initial fetch on component mount
    }: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
    
    // Initialize state variables
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!skip);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch data
    const fetchData = useCallback(
        
        async (fetchParams: Partial<P>) => {
            
            setLoading(true);
            setError(null);

            try {
                const result = await fn(fetchParams as P);
                setData(result);

            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
                setError(errorMessage);
                Alert.alert("Error", errorMessage);

            } finally {
                setLoading(false);
            }
        },
        [fn] // Memoize the function to ensure stability unless fn changes
    );

    // Automatically fetch data on component mount, unless 'skip' is true
    useEffect(() => {

        if (!skip) {
            fetchData(params);
        }
    }, []);

    // Refetch data with new parameters if needed
    const refetch = async (newParams: P) => await fetchData(newParams);

    return { data, loading, error, refetch };
};