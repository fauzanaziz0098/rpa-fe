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
  Modal,
} from "@mantine/core";
import { IconAlertCircle, IconPencil, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import axiosAuth from '@/libs/auth/axios'
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import Link from "next/link";

export default function PermissionPageIndex() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [permissions, setPermissions] = useState([])

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const {data} = await axiosAuth.get('permissions', getHeaderConfigAxios())
        setPermissions(data.data)
      } catch (error) {
        console.log(error, 'error fetch data permissions');
      }
    }
    fetchPermission()
  }, [])

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rows = permissions.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <ScrollArea>
        <div style={{ textAlign: 'end' }}>
          <Button component={Link} style={{ textDecoration: 'none', color: 'white' }} href="/master-data/permission/create">
            Create
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
        </div>
        <Table verticalSpacing="xs" fontSize="xs" highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            {permissions.length == 0 ? (
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
                <td>{item?.roles?.map(role => (
                  <ul>
                    <li>{role.name}</li>
                  </ul>
                ))}</td>
              </tr>
            ))
            }
          </tbody>
        </Table>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Pagination
            total={Math.ceil(permissions.length / itemsPerPage)}
            value={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

PermissionPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
