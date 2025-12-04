import { useAppwrite } from "@/hook/useAppwrite";
import { createContext, ReactNode, useContext, useState } from "react";
import { getCurrentUser } from "./appwrite";

export interface FilterParams {
    filter: string[];
    minPrice: number | undefined;
    maxPrice: number | undefined;
    minBuilding: number | undefined;
    maxBuilding: number | undefined;
    bedroomCount: number | undefined;
    bathroomCount: number | undefined;
    query: string | undefined; // The text search query
}

export const DEFAULT_FILTERS: FilterParams = {
    filter: ['All'],
    minPrice: undefined,
    maxPrice: undefined,
    minBuilding: undefined,
    maxBuilding: undefined,
    bedroomCount: undefined,
    bathroomCount: undefined,
    query: undefined,
};

interface User {
	$id: string;
	name: string;
	email: string;
	avatar: any;
}

interface GlobalContextType {
	isLoggedIn: boolean;
	user: User | null;
	loading: boolean;
	refetch: (newParams?: Record<string, string | number>) => Promise<void>;
	filters: FilterParams;
    setFilters: (newFilters: Partial<FilterParams>) => void;
	resetAllFilters: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Goal is to wrap the screens with global context provider
export const GlobalProvider = ({ children }: { children: ReactNode }) => {

	// Get current user data
	const {
		data: user,
		loading,
		refetch
	} = useAppwrite({
		fn: getCurrentUser,
	});

	// Check if user is logged in by converting the truthiness of user data to boolean
	const isLoggedIn = !!user;

	// Filter State
    const [filters, setFilterState] = useState<FilterParams>(DEFAULT_FILTERS);

    // Setter to merge new filters with existing ones
    const setFilters = (newFilters: Partial<FilterParams>) => {
        setFilterState(prevFilters => ({
            ...prevFilters,
            ...newFilters,
        }));
    };

	// Reset Filters
    const resetAllFilters = () => {
        setFilterState(DEFAULT_FILTERS);
    };

	return (
		<GlobalContext.Provider value={{
			isLoggedIn,
			user,
			loading,
			refetch,
			filters,
            setFilters,
			resetAllFilters,
		}}>
			{children}
		</GlobalContext.Provider>
	);
};


/**
 * Helper hook to better use the data from Global Context
 */
export const useGlobalContext = (): GlobalContextType => {
	
	const context =  useContext(GlobalContext);

	// Ensure the hook is used within the GlobalProvider
	if (!context) {
		throw new Error("useGlobalContext must be used within a GlobalProvider");
	}

	return context;
}

export default GlobalProvider;