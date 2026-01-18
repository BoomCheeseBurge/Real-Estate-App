<div align="center">
  <br />
    <a href="https://youtu.be/CzJQEstIiEI" target="_blank">
      <img src="https://github.com/user-attachments/assets/0786e8f8-7070-43b7-b1ac-1bc582b6520e" alt="Project Banner">
    </a>
  <br />
  <div>
    <img src="https://img.shields.io/badge/-Expo-black?style=for-the-badge&logoColor=white&logo=expo&color=000020" alt="expo" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="appwrite" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  </div>

  <h3 align="center">A Real Estate App</h3>

   <div align="center">
     Built this project step by step with the help of JavaScript Mastery on <a href="https://www.youtube.com/@javascriptmastery/videos" target="_blank"><b>JavaScript Mastery</b></a> YouTube.
   </div>

   <div align="center">
    You can view the Figma design associated with this mobile app <a href="https://www.figma.com/design/rpiqHBQsyE5fQudIpWHKbh/Real-Scout---Real-Estate-App?node-id=0-1&t=GJyhpIznL9Yxxybk-1" target="_blank"><b>here</b></a>.
   </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. ⚙️ [Tech Stack](#tech-stack)
2. 📲 [Features](#features)
3. 🤳 [Quick Start](#quick-start)
4. ✍️ [AppWrite Database Seeding](#db-seeding)
5. ⌚ [To Be Added](#to-be-added)

## <a name="tech-stack">⚙️ Tech Stack</a>

- **[Expo](https://expo.dev/)** is an open-source platform for building universal native apps (Android, iOS, web) using JavaScript/TypeScript and React Native. It features file-based routing via Expo Router, fast refresh, native modules for camera/maps/notifications, over-the-air updates (EAS), and streamlined app deployment.

- **[React Native](https://reactnative.dev/)** is a framework for building mobile UIs with React. It enables component‑based, cross-platform development with declarative UI, deep native API support, and is tightly integrated with Expo for navigation and native capabilities.

- **[Appwrite](https://jsm.dev/rn25-appwrite)** is an open-source backend-as-a-service platform offering secure authentication (email/password, OAuth, SMS, magic links), databases, file storage with compression/encryption, real-time messaging, serverless functions, and static site hosting via Appwrite Sites—all managed through a unified console and microservices architecture.

- **[TypeScript](https://www.typescriptlang.org/)** is a statically-typed superset of JavaScript providing type annotations, interfaces, enums, generics, and enhanced tooling. It improves error detection, code quality, and scalability—ideal for robust, maintainable projects.

- **[NativeWind](https://www.nativewind.dev/)** brings Tailwind CSS to React Native and Expo, allowing you to style mobile components using utility-first classes for fast, consistent, and responsive UI design.

- **[Tailwind CSS](https://tailwindcss.com/)** is a utility-first CSS framework enabling rapid UI design via low-level classes. In React Native/Expo, it’s commonly used with NativeWind to apply Tailwind-style utilities to mobile components.

## <a name="features">📲 Features</a>

👉 **Authentication with Google**: Secure and seamless user sign-ins using Google’s authentication service.

👉 **Home Page**: Displays the latest and recommended properties with powerful search and filter functionality.

👉 **Explore Page**: Allows users to browse all types of properties with a clean and intuitive interface.

👉 **Property Details Page**: Provides comprehensive information about individual properties, including images and key details.

👉 **Profile Page**: Customizable user settings and profile management

👉 **Centralized Data Fetching**: Custom-built solution inspired by TanStack’s useQuery for efficient API calls.

👉 **Search Filter**: Find the property you are looking for with specific filters.

👉 **Dashboard Page**: This page is only visible to admin users who can currently access three pages inside; users, properties, and agents.  

👉 **Become an Agent Form**: Users can sign-up to become a property agent through this form. Submitted form currently only logs to console.

👉 **Upload Property Form**: Agent-role based users can upload new properties through this form accessed from the middle of the bottom navigation bar. 

👉 **Pull-to-Refresh Displayed Properties**: Pull gesture from the very top of the screen downwards to refresh displayed properties in the homepage and explore pages.

👉 **Google Maps API**: Select where a property is located at in the form using Google Maps API. Search is not functional but requires a billing account so it doesn't work out-of-the-box.

and many more, including code architecture and reusability

## <a name="quick-start">🤳 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [Expo Go](https://expo.dev/go) (on your mobile phone, of course)

1. Install dependencies

   ```bash
   npm install
   ```

2. **Set Up Environment Variables**

   1. Create a new project in the [AppWrite Console](https://cloud.appwrite.io/console/)
   2. Setup the Google OAuth2 authentication by following the documentation [here](https://appwrite.io/docs/products/auth/oauth2)
   3. Replace <PROJECT_ID> in the app.json file after Google OAuth2 has been setup:
   ```
   {
     "expo": {
       "scheme": "appwrite-callback-<PROJECT_ID>"
     }
   }
   ```
   4. Create a new database in your Appwrite console (Ex: 'development' or 'real-estate-db')
   5. Create the following tables along with their respective attributes:
      - 'agents' table
        - 'name' ( Type: String, Size: 500, Required )
        - 'email' ( Type: Email, Required )
        - 'avatar' ( Type: URL, Required )
        - In the 'Settings' tab, add a role of type 'Any', select all available permissions, and update it.
      - 'galleries' table
        - 'image' ( Type: URL, Required )
      - 'reviews' table
        - 'name' ( Type: String, Size: 500, Required )
        - 'avatar' ( Type: URL, Required )
        - 'review' ( Type: String, Size: 5000, Required )
        - 'rating' ( Type: Float, Min: 0, Max: 5, Required )
      - 'properties' table
        - 'name' ( Type: String, Size: 5000, Required )
        - 'type' ( Type: Enum, Elements: [House, Townhouse, Condo, Duplex, Studio, Villa, Apartment, Other], Required )
        - 'description' ( Type: String, Size: 5000, Required )
        - 'address' ( Type: String, Size: 2000, Required )
        - 'price' ( Type: Integer, Min: 0, Required )
        - 'area' ( Type: Float, Min: 0, Required )
        - 'bedroom' ( Type: Integer, Required )
        - 'bathroom' ( Type: Integer, Required )
        - 'rating' ( Type: Float, Required )
        - 'facilities' ( Type: Enum, Elements: [Laundry, Car Parking, Gym, Wi-fi, Pet-friendly, Sports Center, Cutlery, Swimming Pool], Array )
        - 'image' ( Type: URL, Required )
        - 'images' ( Type: String, Size: 36, Null )
        - 'latitude' ( Type: Float, Min: -90, Max: 90, Null )
        - 'longitude' ( Type: Float, Min: -180, Max: 180, Null )
        - 'geolocation' ( Type: String, Size: 5000, Required )
   6. Create the following relationships.
      - 'properties' table
        - 'agents' table ( Type: One-way, Column key: agent, Relation: Many to one, On deleting a row: Cascade )
        - 'galleries' table ( Type: One-way, Column key: gallery, Relation: One to many, On deleting a row: Cascade )
      - 'reviews' table
        - 'properties' table ( Type: Two-way, Column key: property, Column key: reviews, Relation: Many to one, On deleting a row: Cascade )
   7. Create a bucket storage for storing property images.
      - Go to the 'Storage' section in the AppWrite console
        - Click on the 'Create bucket' button
        - Name it any way you want (perhaps a suggested one can be 'property_images')
        - For testing purposes, go to the 'Settings' tab of the newly created bucket
        - Scroll down to 'Permissions' and add a new role with all CRUD permissions ticked
        - Update the changes
      - Added the newly created bucket ID into your .env file

To test uploading a property using your own AppWrite account, don't forget to add yourself as an agent by using your own AppWrite user ID in the Row ID column when creating a new row in the 'agent' table.

> Also, note that 'galleries' table and its relationship column in the 'properties' table should be deleted in the future since it is currently used for retrieving pre-populated property images.
> In the future, a new column storing an array of property image IDs from the created AppWrite bucket should be stored instead.

Another bucket storage for storing profile images should have been created. However, since AppWrite only allows one bucket storage to be created in a free tier, profile images are only simulated but the necessary code is already provided.

Duplicate `.env.local.example` and rename into `.env.local`. Next, fill in the necessary information within `.env.local` in the root of your project and add the following content:

```env
EXPO_PUBLIC_APPWRITE_PROJECT_ID=
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_DATABASE_ID=
EXPO_PUBLIC_APPWRITE_AGENTS_TABLE_ID=
EXPO_PUBLIC_APPWRITE_GALLERIES_TABLE_ID=
EXPO_PUBLIC_APPWRITE_REVIEWS_TABLE_ID=
EXPO_PUBLIC_APPWRITE_PROPERTIES_TABLE_ID=
EXPO_PUBLIC_APPWRITE_ADMINS_TEAM_ID=
EXPO_PUBLIC_APPWRITE_AGENTS_TEAM_ID=
EXPO_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID=
EXPO_PUBLIC_APPWRITE_PROFILE_PIC_BUCKET_ID=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Replace the values with your actual Appwrite credentials. You can obtain these credentials by signing up & creating a new project on the [**Appwrite Dashboard**](https://jsm.dev/rn25-appwrite).

3. Start the app

   ```bash
   npx expo start
   ```
   > If by chance, any of you guys stumble upon this error just as the user logged in with oauth as follows: "Uncaught error java.io.IOException failed to download remote update". Use this command to start the app (ngrok is already installed as well)

      ```bash
      npx expo start --tunnel
      ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

4. Bundling stuck at 100%?

If you ever get stuck with bundling at 100%, just do the following steps:

- Run this command: `npx expo start --clear`
- Restart expo server

## <a name="db-seeding">✍️ AppWrite Database Seeding</a>

Just in case you guys need to seed the database with dummy data, a special button can perform it.

All you have to do is place this component right under the <SafeAreaView> tag.
```
<Button title="Seed" onPress={seed} />
```
Press the button once to seed the database with dummy data and reload the app.

## <a name="to-be-added">⌚ To Be Added</a>

Plans for the future are to implement the following features:

- [x] Create 'Agent' and 'Admin' roles using the Teams feature provided by Appwrite
- [x] Add an admin-only view dashboard
- [x] Create a form for users to sign-up as an agent
- [x] Enable agent user to upload and view their properties
- [ ] Implement purchase/booking property system based on buy/rent
- [ ] Implement like system
- [ ] Implement comment system (maybe with like system too)
