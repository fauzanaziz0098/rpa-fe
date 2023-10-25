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
  Flex,
  Divider,
  Paper,
} from "@mantine/core";
import { IconAlertCircle, IconBell, IconPencil, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import axiosHour from '@/libs/service_per_hour/axios'
import { showNotification } from "@mantine/notifications";
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import Link from "next/link";
import { getCookie } from "cookies-next";
import Error from "next/error";

export default function NotificationWhatsappPageIndex({errors}) {

  if (errors) {
    return (
        <Card p={"xl"}>
            <Error title={"Forbidden "} statusCode={403} />
        </Card>
    );
  }

  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationWhatsapps, setnotificationWhatsapps] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [notificationToDelete, setNotificationToDelete] = useState(null)

  const [openedDelete, setOpenedDelete] = useState(false);
  const [modalNotification, setModalNotification] = useState({isShow: false, data: null});

  useEffect(() => {
      const fetchNotif = async () => {
        try {
          const {data} = await axiosHour.get(`notification-whatsapp?filter.name=${searchValue}`, getHeaderConfigAxios())
          setnotificationWhatsapps(data.data)
        } catch (error) {
          console.log(error, 'error fetch data notificationWhatsapps');
        }
      }
      fetchNotif()
  }, [searchValue])

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rows = notificationWhatsapps.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleModalDelete = (id) => {
    setOpenedDelete(true)
    setNotificationToDelete(id)
  }

  const handleDelete = async () => {
    try {
      await axiosHour.delete(`notification-whatsapp/${notificationToDelete}`, getHeaderConfigAxios());
      setOpenedDelete(false)
      setTimeout(() => {
        setnotificationWhatsapps(notificationWhatsapps.filter((notif) => notif.id !== notificationToDelete));
        showNotification({
          title: "Success",
          message: "Data deleted successfully.",
          color: "teal",
          icon: <IconAlertCircle size={16} />,
        });
      }, 200);
    } catch (error) {
      console.log(error, 'error delete data');
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
      {/* modal delete */}
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

      {/* modal notif */}
      <Modal
          opened={modalNotification.isShow}
          onClose={() => setModalNotification({isShow: false, data: null})}
          title="Kontak Notifikasi"
          centered
        >
          <div>
            <Flex justify={'space-between'} mt="md">
              <Text w={'100%'}>Nama Kontak:</Text>
              <Text w={'100%'}>{modalNotification?.data?.contact_name}</Text>
            </Flex>
            <Flex justify={'space-between'} mt="sm">
              <Text w={'100%'}>Nomor Kontak:</Text>
              <Text w={'100%'}>{modalNotification?.data?.contact_number}</Text>
            </Flex>
          </div>
          <Divider mt="md" size="sm" color="gray"/>
          <Paper mt="md">
            <Text mt="xs">{modalNotification?.data?.is_line_stops_1 ? '- is_line_stops_1' : ''}</Text>
            <Text mt="xs">{modalNotification?.data?.is_line_stops_10 ? '- is_line_stops_10' : ''}</Text>
            <Text mt="xs">{modalNotification?.data?.is_line_stops_20 ? '- is_line_stops_20' : ''}</Text>
            <Text mt="xs">{modalNotification?.data?.is_line_stops_30 ? '- is_line_stops_30' : ''}</Text>
          </Paper>
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
            <Button style={{ textDecoration: 'none', color: 'white' }} href="/system-activity/whatsapp-notification/create">
              Create
            </Button>
          </div>
        </div>
        <Table verticalSpacing="xs" fontSize="xs" highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Number</th>
              <th>Type</th>
              <th>Contact Notification</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {notificationWhatsapps.length == 0 ? (
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
                <td>{item?.contact_name}</td>
                <td>{item?.contact_number}</td>
                <td>{item?.is_group == false ? 'Person' : 'Group'}</td>
                <td>
                  <Button onClick={() => setModalNotification({isShow: true, data: item})}>
                    <IconBell size={"1.2rem"} />
                  </Button>
                </td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <Button color="yellow" component={Link} href={`/system-activity/whatsapp-notification/${item.id}`}>
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
            total={Math.ceil(notificationWhatsapps.length / itemsPerPage)}
            value={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

NotificationWhatsappPageIndex.getLayout = (page) => {
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