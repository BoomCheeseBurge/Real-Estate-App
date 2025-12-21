import { USER_ROLES } from "@/constants/data";
import { Text } from "react-native";

export default function RoleBadge({ role }: { role: string }) {

    return (
        <Text className={`${role === USER_ROLES.ADMIN ? 'bg-yellow-400/10 text-yellow-500 inset-ring-yellow-400/20' : 'bg-pink-400/10 text-pink-400 inset-ring-pink-400/20' } rounded-md px-2 py-1 text-xs font-medium inset-ring self-start`}>
            {role === USER_ROLES.ADMIN ? 'Admin' : 'Agent'}
        </Text>
    );
}