import {
    Box,
    Button,
    Card,
    Grid,
    Group,
    Select,
    TextInput,
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
import { IconFaceId, IconFaceIdError } from "@tabler/icons";
  
  export default function FormControl({ id }) {
    const router = useRouter();
    const [clients, setClients] = useState([]);
    const [visible, setVisible] = useState(false);
  
    const form = useForm({
      initialValues: {
        client_id: "",
        part_name: "",
        part_number: "",
        cycle_time: "",
        unit: "",
        status: "",
      },
    });
  
    useEffect(() => {
      const fetchDataClients = async () => {
        try {
          const { data } = (await axiosAuth.get("client", getHeaderConfigAxios()))
            .data;
          setClients(
            data.map((item) => ({
              label: item.name,
              value: item.name,
            }))
          );
        } catch (error) {
          console.log(error, "error fetch data clients");
        }
      };
      fetchDataClients();
  
    }, []);

    useEffect(() => {
        if (id) {
            (async (id) => {
                try {
                  const { data } = await axiosPlanning.get(`product/${id}`, getHeaderConfigAxios()).then(item => item.data)
                  const clients = await axiosAuth.get(`client/find-one/${data.client_id}`, getHeaderConfigAxios()).then(item => item.data.data)
                form.setValues({
                        client_id: clients.code,
                        part_name: data.part_name,
                        part_number: data.part_number,
                        cycle_time: data.cycle_time,
                        unit: data.unit,
                        status: data.status,
                    })
                } catch (error) {
                    console.log(error, 'error fetch product data');
                }
            })(id)
        }
    }, [id])
    
  
    const handleSubmit = async () => {
      try {
          if (id) {
              await axiosPlanning.patch(`product/${id}`, form.values, getHeaderConfigAxios());
              router.push("/master-data/product");
          } else {
              await axiosPlanning.post("product", form.values, getHeaderConfigAxios());
              router.push("/master-data/product");
          }
          showNotification({
            title: "Successful Submit",
            message: "Submit Success👏",
            icon: <IconFaceId />,
            color: "teal",
        });
      } catch (error) {
        if (error instanceof AxiosError) {
            showNotification({
                title: "Error Attempting Authorization",
                message: error?.response?.data?.message ?? "Connection Error",
                icon: <IconFaceIdError />,
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
                  label="Client"
                  placeholder="Select Client"
                  data={clients}
                  searchable
                  clearable
                  withAsterisk
                  {...form.getInputProps("client_id")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <TextInput
                  label="Part Name"
                  placeholder="Part Name"
                  withAsterisk
                  {...form.getInputProps("part_name")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <TextInput
                  label="Part Number"
                  placeholder="Part Number"
                  withAsterisk
                  {...form.getInputProps("part_number")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <TextInput
                  type="number"
                  label="Cycle Time"
                  placeholder="Cycle Time"
                  withAsterisk
                  {...form.getInputProps("cycle_time")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <Select
                  label="Status"
                  placeholder="Status"
                  data={[
                  {
                      label: "Active",
                      value: true,
                  },
                  {
                      label: "Non Active",
                      value: false,
                  },
                  ]}
                  clearable
                  withAsterisk
                  {...form.getInputProps("status")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <TextInput
                  type="number"
                  label="Unit"
                  placeholder="Unit"
                  {...form.getInputProps("unit")}
                  withAsterisk
              />
              </Grid.Col>
          </Grid>
  
          <Group position="right" mt="xl">
              <Button color="red" component={Link} href="/master-data/product">
              Back
              </Button>
              <Button type="submit">Submit</Button>
          </Group>
          </form>
      </div>
    );
  }
  