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
import { IconBell, IconCalendarOff, IconPencil, IconRecycle, IconReplace, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ReviseActivityPageIndex() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const data = [
    {
      machine: "RW 5",
      qty_planning: "100",
      qty_actual: "120",
      total_breakdown: '130',
      qty_ng: '20',
      date: '28-02-2023',
      shift: 'SHIFT 1',
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
          justifyContent: "start",
          alignItems: "center",
          gap: '2.5rem'
        }}
      >
        <TextInput
          mt="md"
          //rightSectionPointerEvents="none"
          rightSection={icon}
          label="Search Machine"
          placeholder="Search Machine"
          style={{ width: "10rem", marginBottom: "2rem" }}
        />
        <TextInput
          mt="md"
          //rightSectionPointerEvents="none"
          rightSection={icon}
          label="Search"
          placeholder="Search"
          style={{ width: "10rem", marginBottom: "2rem" }}
        />
        <TextInput
          mt="md"
          //rightSectionPointerEvents="none"
          rightSection={icon}
          label="Search"
          placeholder="Search"
          style={{ width: "10rem", marginBottom: "2rem" }}
        />
      </div>
      <Table verticalSpacing={10}>
        <thead>
          <tr style={{ borderTop: '1px solid gray' }}>
            <th>Machine</th>
            <th>Qty.planning</th>
            <th>Qty.actual</th>
            <th>Total Breakdown</th>
            <th>Qty NG</th>
            <th>Date</th>
            <th>Shift</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {itemsToDisplay.map((item, index) => (
            <tr key={index}>
              <td>{item.machine}</td>
              <td>{item.qty_planning}</td>
              <td>{item.qty_actual}</td>
              <td>{item.total_breakdown}</td>
              <td>{item.qty_ng}</td>
              <td>{item.date}</td>
              <td>{item.shift}</td>
              <td style={{ display: "flex", gap: "5px" }}>
                <Button color="yellow">
                  <IconPencil size={"1.2rem"} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Pagination
          total={Math.ceil(data.length / itemsPerPage)}
          value={currentPage}
          onChange={handlePageChange}
        />
      </div> */}
    </div>
  );
}

ReviseActivityPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
