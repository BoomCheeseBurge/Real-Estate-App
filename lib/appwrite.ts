
// import * as Linking from 'expo-linking';
import { FormData } from '@/app/contexts/FormContext';
import { makeRedirectUri } from 'expo-auth-session';
import { ImagePickerAsset } from 'expo-image-picker';
import { openAuthSessionAsync } from 'expo-web-browser';
import { Alert } from 'react-native';
import { Account, Avatars, Client, ID, OAuthProvider, Query, Storage, TablesDB, Teams } from 'react-native-appwrite';

export const config = {

    platform: 'com.expo.restate',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    agentsTableId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_TABLE_ID,
    galleriesTableId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_TABLE_ID,
    reviewsTableId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_TABLE_ID,
    propertiesTableId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_TABLE_ID,
    adminsTeamId: process.env.EXPO_PUBLIC_APPWRITE_ADMINS_TEAM_ID,
    agentsTeamId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_TEAM_ID,
    propertyBucketId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID,
    profilePicBucketId: process.env.EXPO_PUBLIC_APPWRITE_PROFILE_PIC_BUCKET_ID,
}

// /**
//  * Validates that the requested keys in the config object have defined values.
//  * @param keys An array of keys from the config object.
//  * @returns A spreadable object containing the validated key-value pairs.
//  * @throws Error if any of the requested environment variables are missing.
//  */
// export const validateConfig = <K extends keyof typeof config>(keys: K[]) => {

//     const validatedConfig = {} as { [P in K]: string };

//     keys.forEach((key) => {
//         const value = config[key];

//         if (!value) {
//             throw new Error(`Environment variable for ${String(key)} is missing in EXPO_PUBLIC config.`);
//         }

//         // cast to string
//         validatedConfig[key] = value as string;
//     });

//     return { ...validatedConfig };
// };

const validateConfig = () => {

    // Create a copy to avoid mutating the original while checking
    const validatedConfig = {} as { [K in keyof typeof config]: string };

    for (const [key, value] of Object.entries(config)) {

        if (value === undefined || value === null || value === "") {
            throw new Error(
                `Configuration Error: The field "${key}" is missing. ` +
                `Please check your .env file.`
            );
        }
        // Type casting to string because we've verified it's not null/undefined
        validatedConfig[key as keyof typeof config] = value as string;
    }

    return validatedConfig;
};

// Validate all config fields at once
const validatedConfig = validateConfig();

// Initialize AppWrite client
export const client = new Client()
                    .setEndpoint(validatedConfig.endpoint)
                    .setProject(validatedConfig.projectId);

// Initialize AppWrite Teams service
const teams = new Teams(client);

// Initialize AppWrite Buckets service
const storage = new Storage(client);


/**
 * Define functionalities used from AppWrite
 */

// TO Generate an avatar image based on the first and last names
export const avatar = new Avatars(client);

// TO create new user account
export const account = new Account(client);

// TO access the tables database
export const tablesDB = new TablesDB(client);

// ----------------------------------------------------------------------------------------

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

            const userAvatar = `${validatedConfig.endpoint}/avatars/initials?name=${user.name}&width=100&height=100`;

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

async function uploadProfilePicture({ image }: { image: ImagePickerAsset}) {

    try {
        // Upload image file to Appwrite storage bucket
        const uploadedFile = await storage.createFile({
            bucketId: validatedConfig.profilePicBucketId,
            fileId: ID.unique(),
            file: {
                name: image.fileName!,
                type: image.mimeType!,
                size: image.fileSize!,
                uri: image.uri,
            }
        });

        // Return uploaded file ID to store in the user preference object
        return uploadedFile.$id;

    } catch (error) {
        console.error("Upload error:", error);
        throw error; // Re-throw to handle it in the form
    }
}

/**
 * Set the profile picture for the current user.
 * @param image 
 * @returns string
 */
export async function setProfilePicture(image: ImagePickerAsset) {

    try {
        const profilePictureId = await uploadProfilePicture({image});
        
        await account.updatePrefs({
            prefs: {
                "profilePictureId": profilePictureId
            }
        });

        const imageUrl = storage.getFileView({ bucketId: validatedConfig.profilePicBucketId, fileId: profilePictureId});

        return imageUrl;
    } catch (error) {
        Alert.alert("Upload Error", "An error occurred while uploading the profile picture. Please try again.");
        console.log("Error uploading profile picture:", error);
    }
}

/**
 * Remove the profile picture for the current user.
 */
export async function removeProfilePicture() {

    try {

        // Delete the value of the profile picture ID stored in user preferences
        await account.updatePrefs({
            prefs: {
                "profilePictureId": null
            }
        });
        
    } catch (error) {
        console.log("Error removing profile picture:", error);
    }
} 

// ----------------------------------------------------------------------------------------

/**
 * Check if the user is part of the admin team
 * 
 * @param teamId 
 * @returns
 */
export async function isUserInTeam({ teamId }: { teamId: string }): Promise<boolean> {
    
    try {
        // Get the list of teams the current user is a member of
        const userTeams = await teams.list(); 

        // Check if any of the teams in the list matches the target teamId
        const isMember = userTeams.teams.some(team => team.$id === teamId);

        return isMember;

        // Typically goes into this error if the user is not logged in within the app
    } catch (error) {
        console.error("Error checking team membership:", error);
        return false;
    }
}

/**
 * Assign 'Agent' role to validated user
 */
export async function assignToAgentTeam ({ userEmail }: { userEmail: string }): Promise<void> {

    try {
        const response = await teams.createMembership({
            teamId: validatedConfig.agentsTeamId,
            roles: ['member'],
            email: userEmail,
        });
        
    } catch (error) {
        console.log(error);
    }
}

/**
 * Get list of agents
 */
export async function getAgents() {

    try {
        const result = await teams.listMemberships({
            teamId: validatedConfig.agentsTeamId,
        });

        return result;
        
    } catch (error) {
        console.error(error);
        return [];
    }
}

// ----------------------------------------------------------------------------------------

/**
 * Upload property images to AppWrite Storage
 * @param images
 * @returns An array of uploaded file IDs
 */
export async function uploadPropertyImages({ images }: { images: ImagePickerAsset[]}) {

    try {
        // Create a list of upload promises
        const uploadPromises = images.map(async (image) => {

            // Perform Appwrite upload to the bucket
            return await storage.createFile({
                bucketId: validatedConfig.propertyBucketId,
                fileId: ID.unique(),
                file: {
                    name: image.fileName!,
                    type: image.mimeType!,
                    size: image.fileSize!,
                    uri: image.uri,
                }
            });
        });

        // Images are all uploaded at the same time to prevent queueuing
        const uploadedFiles = await Promise.all(uploadPromises);

        // Return the array of File IDs to store in the property database
        return uploadedFiles.map(file => file.$id);

    } catch (error) {
        console.error("Upload error:", error);
        throw error; // Re-throw to handle it in the form
    }
}

/**
 * Insert a new property into the database.
 * @returns void
 */
export async function insertNewProperty(formData: FormData) {

    const user = await getCurrentUser();

    let uploadedImageIds: string[] = [];

    // Handle non-user cases which returns null for user
    if (!user) {
        throw new Error("You must be logged in to perform this action.");
    }

    try {
        uploadedImageIds = await uploadPropertyImages({ images: formData.images });

        const newRecord = {
            name: formData.propertyName, // string (max. 5000) - required
            type: formData.propertyType, // must match one of defined enum values - required
            description: formData.description, // string (max. 5000) - required
            address: "Temporary Address", // string (max. 2000) - required
            price: parseInt(formData.price) || 0, // integer - required
            area: parseFloat(formData.areaSize) || 0, // double - required
            bedrooms: parseInt(formData.beds) || 0, // integer - required
            bathrooms: parseInt(formData.bathrooms) || 0, // integer - required
            rating: 0.0, // double - required
            facilities: formData.facilities, // must be included in defined Enum array - required
            image: formData.images[0]?.uri || "", // uri - required
            agent: user.$id!, // current user ID - required
            images: uploadedImageIds, // array of property image AppWrite IDs - required
            geolocation: "Country", // string - required
        };

        const response = await tablesDB.createRow({
            databaseId: validatedConfig.databaseId,
            tableId: validatedConfig.propertiesTableId,
            rowId: ID.unique(),
            data: newRecord,
            // permissions: [Permission.write(Role.user(idea.userId))]
        });

        return response;
        
    } catch (error) {
        
        // Rollback: delete uploaded images if property insertion fails
        if (uploadedImageIds.length > 0) {

            console.log("Rolling back: Deleting orphaned images...");

            await Promise.all(
                uploadedImageIds.map(id => storage.deleteFile({
                    bucketId: validatedConfig.propertyBucketId, 
                    fileId: id
                }))
            );
        }

        console.error("Appwrite Insertion Error:", error);
        throw error;
    }
}


// ----------------------------------------------------------------------------------------

/**
 * Retrieve the latest properties from the database.
 * @returns An array of the latest property records.
 */
export async function getLatestProperties() {
    
    try {
        const result = await tablesDB.listRows({
            databaseId: validatedConfig.databaseId,
            tableId: validatedConfig.propertiesTableId,
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
            databaseId: validatedConfig.databaseId,
            tableId: validatedConfig.propertiesTableId,
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
            databaseId: validatedConfig.databaseId,
            tableId: validatedConfig.propertiesTableId,
            rowId: id,
            queries: [Query.select(['*', 'agent.*', 'gallery.*', 'reviews.*'])]
        });

        return result;

    } catch (error) {
        console.error(error);
        return null;
    }
}