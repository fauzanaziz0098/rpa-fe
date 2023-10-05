import { useRouter } from "next/router"
import FormControl from "@/components/views/MasterData/Shift/FormControl"
import { Card, Title } from "@mantine/core"

export default function EditShift() {
    const router = useRouter()

    return (
    <Card style={{ background: 'transparent' }}>
        <Title size={'1rem'} mb={20}>Edit Shift</Title>
        <FormControl id={router.query?.id}/>
    </Card>
    )
}