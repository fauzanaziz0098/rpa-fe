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
            <th>Name</th>
            <th>Email</th>
            <th>Alias</th>
            <th>Pic</th>
            <th>HP Number</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>PT ASTRA DAIHATSU MOTOR</td>
            <td>nandarbola@mail.com</td>
            <td>ADM</td>
            <td>STAFF</td>
            <td>08283129438</td>
            <td>KARAWANG</td>
            <td style={{ display: "flex", gap: "5px" }}>
              <Button color="yellow">
                <IconPencil size={"1.2rem"} />
              </Button>
              <Button color="red">
                <IconTrash size={"1.2rem"} />
              </Button>
            </td>
          </tr>
          <tr>
            <td>PT Matra Hillindo Teknologi</td>
            <td>technology@matra-hillindo.com</td>
            <td>PT MHT</td>
            <td>Hillga Richman</td>
            <td>0812321239123</td>
            <td>Jl Telaga Indah no 2</td>
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
