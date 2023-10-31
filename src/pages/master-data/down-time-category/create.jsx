import { Card, Title } from "@mantine/core";
import FormControl from "@/components/views/MasterData/DownTimeCategory/FormControl";

export default function CreateUser() {
  return (
    <Card style={{ background: 'transparent' }}>
      <Title size={'1rem'} mb={20}>Create New Down Time Category</Title>
      <FormControl />
    </Card>
  )
}
