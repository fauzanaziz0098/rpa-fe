import { useRouter } from "next/router"
import FormControl from "@/components/views/MasterData/MachineProduction/FormControl"
import { Card, Title } from "@mantine/core"

export default function EditMachine() {
    const router = useRouter()

    return (
    <Card style={{ background: 'transparent' }}>
        <Title size={'1rem'} mb={20}>Edit Machine</Title>
        <FormControl id={router.query?.id}/>
    </Card>
    )
}