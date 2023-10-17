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
import { IconAlertCircle, IconCalendarOff, IconPencil, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import axiosPlanning from '@/libs/planning/axios'
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import Link from "next/link";
import { showNotification } from "@mantine/notifications";

export default function ShiftPageIndex() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [shift, setShift] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [ShiftToDelete, setShiftToDelete] = useState(null)

  const [openedDelete, setOpenedDelete] = useState(false);
  
  const [openNoPlan, setOpenNoPlan] = useState(false);
  const [openModalDeleteNoPlan, setOpenModalDeleteNoPlan] = useState(false);
  const [noPlans, setNoPlans] = useState([])
  const [noPlanToDelete, setNoPlanToDelete] = useState(null)

  useEffect(() => {
      const fetchShift = async () => {
        try {
          const {data} = await axiosPlanning.get(`shift?filter.name=${searchValue}`, getHeaderConfigAxios())
          console.log(data);
          setShift(data.data)
        } catch (error) {
          console.log(error, 'error fetch data shift');
        }
      }
      fetchShift()
  }, [searchValue])

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rows = shift.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleModalNoPlan = async (shiftId) => {
    setOpenNoPlan(true)
    const {data} = (await axiosPlanning.get(`no-plan-machine/shift/${shiftId}`)).data
    setNoPlans(data)
  }

  const handleModalDelete = (id) => {
    setOpenedDelete(true)
    setShiftToDelete(id)
  }
  const handleModalDeleteNoPlan = (id) => {
    setOpenModalDeleteNoPlan(true)
    setNoPlanToDelete(id)
  }

  const handleDelete = async () => {
    try {
      await axiosPlanning.delete(`shift/${ShiftToDelete}`, getHeaderConfigAxios());
      setOpenedDelete(false)
      setTimeout(() => {
        setShift(shift.filter((shift) => shift.id !== ShiftToDelete));
        showNotification({
          title: "Success",
          message: "Shift deleted successfully.",
          color: "teal",
          icon: <IconAlertCircle size={16} />,
        });
      }, 200);
    } catch (error) {
      showNotification({
        title: "Success",
        message: "Shift failed to delete.",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
      console.log(error, 'error delete shift');
    }
  }

  const handleDeleteNoPlan = async () => {
    try {
      await axiosPlanning.delete(`no-plan-machine/${noPlanToDelete}`, getHeaderConfigAxios());
      setOpenModalDeleteNoPlan(false)
      setOpenNoPlan(false)
      setTimeout(() => {
        setNoPlans(noPlans.filter((noPlan) => noPlan.id !== noPlanToDelete));
        showNotification({
          title: "Success",
          message: "No Plan deleted successfully.",
          color: "teal",
          icon: <IconAlertCircle size={16} />,
        });
      }, 200);
    } catch (error) {
      showNotification({
        title: "Failed",
        message: (typeof error?.response?.data?.message == 'object' ? error?.response?.data?.message?.map(item => item + ', ') : error?.response?.data?.message) || "Connection Error",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
      console.log(error, 'error delete noPlans');
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
        {/* Modal Delete Shift */}
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

      {/* Modal Delete No Plan */}
        <Modal
          opened={openModalDeleteNoPlan}
          onClose={() => setOpenModalDeleteNoPlan(false)}
          title="Are you sure want to delete this?"
          zIndex={100}
          // centered
        >
          <div style={{ display: 'flex', justifyContent:'center', gap: '1.2rem', padding: '1rem' }}>
            <Button onClick={() => setOpenModalDeleteNoPlan(false)}>Cancel</Button>
            <Button onClick={handleDeleteNoPlan} color="red">Delete</Button>
          </div>
      </Modal>

      {/* Modal Show No Plan */}
      <Modal
        opened={openNoPlan}
        onClose={() => setOpenNoPlan(false)}
        title="No Plan Machine"
        centered
        size="70%"
        zIndex={10}
      >
        <Table>
          <thead>
            <tr>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Total</th>
              <th>Day</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {noPlans.map((item, index) => (
              <tr key={index}>
                <td>{item.time_in}</td>
                <td>{item.time_out}</td>
                <td>{item.total}</td>
                <td>{item.day}</td>
                <td style={{ display: 'flex', gap: '5px' }}>
                  <Button color="yellow" component={Link} href={`/master-data/shift/no-plan-machine/edit/${item.id}`}>
                    <IconPencil size={"1.2rem"} />
                  </Button>
                  <Button onClick={() => handleModalDeleteNoPlan(item.id)} color="red">
                    <IconTrash size={"1.2rem"} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
            <Button style={{ textDecoration: 'none', color: 'white' }} href="/master-data/shift/create" component={Link}>
              Create
            </Button>
          </div>
        </div>
        <Table verticalSpacing="xs" fontSize="xs" highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Time Start</th>
              <th>Time End</th>
              <th>No Plan</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shift.length == 0 ? (
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
                <td>{item?.time_start}</td>
                <td>{item?.time_end}</td>
                <td>
                  <Button onClick={() => handleModalNoPlan(item.id)}>
                    <IconCalendarOff size={"1.2rem"} />
                  </Button>
                </td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <Button color="indigo" component={Link} href={`/master-data/shift/no-plan-machine/${item.id}`}>
                    <IconCalendarOff size={"1.2rem"} />
                  </Button>
                  <Button color="yellow" component={Link} href={`/master-data/shift/${item.id}`}>
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
            total={Math.ceil(shift.length / itemsPerPage)}
            value={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

ShiftPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
