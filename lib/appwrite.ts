
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

        // Request OAuth token form Appwrite's Google provider
        const loginUrl = await account.createOAuth2Token({
                            provider: OAuthProvider.Google,
                            success: `${deepLink}`,
                            failure: `${deepLink}`,
                        });

        // Check for no response
        if (!loginUrl) throw new Error('Failed to login' );

        // Open loginUrl and listen for the scheme redirect
        const result = await openAuthSessionAsync(`${loginUrl}`, scheme);

        // Check if the result from authentication is failed
        if (result.type != 'success') throw new Error('Failed to login');

        /**
         * Extract credentials from OAuth redirect URL
         */
        // Get the session URL
        const url = new URL(result.url);

        // Get the access token from the URL parameters
        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        // Check if any of those params doesn't exist
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
    query,
    limit
}: {
    filter: string;
    query: string;
    limit?: number;
}) {
    try {
        // Build the query array
        const buildQuery = [Query.orderDesc('$createdAt')];

        // Apply filters if any
        if (filter && filter != 'All') {
            buildQuery.push(Query.equal('type', filter));
        }

        // Apply search query if any
        if (query) {
            buildQuery.push(
                Query.or([
                    Query.search('name', query),
                    Query.search('address', query),
                    Query.search('type', query)
                ])
            );
        }

        // Apply limit if any
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