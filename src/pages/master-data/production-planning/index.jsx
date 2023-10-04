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
import { IconCalendarOff, IconPencil, IconRecycle, IconReplace, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductionPlanningPageIndex() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const data = [
    {
      machine: "RW 5",
      product: "",
      quantity: "",
      start_date: "",
      start_shift: "",
      start_time: "",
      total_hour: "",
    },
    {
      machine: "",
      product: "",
      quantity: "",
      start_date: "",
      start_shift: "",
      start_time: "",
      total_hour: "",
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
            <th>Machine</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Start Date</th>
            <th>Start Shift</th>
            <th>Start Time</th>
            <th>No Planning</th>
            <th>Revision</th>
            <th>Total Hour</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {itemsToDisplay.map((item, index) => (
            <tr key={index}>
              <td>{item.machine}</td>
              <td>{item.product}</td>
              <td>{item.quantity}</td>
              <td>{item.start_date}</td>
              <td>{item.start_shift}</td>
              <td>{item.start_time}</td>
              <td>
                <Button>
                  <IconCalendarOff size={"1.2rem"}/>
                </Button>
              </td>
              <td>{item.total_hour}</td>
              <td>
                <Button color="green">
                  <IconReplace size={"1.2rem"}/>
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

ProductionPlanningPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
