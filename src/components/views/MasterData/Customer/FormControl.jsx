import {
    Box,
    Button,
    Card,
    Grid,
    Group,
    Select,
    Text,
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
        name: "",
        code: "",
        // part_number: "",
        // cycle_time: "",
        // unit: "",
        // status: "",
      },
    });
    console.log(form, 'form');
  
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
                  const { data } = await axiosAuth.get(`client/${id}`, getHeaderConfigAxios()).then(item => item.data)
                  const clients = await axiosAuth.get(`client/find-one/${data.code}`, getHeaderConfigAxios()).then(item => item.data.data)
                form.setValues({
                        name: data.name,
                        code: data.code,
                        // part_number: data.part_number,
                        // cycle_time: data.cycle_time,
                        // unit: data.unit,
                        // status: data.status,
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
              await axiosAuth.patch(`client/${id}`, form.values, getHeaderConfigAxios());
              router.push("/master-data/customer");
          } else {
              await axiosAuth.post("client", form.values, getHeaderConfigAxios());
              router.push("/master-data/customer");
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
                <TextInput
                    label="Name"
                    placeholder="Name"
                    withAsterisk
                    {...form.getInputProps("name")}
                />
              </Grid.Col>
              <Grid.Col span={1}>
              <TextInput
                  label="Code"
                  placeholder="Code"
                  withAsterisk
                  {...form.getInputProps("code")}
              />
              </Grid.Col>
              {/* <Grid.Col span={1}>
              <TextInput
                  label="Alias"
                  placeholder="Alias"
                  withAsterisk
                  {...form.getInputProps("alias")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <TextInput
                  label="Pic"
                  placeholder="Pic"
                  withAsterisk
                  {...form.getInputProps("Pic")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <TextInput
                  type="number"
                  label="HP Number"
                  placeholder="HP Number"
                  withAsterisk
                  icon={<Text fz={'xs'} fw={600}>+62</Text>}
                  {...form.getInputProps("hp_number")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <TextInput
                  label="Address"
                  placeholder="Address"
                  {...form.getInputProps("address")}
                  withAsterisk
              />
              </Grid.Col> */}
          </Grid>
  
          <Group position="right" mt="xl">
              <Button color="red" component={Link} href="/master-data/customer">
              Back
              </Button>
              <Button type="submit">Submit</Button>
          </Group>
          </form>
      </div>
    );
  }
  