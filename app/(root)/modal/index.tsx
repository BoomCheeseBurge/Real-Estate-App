import { Link, router } from "expo-router";
import { Text, View } from "react-native";

export default function ModalScreen() {

    const isPresented = router.canGoBack();
    
    return (
        <View className="justify-center flex-1 p-4">
            <Text>Modal Screen</Text>

            {isPresented && <Link href="../">Dismiss modal</Link>}
        </View>
    );
}