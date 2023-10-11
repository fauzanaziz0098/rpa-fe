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
    const [roles, setRoles] = useState([]);
    const [visible, setVisible] = useState(false);
  
    const form = useForm({
      initialValues: {
        name: "",
        // code: "",
        // part_number: "",
        // cycle_time: "",
        // unit: "",
        // status: "",
      },
    });
    // console.log(form, 'form');
  
    useEffect(() => {
      const fetchDataClients = async () => {
        try {
          const { data } = (await axiosAuth.get("roles", getHeaderConfigAxios()))
            .data;
          setRoles(
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
                  const { data } = await axiosAuth.get(`roles/${id}`, getHeaderConfigAxios()).then(item => item.data)
                form.setValues({
                        name: data.name,
                        // code: data.code,
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
              await axiosAuth.patch(`roles/${id}`, form.values, getHeaderConfigAxios());
              router.push("/master-data/role");
          } else {
              await axiosAuth.post("roles", form.values, getHeaderConfigAxios());
              router.push("/master-data/role");
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
          </Grid>
  
          <Group position="right" mt="xl">
              <Button color="red" component={Link} href="/master-data/role">
              Back
              </Button>
              <Button type="submit">Submit</Button>
          </Group>
          </form>
      </div>
    );
  }
  