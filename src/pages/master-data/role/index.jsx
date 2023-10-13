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
  Card,
} from "@mantine/core";
import { IconAlertCircle, IconPencil, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import axiosAuth from '@/libs/auth/axios'
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import Link from "next/link";
import { getCookie } from "cookies-next";
import Error from "next/error";

export default function RolePageIndex({errors}) {
  
  if (errors) {
    return (
        <Card p={"xl"}>
            <Error title={"Forbidden "} statusCode={403} />
        </Card>
    );
  }
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [roles, setRoles] = useState([])
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {data} = await axiosAuth.get(`roles?filter.name=${searchValue}`, getHeaderConfigAxios())
        setRoles(data.data)
      } catch (error) {
        console.log(error, 'error fetch data roles');
      }
    }
    fetchUser()
  }, [searchValue])

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rows = roles.slice(startIndex, endIndex);

  useEffect(() => {
    
  },[searchValue])

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
          <Button component={Link} href="/master-data/role/create">Create</Button>
        </div>
        <Table verticalSpacing="xs" fontSize="xs" highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Guard Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.length == 0 ? (
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
                <td>{item?.guard_name ?? '-'}</td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <Button color="yellow" component={Link} href={`/master-data/role/${item.id}`}>
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
            total={Math.ceil(roles.length / itemsPerPage)}
            value={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

RolePageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps({req, res}) {
  if (!getCookie("permissions", { req, res }).split(",")?.includes("READ:ROLE")) {
    return {
          props: {
              errors: true,
          },
      };
  } else {
      return {
          props: {
              errors: false,
          },
      };
  }
}