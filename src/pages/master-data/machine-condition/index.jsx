import { Avatar, Button, Table, Text, TextInput } from "@mantine/core";
import {
  IconPencil,
  IconPrinter,
  IconScan,
  IconSearch,
  IconTrash,
} from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";

export default function MachineConditionPageIndex() {
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
            <th>Machine</th>
            <th>Machine Condition</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>RW 5</td>
            <td>
              <ul>
                <li>Zero set position machine</li>
                <li>Zero set position jig</li>
                <li>Co2 Gas</li>
                <li>Welding Jig</li>
              </ul>
            </td>
            <td style={{ display: "flex", gap: "5px" }}>
              <Button>
                <IconPrinter size={"1.2rem"} />
              </Button>
              <Button color="yellow">
                <IconPencil size={"1.2rem"} />
              </Button>
              <Button color="red">
                <IconTrash size={"1.2rem"} />
              </Button>
            </td>
          </tr>
          <tr>
            <td>MAKINO PS 65</td>
            <td>
              <ul>
                <li>Coolant</li>
                <li>Lubricant Oil</li>
                <li>Air Presure</li>
                <li>Chip Conveyor</li>
                <li>Safety Device</li>
              </ul>
            </td>
            <td style={{ display: "flex", gap: "5px" }}>
              <Button>
                <IconPrinter size={"1.2rem"} />
              </Button>
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

MachineConditionPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
