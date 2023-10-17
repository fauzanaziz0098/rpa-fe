import { Card, Title } from "@mantine/core";
import FormControl from "@/components/views/MasterData/MachineProduction/FormControl";

export default function CreateMachine() {
  return (
    <Card style={{ background: 'transparent' }}>
      <Title size={'1rem'} mb={20}>Create New Machine</Title>
      <FormControl />
    </Card>
  )
}
