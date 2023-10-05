import { Card, Title } from "@mantine/core";
import FormControl from "@/components/views/MasterData/Shift/FormControlNoPlanEdit";
import { useRouter } from "next/router";

export default function CreateNoPlan() {
  const router = useRouter()

  return (
    <Card style={{ background: 'transparent' }}>
      <Title size={'1rem'} mb={20}>Edit No Plan</Title>
      <FormControl id={router.query?.id}/>
    </Card>
  )
}
