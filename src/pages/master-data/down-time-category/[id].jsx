import { useRouter } from "next/router"
import FormControl from "@/components/views/MasterData/DownTimeCategory/FormControl"
import { Card, Title } from "@mantine/core"

export default function EditDTC() {
    const router = useRouter()

    return (
    <Card style={{ background: 'transparent' }}>
        <Title size={'1rem'} mb={20}>Edit Down Time Category</Title>
        <FormControl id={router.query?.id}/>
    </Card>
    )
}