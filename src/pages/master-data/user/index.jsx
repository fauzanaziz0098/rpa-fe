import {
  Avatar,
  Button,
  Table,
  Text,
  TextInput,
  Container,
  Pagination,
  MANTINE_COLORS,
  ScrollArea,
  Alert,
} from "@mantine/core";
import { IconAlertCircle, IconPencil, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import axiosAuth from '@/libs/auth/axios'
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'

export default function UserPageIndex() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([])
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    if (searchValue != "") {
      setUsers(
        rows.filter(item => item.name.includes(searchValue))
      )
    } else {
      const fetchUser = async () => {
        try {
          const {data} = await axiosAuth.get('users', getHeaderConfigAxios())
          setUsers(data.data)
        } catch (error) {
          console.log(error, 'erro fetch data users');
        }
      }
      fetchUser()
    }
  }, [searchValue])

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rows = users.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const icon = (
    <IconSearch style={{ color: "gray", width: "1rem", height: "1rem" }} />
  );

  const searchText = (
    <div style={{ fontWeight: 'bold' }}>Search</div>
  )

  return (
    <div>
      <ScrollArea>
        
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
            label={searchText}
            placeholder="Search"
            style={{ width: "10rem", marginBottom: "2rem" }}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button>Create</Button>
        </div>
        <Table verticalSpacing="xs" fontSize="xs" highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Nip</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length == 0 ? (
              <tr>
                  <td colSpan={'100%'}>
                      <Alert icon={<IconAlertCircle size={16} />} title="Data is empty" color="gray" variant="filled">
                          data kosong atau tidak tersedia
                      </Alert>
                  </td>
              </tr>
            ) : 
            rows?.map((item, index) => (
              <tr key={index}>
                <td>{item?.name}</td>
                <td>{item?.nip ?? '-'}</td>
                <td>{item?.email}</td>
                <td>{item?.role.name}</td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <Button>
                    <IconScan size={"1.2rem"} />
                  </Button>
                  <Button color="yellow">
                    <IconPencil size={"1.2rem"} />
                  </Button>
                  <Button color="red">
                    <IconTrash size={"1.2rem"} />
                  </Button>
                </td>
              </tr>
            ))
            }
          </tbody>
        </Table>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Pagination
            total={Math.ceil(users.length / itemsPerPage)}
            value={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

UserPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
