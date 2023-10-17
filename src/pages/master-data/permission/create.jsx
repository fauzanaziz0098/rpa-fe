import { Card, Title } from "@mantine/core";
import FormControl from "@/components/views/MasterData/Permission/FormControl";

export default function CreatePermission() {
  return (
    <Card style={{ background: 'transparent' }}>
      <Title size={'1rem'} mb={20}>Create New Permission</Title>
      <FormControl />
    </Card>
  )
}
