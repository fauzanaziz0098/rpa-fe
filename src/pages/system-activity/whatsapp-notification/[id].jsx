import { useRouter } from "next/router"
import FormControl from "@/components/views/SystemActivity/NotificationWhatsapp/FormControl"
import { Card, Title } from "@mantine/core"

export default function EditNotificationWhatsapp() {
    const router = useRouter()

    return (
    <Card style={{ background: 'transparent' }}>
        <Title size={'1rem'} mb={20}>Edit Notification</Title>
        <FormControl id={router.query?.id}/>
    </Card>
    )
}