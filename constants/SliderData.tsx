import { ImageSourcePropType } from "react-native";

export type ImageSliderType = {
    title: string;
    image: ImageSourcePropType;
    description: string;
}

export const ImageSlider= [
    {
        title: "Find Your Dream Home",
        image: require('@/assets/images/houses/house-1.jpg'),
        description: "Explore the best properties tailored to your needs."
    },
    {
        title: "Luxury Living",
        image: require('@/assets/images/houses/house-2.jpg'),
        description: "Experience the epitome of comfort and style."
    },
    {
        title: "Affordable Homes",
        image: require('@/assets/images/houses/house-3.jpg'),
        description: "Discover budget-friendly options without compromise."
    },
    {
        title: "Modern Designs",
        image: require('@/assets/images/houses/house-4.jpg'),
        description: "Find homes with contemporary architecture and amenities."
    },
    {
        title: "Prime Locations",
        image: require('@/assets/images/houses/house-5.jpg'),
        description: "Live in the heart of the city with easy access to everything."
    }
];