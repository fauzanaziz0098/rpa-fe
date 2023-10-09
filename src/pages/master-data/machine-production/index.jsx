import { Avatar, Button, Table, Text, TextInput } from "@mantine/core";
import { IconPencil, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";

export default function CustomerPageIndex() {
  const router = useRouter();
  const icon = (
    <IconSearch style={{ color: "gray", width: "1rem", height: "1rem" }} />
  );
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextInput
          mt="md"
          //rightSectionPointerEvents="none"
          rightSection={icon}
          label="Search"
          placeholder="Search"
          style={{ width: "10rem", marginBottom: "2rem" }}
        />
        <Button>Create</Button>
      </div>
      <Table verticalSpacing={10}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>RW 5</td>
            <td style={{ display: "flex", gap: "5px" }}>
              <Button color="yellow">
                <IconPencil size={"1.2rem"} />
              </Button>
              <Button color="red">
                <IconTrash size={"1.2rem"} />
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

CustomerPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
