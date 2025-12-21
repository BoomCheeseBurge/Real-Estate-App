import MemberList from "@/components/MemberList";

export default function Users() {

    // Get the users
    // const {
    //     data: users,
    // } = useAppwrite({
    //     fn: getUsers,
    // });

    return (
        <>
            <MemberList title="Users" data={[]} />
        </>
    );
}