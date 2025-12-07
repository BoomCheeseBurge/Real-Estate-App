
// import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import { openAuthSessionAsync } from 'expo-web-browser';
import { Account, Avatars, Client, OAuthProvider, Query, TablesDB } from 'react-native-appwrite';

export const config = {

    platform: 'com.expo.restate',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    agentsTableId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_TABLE_ID,
    galleriesTableId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_TABLE_ID,
    reviewsTableId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_TABLE_ID,
    propertiesTableId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_TABLE_ID,
}

export const client = new Client()
                    .setEndpoint(config.endpoint!)
                    .setProject(config.projectId!);

/**
 * Define functionalities used from AppWrite
 */

// TO Generate an avatar image based on the first and last names
export const avatar = new Avatars(client);

// TO create new user account
export const account = new Account(client);

// TO access the tables database
export const tablesDB = new TablesDB(client);


/**
 * Login Authentication
 */
export async function login() {
    
    // Just in case anything goes wrong with the authentication
    try { 
        // Redirect to homepage when the authentication succeeds (received OAuth response)
        // Create deep link that works across Expo environments
        // Ensure localhost is used for the hostname to validation error for success/failure URLs
        const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
        const scheme = `${deepLink.protocol}//`; // accesses the scheme in app.json based on 'appwrite-callback-<PROJECT_ID>://'

        /**
         * Request OAuth token from Appwrite's Google OAuth provider
         * 
         * Returns the fully constructed URL that points to Appwrite's OAuth endpoint, which will immediately redirect to the official Google sign-in page
         */
        const loginUrl = await account.createOAuth2Token({
                            provider: OAuthProvider.Google,
                            success: `${deepLink}`,
                            failure: `${deepLink}`,
                        });

        // Check for no response from Google OAuth service (by giving general error message for security purposes)
        if (!loginUrl) throw new Error('Failed to login' );

        /**
         * User interacts with the Google login prompt within that opened session
         * 
         * listen for the scheme redirect for the user to return to the app
         */
        const result = await openAuthSessionAsync(`${loginUrl}`, scheme);

        // Check if the result from authentication failed
        if (result.type != 'success') throw new Error('Failed to login');

        /**
         * Get the session URL
         * 
         * Extract credentials from OAuth redirect URL
         */
        const url = new URL(result.url);

        // Get the access token from the URL parameters
        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        // Check if any of those params doesn't exist (by giving general error message for security purposes)
        if (!secret || !userId) throw new Error('Failed to login');

        // Continue with account session creation
        const session = await account.createSession({
                                                        userId, 
                                                        secret
                                                    });

        // Check if session creation failed
        if (!session) throw new Error('Failed to create a session');

        // Session successfully created
        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * Logout Functionality
 */
export async function logout() {

    try {
        await account.deleteSession({ sessionId: 'current' });
        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * Retrieve logged-in user information
 */
export async function getCurrentUser() {
    
    try {
        const user = await account.get();

        // Check if user ID exists
        if (user.$id) {
            // Create an avatage image based on user initials
            // const userAvatar = avatar.getInitials({ name: user.name });

            const userAvatar = `${config.endpoint}/avatars/initials?name=${user.name}&width=100&height=100`;

            // return user information
            return {
                ...user,
                avatar: userAvatar
            }
        }

    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Retrieve the latest properties from the database.
 * @returns An array of the latest property records.
 */
export async function getLatestProperties() {
    try {
        const result = await tablesDB.listRows({
            databaseId: config.databaseId!,
            tableId: config.propertiesTableId!,
            queries: [
                Query.orderAsc('$createdAt'),
                Query.limit(5)
            ]
        });

        return result.rows;

    } catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * Retrieve properties based on filter and search query.
 * @param filter 
 * @param query 
 * @param limit
 * @returns An array of property records matching the criteria.
 */
export async function getProperties({
    filter,
    minPrice,
    maxPrice,
    minBuilding,
    maxBuilding,
    bedroomCount,
    bathroomCount,
    query,
    limit
}: {
    filter: string[];
    minPrice: number | undefined;
    maxPrice: number | undefined;
    minBuilding: number | undefined;
    maxBuilding: number | undefined;
    bedroomCount: number | undefined;
    bathroomCount: number | undefined;
    query: string;
    limit?: number;
}) {
    try {
        // Build the query array
        const buildQuery = [Query.orderDesc('$createdAt')];

        // --- Helper Function to Validate Input ---
        // Converts input safely to a valid number
        const safeNum = (param: string | number | undefined): number | undefined => {
            // Treat empty string/null/undefined as undefined
            if (param === undefined || param === null || param === '') return undefined; 
            
            const num = Number(param);
            return isNaN(num) ? undefined : num;
        };

        // --- Property Type Filtering ---
        // Check if the filter array has items aand does not only contain ['All']
        const activeFilters = filter?.filter(f => f !== 'All');
        
        if (activeFilters && activeFilters.length > 0) {

            // Ensures all property types are included in the query
            const filterQueries = activeFilters.map(f => Query.equal('type', f));
            
            // Only one filter selected (e.g., ['House'])
            if (filterQueries.length === 1) {
                buildQuery.push(filterQueries[0]);

            // Multiple filters selected (e.g., ['House', 'Apartment'])
            } else if (filterQueries.length > 1) {
                buildQuery.push(
                    Query.or(filterQueries)
                );
            }
        }

        // --- Price Range Filtering ---
        const minP = safeNum(minPrice);
        const maxP = safeNum(maxPrice);
        
        // Asumsi nama field adalah 'price'
        if (minP !== undefined) {
            buildQuery.push(Query.greaterThanEqual('price', minP));
        }
        if (maxP !== undefined) {
            buildQuery.push(Query.lessThanEqual('price', maxP));
        }

        // --- Building Size Range Filtering ---
        const minB = safeNum(minBuilding);
        const maxB = safeNum(maxBuilding);

        if (minB !== undefined) {
            buildQuery.push(Query.greaterThanEqual('area', minB));
        }
        if (maxB !== undefined) {
            buildQuery.push(Query.lessThanEqual('area', maxB));
        }

        // --- Room Count Filtering ---
        const bedC = safeNum(bedroomCount);
        const bathC = safeNum(bathroomCount);

        if (bedC !== undefined && bedC >= 1) {
            buildQuery.push(Query.equal('bedrooms', bedC));
        }
        if (bathC !== undefined && bathC >= 1) {
            buildQuery.push(Query.equal('bathrooms', bathC));
        }

        // // Apply filters if any
        // if (filter && filter != 'All') {
        //     buildQuery.push(Query.equal('type', filter));
        // }

        // --- Text Search Query ---
        if (query) {
            buildQuery.push(
                Query.or([
                    Query.search('name', query),
                    Query.search('address', query),
                    Query.search('type', query)
                ])
            );
        }

        // --- Limit Query ---
        if (limit) buildQuery.push(Query.limit(limit));

        const result = await tablesDB.listRows({
            databaseId: config.databaseId!,
            tableId: config.propertiesTableId!,
            queries: buildQuery
        });

        return result.rows;
        
    } catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * Retrieve property details by its ID.
 * @param id The ID of the property to retrieve.
 * @returns The property record if found, otherwise null.
 */
export async function getPropertyById({ id }: { id: string }) {

    try {
        const result = await tablesDB.getRow({
            databaseId: config.databaseId!,
            tableId: config.propertiesTableId!,
            rowId: id,
            queries: [Query.select(['*', 'agent.*', 'gallery.*', 'reviews.*'])]
        });

        return result;

    } catch (error) {
        console.error(error);
        return null;
    }
}