import { ID } from "react-native-appwrite";
import { config, tablesDB } from "./appwrite";
import {
    agentImages,
    galleryImages,
    propertiesImages,
    reviewImages,
} from "./data";

const TABLES = {
  AGENT: config.agentsTableId,
  REVIEWS: config.reviewsTableId,
  GALLERY: config.galleriesTableId,
  PROPERTY: config.propertiesTableId,
};

const propertyTypes = [
  "House",
  "Townhouse",
  "Condo",
  "Duplex",
  "Studio",
  "Villa",
  "Apartment",
  "Other",
];

const facilities = [
  "Laundry",
  "Parking",
  "Gym",
  "Wifi",
  "Pet-friendly",
];

/**
 * Get a random subset of an array with a size between minItems and maxItems.
 * @param array The input array.
 * @param minItems The minimum number of items to include in the subset.
 * @param maxItems The maximum number of items to include in the subset.
 * @returns A random subset of the input array.
 */
function getRandomSubset<T>(
  array: T[],
  minItems: number,
  maxItems: number
): T[] {

    if (minItems > maxItems) 
    {
        throw new Error("minItems cannot be greater than maxItems");
    }
    if (minItems < 0 || maxItems > array.length) 
    {
        throw new Error("minItems or maxItems are out of valid range for the array");
    }

    // Generate a random size for the subset within the range [minItems, maxItems]
    const subsetSize =
    Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

    // Create a copy of the array to avoid modifying the original
    const arrayCopy = [...array];

    // Shuffle the array copy using Fisher-Yates algorithm
    for (let i = arrayCopy.length - 1; i > 0; i--) 
    {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [arrayCopy[i], arrayCopy[randomIndex]] = [
            arrayCopy[randomIndex],
            arrayCopy[i],
        ];
    }

    // Return the first `subsetSize` elements of the shuffled array
    return arrayCopy.slice(0, subsetSize);
}


/**
 * Seed the database with initial data.
 */
async function seed() {

    try {
        // Clear existing data from all tables by looping through each table
        for (const key in TABLES) {

            // Get the table ID for the current table
            const tableId = TABLES[key as keyof typeof TABLES];

            // List all rows in the current table
            const rows = await tablesDB.listRows({
                databaseId: config.databaseId!,
                tableId: tableId!,
            });
            
            // Delete each row in the current table
            for (const row of rows.rows) {

                await tablesDB.deleteRow({
                    databaseId: config.databaseId!,
                    tableId: tableId!,
                    rowId: row.$id
                });
            }
        }

        console.log("Cleared all existing data.");

        // ---------------------------------------------------------------------

        /**
         * Seed Agents Table
         */
        const agents = [];

        // Create 5 agents
        for (let i = 1; i <= 5; i++) {

            const agent = await tablesDB.createRow({
                databaseId: config.databaseId!,
                tableId: TABLES.AGENT!,
                rowId: ID.unique(),
                data: {
                    name: `Agent ${i}`,
                    email: `agent${i}@example.com`,
                    avatar: agentImages[Math.floor(Math.random() * agentImages.length)],
                }
            });

            agents.push(agent);
        }

        console.log(`Seeded ${agents.length} agents.`);

        // ---------------------------------------------------------------------

        /**
         * Seed Reviews Table
         */
        const reviews = [];

        // Create 20 reviews
        for (let i = 1; i <= 20; i++) {

            const review = await tablesDB.createRow({
                databaseId: config.databaseId!,
                tableId: TABLES.REVIEWS!,
                rowId: ID.unique(),
                data: {
                    name: `Reviewer ${i}`,
                    avatar: reviewImages[Math.floor(Math.random() * reviewImages.length)],
                    review: `This is a review by Reviewer ${i}.`,
                    rating: Math.floor(Math.random() * 5) + 1, // Rating between 1 and 5
                }
            });
            
            reviews.push(review);
        }
        
        console.log(`Seeded ${reviews.length} reviews.`);

        // ---------------------------------------------------------------------

        /**
         * Seed Galleries Table
         */
        const galleries = [];
        
        // Create galleries based on galleryImages
        for (const image of galleryImages) {

            const gallery = await tablesDB.createRow({
                databaseId: config.databaseId!,
                tableId: TABLES.GALLERY!,
                rowId: ID.unique(),
                data: { image }
            });

            galleries.push(gallery);
        }

        console.log(`Seeded ${galleries.length} galleries.`);

        // ---------------------------------------------------------------------

        /**
         * Seed Properties Table
         */

        // Create 20 properties
        for (let i = 1; i <= 20; i++) {

            const assignedAgent = agents[Math.floor(Math.random() * agents.length)];

            const assignedReviews = getRandomSubset(reviews, 5, 7); // 5 to 7 reviews
            const assignedGalleries = getRandomSubset(galleries, 3, 8); // 3 to 8 galleries

            const selectedFacilities = facilities
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * facilities.length) + 1);

            // Select an image for the property
            const image =
                propertiesImages.length - 1 >= i
                ? propertiesImages[i]
                : propertiesImages[
                    Math.floor(Math.random() * propertiesImages.length)
                    ];

            const property = await tablesDB.createRow({
                databaseId: config.databaseId!,
                tableId: TABLES.PROPERTY!,
                rowId: ID.unique(),
                data: {
                    name: `Property ${i}`,
                    type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
                    description: `This is the description for Property ${i}.`,
                    address: `123 Property Street, City ${i}`,
                    geolocation: `192.168.1.${i}, 192.168.1.${i}`,
                    price: Math.floor(Math.random() * 9000) + 1000,
                    area: Math.floor(Math.random() * 3000) + 500,
                    bedrooms: Math.floor(Math.random() * 5) + 1,
                    bathrooms: Math.floor(Math.random() * 5) + 1,
                    rating: Math.floor(Math.random() * 5) + 1,
                    facilities: selectedFacilities,
                    image: image,
                    agent: assignedAgent.$id,
                    reviews: assignedReviews.map((review) => review.$id),
                    gallery: assignedGalleries.map((gallery) => gallery.$id),
                }
            });

            console.log(`Seeded property: ${property.name}`);
        }

        console.log("Data seeding completed.");
  
    } catch (error) {
        console.error("Error seeding data:", error);
    }
}

export default seed;