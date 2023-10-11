import { Alert, Avatar, Button, Modal, Pagination, Table, Text, TextInput } from "@mantine/core";
import { IconAlertCircle, IconPencil, IconScan, IconSearch, IconTrash } from "@tabler/icons";
import Layout from "../../../components/Layout/App";
import { useRouter } from "next/router";
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import Link from "next/link";
import axiosAuth from "@/libs/auth/axios";
import { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";

export default function CustomerPageIndex() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomer] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [customersToDelete, setCustomersToDelete] = useState(null)

  const [openedDelete, setOpenedDelete] = useState(false);

  useEffect(() => {
    if (searchValue != "") {
      setCustomer(
        rows.filter(item => {
          return item.part_name.toLowerCase().includes(searchValue)
        })
      )
    } else {
      const fetchUser = async () => {
        try {
          const {data} = await axiosAuth.get('client', getHeaderConfigAxios())
          console.log(data.data, 'datafhfhf');
          setCustomer(data.data)
        } catch (error) {
          console.log(error, 'error fetch data customers');
        }
      }
      fetchUser()
    }
  }, [searchValue])

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rows = customers.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleModalDelete = (id) => {
    setOpenedDelete(true)
    setCustomersToDelete(id)
  }

  const handleDelete = async () => {
    try {
      await axiosAuth.delete(`client/${customersToDelete}`, getHeaderConfigAxios());
      setOpenedDelete(false)
      setTimeout(() => {
        setCustomer(customers.filter((client) => client.id !== customersToDelete));
        showNotification({
          title: "Success",
          message: "User deleted successfully.",
          color: "teal",
          icon: <IconAlertCircle size={16} />,
        });
      }, 200);
    } catch (error) {
      console.log(error, 'error delete product');
    }
  }

  const searchText = (
    <div style={{ fontWeight: 'bold' }}>Search</div>
  )

  const icon = (
    <IconSearch style={{ color: "gray", width: "1rem", height: "1rem" }} />
  );
  console.log(customers, 'customers');
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
        <Button component={Link} href="/master-data/customer/create">Create</Button>
      </div>
      <Table verticalSpacing={10}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            {/* <th>Alias</th>
            <th>Pic</th>
            <th>HP Number</th>
            <th>Address</th> */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
            {customers.length == 0 ? (
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
                <td>{item?.code}</td>
                {/* <td>{item?.cycle_time}</td>
                <td>{item?.unit}pcs</td> */}
                <td style={{ display: "flex", gap: "5px" }}>
                  <Button color="yellow" component={Link} href={`/master-data/customer/${item.id}`}>
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
            total={Math.ceil(customers.length / itemsPerPage)}
            value={currentPage}
            onChange={handlePageChange}
          />
        </div>
    </div>
  );
}

CustomerPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
