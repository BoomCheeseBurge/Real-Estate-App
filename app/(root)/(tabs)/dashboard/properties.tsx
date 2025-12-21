import MemberList from "@/components/MemberList";

export default function Properties() {

    // Get the properties
    // const {
    //     data: properties,
    // } = useAppwrite({
    //     fn: getProperties,
    // });

    return (
        <>
            <MemberList title="Properties" data={[]} />
        </>
    );
}