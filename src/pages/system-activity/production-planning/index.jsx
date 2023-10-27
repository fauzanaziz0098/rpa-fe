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
  Select,
  Flex,
  Input,
  NumberInput,
} from "@mantine/core";
import { IconAlertCircle, IconPencil, IconScan, IconSearch, IconTrash, IconCalendarOff, IconReplace, IconBox, IconCheck, IconPlayerStop, IconPlayerPause } from "@tabler/icons";
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
import moment from "moment/moment";
import { useForm } from "@mantine/form";

export default function PlanningPageIndex({errors}) {

  if (errors) {
    return (
        <Card p={"xl"}>
            <Error title={"Forbidden "} statusCode={403} />
        </Card>
    );
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [planningProductions, setPlanningProductions] = useState([])
  const [searchValue, setSearchValue] = useState("")

  const [openNoPlan, setOpenNoPlan] = useState(false);
  const [noPlans, setNoPlans] = useState([])

  const [openReject, setOpenReject] = useState({
    isOpen: false,
    data: null,
  })
  
  const [stopPlanModal, setStopPlanModal] = useState(false)

  const [qtyReject, setQtyReject] = useState("")

  const filter = useForm({
    initialValues: {
      status: "",
      qtyReject: "",
    },
  })
  const fetchPlan = async () => {
    try {
      const {data} = await axiosPlanning.get(`planning-production/get-all-data?filter.machine=${searchValue}&filter.status=${filter.values.status}&filter.qtyReject=${filter.values.qtyReject}`, getHeaderConfigAxios())
      setPlanningProductions(data.data)
    } catch (error) {
      console.log(error, 'error fetch data planning productions');
    }
  }
  useEffect(() => {
      fetchPlan()
  }, [filter.values.status, filter.values.qtyReject, searchValue])

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rows = planningProductions.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const statues = [
    {
      label: 'Sudah Selesai',
      value: 'stop'
    },
    {
      label: 'Sedang Berjalan',
      value: 'run'
    },
    {
      label: 'Belum Berjalan',
      value: 'idle'
    },
  ]

  const reject = [
    {
      label: 'Sudah di-input',
      value: '1'
    },
    {
      label: 'Belum di-input',
      value: '0'
    },
  ]

  const icon = (
    <IconSearch style={{ color: "gray", width: "1rem", height: "1rem" }} />
  );

  const searchText = (
    <div style={{ fontWeight: 'bold' }}>Search</div>
  )

  const handleModalNoPlan = async (shiftId) => {
    setOpenNoPlan(true)
    const {data} = (await axiosPlanning.get(`no-plan-machine/shift/${shiftId}`)).data
    setNoPlans(data)
  }

  const handleModalReject = async (id) => {
    setOpenReject({isOpen: true})
    const {data} = (await axiosPlanning.get(`planning-production/${id}`)).data
    setOpenReject({data: data})
  }

  const handleSubmitReject = async () => {
    try {
      await axiosPlanning.patch(`planning-production/${openReject.data.id}`, {qty_reject: qtyReject}, getHeaderConfigAxios());
      showNotification({
        title: "Success",
        message: "Qty reject updated",
        color: "teal",
        icon: <IconCheck size={16} />,
      });
      setOpenReject({isOpen: false, data: null})
    } catch (error) {
      showNotification({
        title: "Failed",
        message: (typeof error?.response?.data?.message == 'object' ? error?.response?.data?.message?.map(item => item + ', ') : error?.response?.data?.message) || "Connection Error",
        icon: <IconAlertCircle />,
        color: "red",
      });
    }
  }

  const stopPlan = async () => {
    try {
      await axiosPlanning.post('planning-production/stop-planning-production', {}, getHeaderConfigAxios())
      setStopPlanModal(false)
       showNotification({
        title: "Success",
        message: "Plan Stopped",
        color: "teal",
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
        showNotification({
        title: "Failed",
        message: (typeof error?.response?.data?.message == 'object' ? error?.response?.data?.message?.map(item => item + ', ') : error?.response?.data?.message) || "Connection Error",
        icon: <IconAlertCircle />,
        color: "red",
      });
    } finally {
      fetchPlan()
    }
  }

  return (
    <div>
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
              </tr>
            </thead>
            <tbody>
              {noPlans.map((item, index) => (
                <tr key={index}>
                  <td>{item.time_in}</td>
                  <td>{item.time_out}</td>
                  <td>{item.total}</td>
                  <td>{item.day}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal>
        <Modal
          transition="fade"
          transitionDuration={600}
          transitionTimingFunction="ease"
          opened={openReject.isOpen}
          onClose={() => setOpenReject({isOpen: false})}
          title="Qty Reject"
          centered
        >
          <NumberInput value={openReject?.data?.qty_reject} label="Qty Reject" mb="sm" onChange={(e) => setQtyReject(e)} />
          <div style={{ display: 'flex', justifyContent:'end' }}>
            <Button onClick={handleSubmitReject}>Submit</Button>
          </div>
      </Modal>

      {/* modal stop plan */}
      <Modal size='auto' opened={stopPlanModal} onClose={() => setStopPlanModal(false)} title="Apakah Anda ingin menghentikan plan?">
        <Flex mt="lg" justify='center' gap='5px'>
          <Button onClick={() => setStopPlanModal(false)} color="red">No</Button>
          <Button onClick={() => stopPlan()}>Yes</Button>
        </Flex>
      </Modal>
      <ScrollArea>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Flex align={'center'} gap={'20px'}>
            <TextInput
              rightSection={icon}
              label={searchText}
              placeholder="Search"
              style={{ width: "10rem"}}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Select
                  label="Status"
                  placeholder="Select Status"
                  data={statues}
                  clearable
                  {...filter.getInputProps("status")}
              />
            <Select
                  label="Qty Reject"
                  placeholder="Select Qty Reject"
                  data={reject}
                  clearable
                  {...filter.getInputProps("qtyReject")}
              />
          </Flex>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button component={Link} style={{ textDecoration: 'none', color: 'white' }} href="/system-activity/production-planning/create">
              Create
            </Button>
          </div>
        </div>
        <Table verticalSpacing="xs" fontSize="xs" highlightOnHover>
          <thead>
            <tr>
              <th>Machine Name</th>
              <th>Product Name</th>
              <th>Qty Planning</th>
              <th>Shift</th>
              <th>Date Time In</th>
              <th>Date Time Out</th>
              <th>No Plan</th>
              {/* <th>Revision</th> */}
              <th>Total Hour</th>
              <th>NG Input</th>
              {filter.values.status == "run" && (
                <th>Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {planningProductions.length == 0 ? (
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
                <td>{item?.machine?.name}</td>
                <td>{item?.product?.part_name}</td>
                <td>{item?.qty_planning}</td>
                <td>{item?.shift?.name}</td>
                <td>{item?.date_time_in ? moment(item?.date_time_in).format("DD-MM-YYYY HH:mm:ss") : '-'}</td>
                <td>{item?.date_time_out ? moment(item?.date_time_out).format("DD-MM-YYYY HH:mm:ss") : '-'}</td>
                <td>
                  <Button onClick={() => handleModalNoPlan(item?.shift?.id)}>
                    <IconCalendarOff size={"1.2rem"} />
                  </Button>
                </td>
                <td>
                  {item?.total_time_actual}
                </td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <Button color="green" onClick={() => handleModalReject(item?.id)}>
                    <IconBox size={"1.2rem"}/>
                  </Button>
                </td>
                {filter.values.status == "run" && (
                  <td>
                    <Button color="red" onClick={() => setStopPlanModal(true)}>
                      <IconPlayerPause fill="white" size={"1.2rem"}/>
                    </Button>
                  </td>
                )}
              </tr>
            ))
            }
          </tbody>
        </Table>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Pagination
            total={Math.ceil(planningProductions.length / itemsPerPage)}
            value={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

PlanningPageIndex.getLayout = (page) => {
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