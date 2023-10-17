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
  Card,
} from "@mantine/core";
import { IconAlertCircle, IconPencil, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import axiosPlanning from '@/libs/planning/axios'
import { showNotification } from "@mantine/notifications";
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import Link from "next/link";
import { getCookie } from "cookies-next";
import Error from "next/error";

export default function MachinePageIndex({errors}) {

  if (errors) {
    return (
        <Card p={"xl"}>
            <Error title={"Forbidden "} statusCode={403} />
        </Card>
    );
  }
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [machines, setMachines] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [machineToDelete, setmachineToDelete] = useState(null)

  const [openedDelete, setOpenedDelete] = useState(false);

  useEffect(() => {
      const fetchUser = async () => {
        try {
          const {data} = await axiosPlanning.get(`machine?filter.name=${searchValue}`, getHeaderConfigAxios())
          setMachines(data.data)
        } catch (error) {
          console.log(error, 'error fetch data machines');
        }
      }
      fetchUser()
  }, [searchValue])

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rows = machines.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleModalDelete = (id) => {
    setOpenedDelete(true)
    setmachineToDelete(id)
  }

  const handleDelete = async () => {
    try {
      await axiosPlanning.delete(`machine/${machineToDelete}`, getHeaderConfigAxios());
      setOpenedDelete(false)
      setTimeout(() => {
        setMachines(machines.filter((machine) => machine.id !== machineToDelete));
        showNotification({
          title: "Success",
          message: "Machine deleted successfully.",
          color: "teal",
          icon: <IconAlertCircle size={16} />,
        });
      }, 200);
    } catch (error) {
      console.log(error, 'error delete machine');
    }
  }

  const icon = (
    <IconSearch style={{ color: "gray", width: "1rem", height: "1rem" }} />
  );

  const searchText = (
    <div style={{ fontWeight: 'bold' }}>Search</div>
  )

  return (
    <div>
        <Modal
          opened={openedDelete}
          onClose={() => setOpenedDelete(false)}
          title="Are you sure want to delete this?"
          // centered
        >
          <div style={{ display: 'flex', justifyContent:'center', gap: '1.2rem', padding: '1rem' }}>
            <Button onClick={() => setOpenedDelete(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="red">Delete</Button>
          </div>
      </Modal>
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
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button>
              <Link style={{ textDecoration: 'none', color: 'white' }} href="/master-data/machine-production/create">Create</Link>
            </Button>
          </div>
        </div>
        <Table verticalSpacing="xs" fontSize="xs" highlightOnHover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {machines.length == 0 ? (
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
                <td>{item?.id}</td>
                <td>{item?.name}</td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <Button color="yellow" component={Link} href={`/master-data/machine-production/${item.id}`}>
                    <IconPencil size={"1.2rem"} />
                  </Button>
                  <Button onClick={() => handleModalDelete(item.id)} color="red">
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
            total={Math.ceil(machines.length / itemsPerPage)}
            value={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

MachinePageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps({req, res}) {
  if (!getCookie("permissions", { req, res }).split(",")?.includes("READ:MACHINE")) {
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