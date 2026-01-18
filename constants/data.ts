import icons from "./icons";
import images from "./images";

export const cards = [
  {
    title: "Card 1",
    location: "Location 1",
    price: "$100",
    rating: 4.8,
    category: "house",
    image: images.newYork,
  },
  {
    title: "Card 2",
    location: "Location 2",
    price: "$200",
    rating: 3,
    category: "house",
    image: images.japan,
  },
  {
    title: "Card 3",
    location: "Location 3",
    price: "$300",
    rating: 2,
    category: "flat",
    image: images.newYork,
  },
  {
    title: "Card 4",
    location: "Location 4",
    price: "$400",
    rating: 5,
    category: "villa",
    image: images.japan,
  },
];

export const featuredCards = [
  {
    title: "Featured 1",
    location: "Location 1",
    price: "$100",
    rating: 4.8,
    image: images.newYork,
    category: "house",
  },
  {
    title: "Featured 2",
    location: "Location 2",
    price: "$200",
    rating: 3,
    image: images.japan,
    category: "flat",
  },
];

export const categories = [
  { label: "All", value: "All" },
  { label: "House", value: "House" },
  { label: "Condo", value: "Condo" },
  { label: "Duplex", value: "Duplex" },
  { label: "Studio", value: "Studio" },
  { label: "Villa", value: "Villa" },
  { label: "Apartment", value: "Apartment" },
  { label: "Townhouse", value: "Townhouse" },
  { label: "Other", value: "Other" },
];

export const settings = [
  {
    label: "My Bookings",
    icon: icons.calendar,
  },
  {
    label: "Payments",
    icon: icons.wallet,
  },
  {
    label: "Profile",
    icon: icons.person,
  },
  {
    label: "Notifications",
    icon: icons.bell,
  },
  {
    label: "Security",
    icon: icons.shield,
  },
  {
    label: "Language",
    icon: icons.language,
  },
  {
    label: "Help Center",
    icon: icons.info,
  },
  {
    label: "Invite Friends",
    icon: icons.people,
  },
];

export const facilities = [
  {
    label: "Laundry",
    icon: icons.laundry,
  },
  {
    label: "Car Parking",
    icon: icons.carPark,
  },
  {
    label: "Sports Center",
    icon: icons.run,
  },
  {
    label: "Cutlery",
    icon: icons.cutlery,
  },
  {
    label: "Gym",
    icon: icons.dumbell,
  },
  {
    label: "Swimming Pool",
    icon: icons.swim,
  },
  {
    label: "Wi-fi",
    icon: icons.wifi,
  },
  {
    label: "Pet-friendly",
    icon: icons.dog,
  },
];

export const gallery = [
  {
    id: 1,
    image: images.newYork,
  },
  {
    id: 2,
    image: images.japan,
  },
  {
    id: 3,
    image: images.newYork,
  },
  {
    id: 4,
    image: images.japan,
  },
  {
    id: 5,
    image: images.newYork,
  },
  {
    id: 6,
    image: images.japan,
  },
];

// -----------------------------------------------------
// Search Filter Options

export const searchFilter = {
  minPrice: 1000,
  maxPrice: 10000,
  minBuilding: 500,
  maxBuilding: 5000,
  defaultBedroom: 1,
  defaultBathroom: 1,
  defaultCategories: ['All'],
} as const; // "as const" makes the properties read-only

// -----------------------------------------------------
// Upload Property Form

export const PERIODS = [
    { label: "Monthly", value: "Monthly" },
    { label: "Yearly", value: "Yearly" },
    { label: "One-time", value: "One-time" },
];

// -----------------------------------------------------
// Admin Dashboard

export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
};

export const ADMIN_TILE = [
    { id: '1', label: 'Users', icon: icons.user, path: '/dashboard/users' },
    { id: '2', label: 'Properties', icon: icons.property2, path: '/dashboard/properties' },
    { id: '3', label: 'Agents', icon: icons.agent2, path: '/dashboard/agents' },
];

export const AGENT_TILE = [
    { id: '1', label: 'Properties', icon: icons.property2, path: '/dashboard/agents' },
];

// -----------------------------------------------------
// Agent Form Field Options

export const GENDER = [
    { value: 'Male', label: 'Male'},
    { value: 'Female', label: 'Female'},
];