import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      className="flex-1 items-center justify-center bg-white"
    >
      	<Text className="font-bold font-rubik text-3xl my-10">Welcome to ReState</Text>
		<Text className="text-xl font-bold text-blue-500">
			Powered by Nativewind and Expo Go
		</Text>

		<Link href="/sign-in">Sign In</Link>
		<Link href="/explore">Explore</Link>
		<Link href="/profile">Profile</Link>
		<Link href="/properties/1">Properties</Link>
    </View>
  );
}
