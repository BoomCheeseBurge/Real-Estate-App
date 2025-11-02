
// import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import { openAuthSessionAsync } from 'expo-web-browser';
import { Account, Avatars, Client, OAuthProvider } from 'react-native-appwrite';

export const config = {

    platform: 'com.expo.restate',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
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