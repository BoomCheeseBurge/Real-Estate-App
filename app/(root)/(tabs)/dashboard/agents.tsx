import MemberList from "@/components/MemberList";
import { DUMMY_AGENTS } from "@/constants/dummy";
import { useAppwrite } from "@/hook/useAppwrite";
import { getAgents } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

export default function Agents() {

    // Global user state
    const { user } = useGlobalContext();

    // Get the agents
    const {
        data: agents,
    } = useAppwrite({
        fn: getAgents,
    });

    return (
        <>
            <MemberList title="Agents" data={DUMMY_AGENTS as any} user={user!} />
        </>
    );
}