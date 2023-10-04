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
import { IconPencil, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";
import { useState } from "react";

export default function DownTimeCategoryPageIndex() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const data = [
    {
      name: "Process Problem",
    },
    {
      name: "Supply Material",
    },
    {
      name: "Other",
    },
    {
      name: "Planned Down Time",
    },
    {
      name: "Break Down Machine",
    },
    {
      name: "Jig Fixture & Tools Problem",
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {itemsToDisplay.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td style={{ display: "flex", gap: "5px" }}>
                <Button color="yellow">
                  <IconPencil size={"1.2rem"} />
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

DownTimeCategoryPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
