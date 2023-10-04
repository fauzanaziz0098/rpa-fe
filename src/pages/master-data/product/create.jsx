import { Card, Title } from "@mantine/core";
import FormControl from "@/components/views/MasterData/Product/FormControl";

export default function CreateProduct() {
  return (
    <Card style={{ background: 'transparent' }}>
      <Title size={'1rem'} mb={20}>Create New Product</Title>
      <FormControl />
    </Card>
  )
}
