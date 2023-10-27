import { Card, Title } from "@mantine/core";
import FormControl from "@/components/views/MasterData/DownTime/FormControl";

export default function CreateUser() {
  return (
    <Card style={{ background: 'transparent' }}>
      <Title size={'1rem'} mb={20}>Create New Down TIme</Title>
      <FormControl />
    </Card>
  )
}
