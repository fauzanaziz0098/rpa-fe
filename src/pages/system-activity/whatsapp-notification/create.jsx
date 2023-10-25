import { Card, Title } from "@mantine/core";
import FormControl from "@/components/views/SystemActivity/NotificationWhatsapp/FormControl";

export default function CreateNotificationWhatsapp() {
  return (
    <Card style={{ background: 'transparent' }}>
      <Title size={'1rem'} mb={20}>Create New Notification</Title>
      <FormControl />
    </Card>
  )
}
