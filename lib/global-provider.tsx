import { useAppwrite } from "@/hook/useAppwrite";
import { createContext, ReactNode, useContext } from "react";
import { getCurrentUser } from "./appwrite";

interface User {
	$id: string;
	name: string;
	email: string;
	avatar: string;
}

interface GlobalContextType {
	isLoggedIn: boolean;
	user: User | null;
	loading: boolean;
	refetch: (newParams?: Record<string, string | number>) => Promise<void>;
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

	return (
		<GlobalContext.Provider value={{
			isLoggedIn,
			user,
			loading,
			refetch,
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