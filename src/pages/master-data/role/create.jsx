import { Card, Title } from "@mantine/core";
import FormControl from "@/components/views/MasterData/Role/FormControl";

export default function CreateProduct() {
  return (
    <Card style={{ background: 'transparent' }}>
      <Title size={'1rem'} mb={20}>Create New Role</Title>
      <FormControl />
    </Card>
  )
}
