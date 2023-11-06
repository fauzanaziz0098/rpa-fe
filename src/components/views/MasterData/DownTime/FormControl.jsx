import {
    Box,
    Button,
    Card,
    Grid,
    Group,
    PasswordInput,
    Select,
    TextInput,
    Title,
  } from "@mantine/core";
  import { useForm } from "@mantine/form";
  import { useEffect, useState } from "react";
  import axiosLossTime from "@/libs/losstime/axios";
  import { getHeaderConfigAxios } from "@/utils/getHeaderConfigAxios";
  import { useRouter } from "next/router";
  import { AxiosError } from "axios";
  import Link from "next/link";
import { showNotification } from "@mantine/notifications";
import { IconFaceId, IconFaceIdError } from "@tabler/icons";
  
  export default function FormControl({ id }) {
    const router = useRouter();
    const [categoryLineStop, setCategoryLineStop] = useState([]);
    const [visible, setVisible] = useState(false);
  
    const form = useForm({
      initialValues: {
        name: "",
        categoryLineStop: "",
      },
    });
  
    useEffect(() => {
      const fetchDataCategoryLineStop = async () => {
        try {
          const { data } = (await axiosLossTime.get("category-line-stop", getHeaderConfigAxios()))
            .data;
          setCategoryLineStop(
            data.map((item) => ({
              label: item.name,
              value: item.id,
            }))
          );
        } catch (error) {
          console.log(error, "error fetch data category line stop");
        }
      };
      fetchDataCategoryLineStop();
  
    }, []);

    useEffect(() => {
        if (id) {
            (async (id) => {
                try {
                  const { data } = await axiosLossTime.get(`line-stop/${id}`, getHeaderConfigAxios()).then(item => item.data)
                form.setValues({
                      name: data.name,
                      categoryLineStop: data.categoryLineStop.id,
                    })
                } catch (error) {
                    console.log(error, 'error fetch category ls data');
                }
            })(id)
        }
    }, [id])
    
  
    const handleSubmit = async () => {
      try {
          if (id) {
              await axiosLossTime.patch(`line-stop/${id}`, form.values, getHeaderConfigAxios());
              router.push("/master-data/down-time");
          } else {
              await axiosLossTime.post("line-stop", form.values, getHeaderConfigAxios());
              router.push("/master-data/down-time");
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
          <Grid columns={2}>
              <Grid.Col span={1}>
                <TextInput
                    label="Name"
                    placeholder="Name"
                    withAsterisk
                    {...form.getInputProps("name")}
                />
              </Grid.Col>
              <Grid.Col span={1}>
                <Select
                    label="Category Line Stop"
                    placeholder="Select Category Line Stop"
                    data={categoryLineStop}
                    searchable
                    clearable
                    withAsterisk
                    {...form.getInputProps("categoryLineStop")}
                />
              </Grid.Col>
              <Grid.Col span={1}>
              </Grid.Col>
          </Grid>
  
          <Group position="right" mt="xl">
              <Button color="red" component={Link} href="/master-data/down-time">
              Back
              </Button>
              <Button type="submit">Submit</Button>
          </Group>
          </form>
      </div>
    );
  }
  