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
import axiosPlanning from '@/libs/planning/axios'
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import Link from "next/link";

export default function ProductPageIndex() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [productToDelete, setProductToDelete] = useState(null)

  const [openedDelete, setOpenedDelete] = useState(false);

  useEffect(() => {
    if (searchValue != "") {
      setProducts(
        rows.filter(item => {
          return item.part_name.toLowerCase().includes(searchValue)
        })
      )
    } else {
      const fetchUser = async () => {
        try {
          const {data} = await axiosPlanning.get('product', getHeaderConfigAxios())
          setProducts(data.data)
        } catch (error) {
          console.log(error, 'error fetch data products');
        }
      }
      fetchUser()
    }
  }, [searchValue])

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rows = products.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleModalDelete = (id) => {
    setOpenedDelete(true)
    setProductToDelete(id)
  }

  const handleDelete = async () => {
    try {
      await axiosPlanning.delete(`product/${productToDelete}`, getHeaderConfigAxios());
      setOpenedDelete(false)
      setTimeout(() => {
        setProducts(products.filter((product) => product.id !== productToDelete));
      }, 200);
    } catch (error) {
      console.log(error, 'error delete product');
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
            <Button color="violet">Import</Button>
            <Button>
              <Link style={{ textDecoration: 'none', color: 'white' }} href="/master-data/product/create">Create</Link>
            </Button>
          </div>
        </div>
        <Table verticalSpacing="xs" fontSize="xs" highlightOnHover>
          <thead>
            <tr>
              <th>Part Name</th>
              <th>Part Number</th>
              <th>Cycle Time</th>
              <th>Unit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length == 0 ? (
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
                <td>{item?.part_name}</td>
                <td>{item?.part_number}</td>
                <td>{item?.cycle_time}</td>
                <td>{item?.unit}pcs</td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <Button color="yellow" component={Link} href={`/master-data/product/${item.id}`}>
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
            total={Math.ceil(products.length / itemsPerPage)}
            value={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

ProductPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
