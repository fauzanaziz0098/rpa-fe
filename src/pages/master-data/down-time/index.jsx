import { Avatar, Button, Table, Text, TextInput } from "@mantine/core";
import { IconPencil, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";

export default function DownTimePageIndex() {
  const router = useRouter();
  const icon = (
    <IconSearch style={{ color: "gray", width: "1rem", height: "1rem" }} />
  );

  const handleHome = () => {
    router.push("/home");
  };
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
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Machine</td>
            <td>Process Problem</td>
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
            <td>Material</td>
            <td>Logistic Problem</td>
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
            <td>Man power</td>
            <td>HR Problem</td>
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
            <td>Jig process welding</td>
            <td>Process Problem</td>
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
            <td>Packing Standar</td>
            <td>Logistic Problem</td>
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

DownTimePageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
