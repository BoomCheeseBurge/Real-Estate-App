import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      className="flex-1 items-center justify-center bg-white"
    >
      	<Text className="font-bold text-lg my-10">Welcome to the Real Estate App</Text>
		<Text className="text-xl font-bold text-blue-500">
			Welcome to Nativewind!
		</Text>
		<Link href="/sign-in">Sign In</Link>
        <Link href="/explore">Explore</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/properties">Properties</Link>
    </View>
  );
}
