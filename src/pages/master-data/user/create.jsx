import { Card, Title } from "@mantine/core";
import FormControl from "@/components/views/MasterData/User/FormControl";

export default function CreateUser() {
  return (
    <Card style={{ background: 'transparent' }}>
      <Title size={'1rem'} mb={20}>Create New User</Title>
      <FormControl />
    </Card>
  )
}
