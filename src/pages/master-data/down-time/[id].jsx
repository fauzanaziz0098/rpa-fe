import { useRouter } from "next/router"
import FormControl from "@/components/views/MasterData/DownTime/FormControl";
import { Card, Title } from "@mantine/core"

export default function EditUser() {
    const router = useRouter()

    return (
    <Card style={{ background: 'transparent' }}>
        <Title size={'1rem'} mb={20}>Edit Down Time</Title>
        <FormControl id={router.query?.id}/>
    </Card>
    )
}