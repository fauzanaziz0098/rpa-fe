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
  import Link from "next/link";
import { TimeInput } from "@mantine/dates";
import { IconClockHour1, IconClockHour9, IconFaceId, IconFaceIdError } from "@tabler/icons";
import dayjs from "dayjs";
import { showNotification } from "@mantine/notifications";
  
  export default function FormControl({ id }) {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
  
    const form = useForm({
      initialValues: {
        name: '',
        time_start: '',
        time_end: '',
      },
    });
  
    useEffect(() => {
        if (id) {
            (async (id) => {
                try {
                  const { data } = await axiosPlanning.get(`shift/${id}`, getHeaderConfigAxios()).then(item => item.data)
                form.setValues({
                    name: data.name,
                    time_start: dayjs(`${dayjs().format('YYYY-MM-DD')} ${data.time_start}`).toDate(),
                    time_end: dayjs(`${dayjs().format('YYYY-MM-DD')} ${data.time_end}`).toDate(),          
                    })
                } catch (error) {
                    console.log(error, 'error fetch shift data');
                }
            })(id)
        }
    }, [id])
    
  
    const handleSubmit = async () => {
      try {
          if (id) {
              await axiosPlanning.patch(`shift/${id}`, form.values, getHeaderConfigAxios());
              router.push("/master-data/shift");
          } else {
              await axiosPlanning.post("shift", form.values, getHeaderConfigAxios());
              router.push("/master-data/shift");
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
              <TimeInput
                label="Time Start"
                withAsterisk
                icon={<IconClockHour1 size={18} />}
                {...form.getInputProps("time_start")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <TimeInput
                label="Time End"
                withAsterisk
                icon={<IconClockHour9 size={18} />}
                {...form.getInputProps("time_end")}
              />
              </Grid.Col>
          </Grid>
  
          <Group position="right" mt="xl">
              <Button color="red" component={Link} href="/master-data/shift">
              Back
              </Button>
              <Button type="submit">Submit</Button>
          </Group>
          </form>
      </div>
    );
  }
  