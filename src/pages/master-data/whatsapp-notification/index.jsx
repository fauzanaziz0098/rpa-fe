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

export default function NotificationWhatsappPageIndex() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const data = [
    {
      name: "RW 5",
      contact_number: "+628371293",
      type: "Personal",
    },
    {
      name: "RW 6",
      contact_number: "+628671293",
      type: "Personal",
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
      </div>
      <Table verticalSpacing={10}>
        <thead>
          <tr style={{ borderTop: '1px solid gray' }}>
            <th>Name</th>
            <th>Contact Number</th>
            <th>Type</th>
            <th>Contact Notification</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {itemsToDisplay.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.contact_number}</td>
              <td>{item.type}</td>
              <td>
                <Button>
                  <IconBell size={'1.2rem'}/>
                </Button>
              </td>
              <td style={{ display: "flex", gap: "5px" }}>
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

NotificationWhatsappPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
