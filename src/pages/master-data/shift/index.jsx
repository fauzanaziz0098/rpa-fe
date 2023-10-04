import {
  Avatar,
  Button,
  Table,
  Text,
  TextInput,
  Container,
  Pagination,
  MANTINE_COLORS,
} from "@mantine/core";
import { IconCalendarOff, IconPencil, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ShiftPageIndex() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const data = [
    {
      name: "SHIFT 1",
      time_start: "00:10:00",
      time_end: "07:30:00",
    },
    {
      name: "SHIFT 2",
      time_start: "07:31:00",
      time_end: "16:10:00",
    },
    {
      name: "SHIFT 1",
      time_start: "16:11:00",
      time_end: "23:59:00",
    },
  ];

  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const itemsToDisplay = data.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
            <th>Time Start</th>
            <th>Time End</th>
            <th>No Plan</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {itemsToDisplay.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.time_start}</td>
              <td>{item.time_end}</td>
              <td>
                <Button>
                  <IconCalendarOff size={"1.2rem"}/>
                </Button>
              </td>
              <td style={{ display: "flex", gap: "5px" }}>
                <Button color="indigo">
                  <IconCalendarOff size={"1.2rem"} />
                </Button>
                <Button color="yellow">
                  <IconPencil size={"1.2rem"} />
                </Button>
                <Button color="red">
                  <IconTrash size={"1.2rem"} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Pagination
          total={Math.ceil(data.length / itemsPerPage)}
          value={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

ShiftPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
