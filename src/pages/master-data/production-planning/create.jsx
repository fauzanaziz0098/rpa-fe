import { Card, Title } from "@mantine/core";
import FormControl from "@/components/views/SystemActivity/ProductionPlanning/FormControl";

export default function CreateShift() {
  return (
    <Card style={{ background: 'transparent' }}>
      <Title size={'1rem'} mb={20}>Create New Plan</Title>
      <FormControl />
    </Card>
  )
}
