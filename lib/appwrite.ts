
import * as Linking from 'expo-linking';
import { Account, Avatars, Client, OAuthProvider } from 'react-native-appwrite';

export const config = {

    platform: 'com.expo.restate',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
}

export const client = new Client();

client
    .setEndpoint(config.endpoint!)
    .setProject(config.projectID!)
    .setPlatform(config.platform!);

/**
 * Define functionalities used from AppWrite
 */

// TO Generate an avatar image based on the first and last names
export const avatar = new Avatars(client);

// TO create new user account
export const account = new Account(client);

/**
 * Login Authentication
 */
export async function login() {
    
    // Just in case anything goes wrong with the authentication
    try {
        // Redirect to homepage when the authentication succeeds (received OAuth response)
        const redirectUri = Linking.createURL('/');

        // Request OAuth token form Appwrite's Google provider
        const response = await account.createOAuth2Token(
                                                            OAuthProvider.Google,
                                                            redirectUri
                                                        );

        // Check for no response
        if (!response) throw new Error('Failed to login' );

        // Open web session for successfully create OAuth token
        const browserResult = await openAuthSessionAsync(
            response.toString(), // Response from Google
            redirectUri
        );

        // Check if the result from authentication is failed
        if (browserResult.type != 'success') throw new Error('Failed to login');

        // Get the session URL
        const url = new URL(browserResult.url);

        // Get the access token from the URL parameters
        const secret = url.searchParams.get('secret')?.toString();
        const userID = url.searchParams.get('userID')?.toString();

        // Check if any of those params doesn't exist
        if (!secret || !userID) throw new Error('Failed to login');

        // Continue with account session creation
        const session = await account.createSession(userID, secret);

        // Check if session creation failed
        if (!session) throw new Error('Failed to create a session');

        // Session successfully created
        return true;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Logout Functionality
 */
export async function logout() {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * Retrieve logged-in user information
 */
export async function getUser() {
    try {
        const user = await account.get();

        // Check if user ID exists
        if (user.$id) {
            // Create an avatage image based on user initials
            const userAvatar = avatar.getInitials(user.name);

            // return user information
            return {
                ...user,
                avatar: userAvatar.toString()
            }
        }

    } catch (error) {
        console.error(error);
        return null;
    }
}