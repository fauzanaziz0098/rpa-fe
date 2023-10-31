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
import axiosLossTime from '@/libs/losstime/axios'
import { showNotification } from "@mantine/notifications";
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import Link from "next/link";
import { getCookie } from "cookies-next";
import Error from "next/error";

export default function DownTimeCategoryPageIndex({errors}) {

  if (errors) {
    return (
        <Card p={"xl"}>
            <Error title={"Forbidden "} statusCode={403} />
        </Card>
    );
  }

  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [downTimeCategories, setDownTimeCategories] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [downTimeCategoryToDelete, setDownTimeCategoryToDelete] = useState(null)

  const [openedDelete, setOpenedDelete] = useState(false);

  useEffect(() => {
      const fetchDTC = async () => {
        try {
          const {data} = await axiosLossTime.get(`category-line-stop?search=${searchValue}`, getHeaderConfigAxios())
          setDownTimeCategories(data.data)
        } catch (error) {
          console.log(error, 'error fetch data downTimeCategories');
        }
      }
      fetchDTC()
  }, [searchValue])

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rows = downTimeCategories.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleModalDelete = (id) => {
    setOpenedDelete(true)
    setDownTimeCategoryToDelete(id)
  }

  const handleDelete = async () => {
    try {
      await axiosLossTime.delete(`category-line-stop/${downTimeCategoryToDelete}`, getHeaderConfigAxios());
      setOpenedDelete(false)
      setTimeout(() => {
        setDownTimeCategories(downTimeCategories.filter((dtc) => dtc.id !== downTimeCategoryToDelete));
        showNotification({
          title: "Success",
          message: "dtc deleted successfully.",
          color: "teal",
          icon: <IconAlertCircle size={16} />,
        });
      }, 200);
    } catch (error) {
      console.log(error, 'error delete dtc');
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
              <Link style={{ textDecoration: 'none', color: 'white' }} href="/master-data/down-time-category/create">Create</Link>
            </Button>
          </div>
        </div>
        <Table verticalSpacing="xs" fontSize="xs" highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {downTimeCategories.length == 0 ? (
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
                <td style={{ display: "flex", gap: "5px" }}>
                  <Button color="yellow" component={Link} href={`/master-data/down-time-category/${item.id}`}>
                    <IconPencil size={"1.2rem"} />
                  </Button>
                </td>
              </tr>
            ))
            }
          </tbody>
        </Table>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Pagination
            total={Math.ceil(downTimeCategories.length / itemsPerPage)}
            value={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

DownTimeCategoryPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps({req, res}) {
  if (!getCookie("permissions", { req, res }).split(",")?.includes("READ:USER")) {
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