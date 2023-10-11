import { useRouter } from "next/router"
import FormControl from "@/components/views/MasterData/Customer/FormControl"
import { Card, Title } from "@mantine/core"

export default function EditProduct() {
    const router = useRouter()

    return (
    <Card style={{ background: 'transparent' }}>
        <Title size={'1rem'} mb={20}>Edit Product</Title>
        <FormControl id={router.query?.id}/>
    </Card>
    )
}