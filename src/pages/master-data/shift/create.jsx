import { Card, Title } from "@mantine/core";
import FormControl from "@/components/views/MasterData/Shift/FormControl";

export default function CreateShift() {
  return (
    <Card style={{ background: 'transparent' }}>
      <Title size={'1rem'} mb={20}>Create New Shift</Title>
      <FormControl />
    </Card>
  )
}
