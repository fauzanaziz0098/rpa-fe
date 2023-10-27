import {
    Box,
    Button,
    Card,
    Center,
    Grid,
    Group,
    NumberInput,
    PasswordInput,
    Select,
    TextInput,
    Textarea,
    Title,
  } from "@mantine/core";
  import { useForm } from "@mantine/form";
  import { useEffect, useState } from "react";
  import axiosAuth from "@/libs/auth/axios";
  import axiosPlanning from "@/libs/planning/axios";
  import { getHeaderConfigAxios } from "@/utils/getHeaderConfigAxios";
  import { useRouter } from "next/router";
  import { AxiosError } from "axios";
  import Link from "next/link";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconCheck, IconFaceId, IconFaceIdError } from "@tabler/icons";
  
  export default function FormControl({ id }) {
    const router = useRouter();
    
    const [machines, setMachines] = useState([]);
    const [products, setProducts] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [operators, setOperators] = useState([]);

    const [estimation, setEstimation] = useState("")

    const [visible, setVisible] = useState(false);
  
    const form = useForm({
      initialValues: {
        machine: "",
        product: "",
        shift: "",
        user: "",
        qty_planning: "",
        dandory_time: "",
        remark: ""
      },
    });
  
    useEffect(() => {
      const fetchDataMachines = async () => {
        try {
          const { data } = (await axiosPlanning.get("machine", getHeaderConfigAxios()))
            .data;
          setMachines(
            data.map((item) => ({
              label: item.name,
              value: item.id,
            }))
          );
        } catch (error) {
          console.log(error, "error fetch data machines");
        }
      };
      const fetchDataProducts = async () => {
        try {
          const { data } = (await axiosPlanning.get("product", getHeaderConfigAxios()))
            .data;
          setProducts(
            data.map((item) => ({
              label: item.part_name,
              value: item.id,
            }))
          );
        } catch (error) {
          console.log(error, "error fetch data products");
        }
      };
      const fetchDataShifts = async () => {
        try {
          const { data } = (await axiosPlanning.get("shift", getHeaderConfigAxios()))
            .data;
          setShifts(
            data.map((item) => ({
              label: item.name,
              value: item.id,
            }))
          );
        } catch (error) {
          console.log(error, "error fetch data products");
        }
      };
      const fetchDataOperators = async () => {
        try {
          const { data } = (await axiosAuth.get("users", getHeaderConfigAxios()))
            .data;
          setOperators(
            data.map((item) => ({
              label: item.name,
              value: item.name,
            }))
          );
        } catch (error) {
          console.log(error, "error fetch data products");
        }
      };
      fetchDataProducts();
      fetchDataMachines();
      fetchDataShifts();
      fetchDataOperators();
  
    }, []);

    useEffect(() => {
      if (form.values.product != "" && form.values.qty_planning != "") {
        const product = async() => {
          const prod = (await axiosPlanning.get(`product/${form.values.product}`, getHeaderConfigAxios())).data
          const estimation = ((prod.data.cycle_time * (form.values.qty_planning ? form.values.qty_planning : 0)) / 60).toFixed(0)
          setEstimation(estimation)

          // const prod = (await axiosPlanning.get(`product/${form.values.product}`, getHeaderConfigAxios())).data
          // const estimation = isNaN(form.values.qty_planning * prod.data.cycle_time) ? 0 : form.values.qty_planning * prod.data.cycle_time
          // setEstimation(estimation)
          
        }
        product()
      }
    }, [form.values.product, form.values.qty_planning])

    const handleSubmit = async () => {
      try {
        form.values.qty_planning = Number(form.values.qty_planning)
        form.values.dandory_time = Number(form.values.dandory_time)
          await axiosPlanning.post("planning-production", form.values, getHeaderConfigAxios());
          router.push("/system-activity/production-planning");

          showNotification({
            title: "Success",
            message: "Submit Success👏",
            icon: <IconCheck />,
            color: "teal",
        });
      } catch (error) {
        if (error instanceof AxiosError) {
            showNotification({
                title: "Failed",
                message: (typeof error?.response?.data?.message == 'object' ? error?.response?.data?.message?.map(item => item + ', ') : error?.response?.data?.message) || "Connection Error",
                icon: <IconAlertCircle />,
                color: "red",
            });

        }
    } finally {
        setVisible(false);
    }
    };

    return (
      <div>
          <form
          onSubmit={form.onSubmit(() => handleSubmit())}
          style={{ paddingTop: "10px", paddingBottom: "10px" }}
          >
          <Grid columns={3}>
              <Grid.Col span={1}>
              <Select
                  label="Pilih Mesin"
                  placeholder="Mesin"
                  data={machines}
                  searchable
                  clearable
                  withAsterisk
                  {...form.getInputProps("machine")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <Select
                  label="Pilih Produk"
                  placeholder="Produk"
                  data={products}
                  searchable
                  clearable
                  withAsterisk
                  {...form.getInputProps("product")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <Select
                  label="Pilih Shift"
                  placeholder="Shift"
                  data={shifts}
                  searchable
                  clearable
                  withAsterisk
                  {...form.getInputProps("shift")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <Select
                  label="Pilih Operator"
                  placeholder="Operator"
                  data={operators}
                  searchable
                  clearable
                  withAsterisk
                  {...form.getInputProps("user")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <NumberInput
                  label="Masukkan Qty planning"
                  placeholder="Qty Planning"
                  withAsterisk
                  {...form.getInputProps("qty_planning")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <TextInput
                  readOnly
                  label="Estimasi Selesai"
                  placeholder="0"
                  value={estimation}
                  style={{ overflow: 'hidden' }}
                  rightSection={
                    <Center style={{ background: '#000', color: '#fff', paddingInline: '10px', marginLeft: '10px', height: '100%' }}>Menit</Center>
                  }
                  rightSectionWidth={70}
                  styles={{
                    input: {
                      width: '100%',
                      boxSizing: 'border-box',
                    }
                  }}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <NumberInput
                  label="Dandory Time"
                  placeholder="Dandory Time"
                  {...form.getInputProps("dandory_time")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
                <Textarea
                  label="Catatan"
                  placeholder="Catatan"
                  {...form.getInputProps("remark")}
                >

                </Textarea>
              </Grid.Col>
          </Grid>
  
          <Group position="right" mt="xl">
              <Button color="red" component={Link} href="/system-activity/production-planning">
              Back
              </Button>
              <Button type="submit">Submit</Button>
          </Group>
          </form>
      </div>
    );
  }
  