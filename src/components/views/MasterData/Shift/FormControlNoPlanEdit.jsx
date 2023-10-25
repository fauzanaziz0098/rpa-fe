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
import * as moment from "moment";
import { IconAlertCircle, IconClockHour1, IconClockHour9 } from "@tabler/icons";
import dayjs from "dayjs";
import { showNotification } from "@mantine/notifications";
  
  export default function FormControl({ id }) {
    const router = useRouter();
  
    const form = useForm({
      initialValues: {
        shift: '',
        time_in: '',
        time_out: '',
        day: '',
      },
    });
  
    useEffect(() => {
        if (id) {
            (async (id) => {
                try {
                  const { data } = await axiosPlanning.get(`no-plan-machine/${id}`, getHeaderConfigAxios()).then(item => item.data)
                form.setValues({
                    shift: data.shift.id,
                    day: data.day,          
                    time_in: dayjs(`${dayjs().format('YYYY-MM-DD')} ${data.time_in}`).toDate(),
                    time_out: dayjs(`${dayjs().format('YYYY-MM-DD')} ${data.time_out}`).toDate(),          
                    })
                } catch (error) {
                    console.log(error, 'error fetch no-plan-machine data');
                }
            })(id)
        }
    }, [id])
    
  
    const handleSubmit = async () => {
      try {
          if (id) {
              await axiosPlanning.patch(`no-plan-machine/${id}`, form.values, getHeaderConfigAxios());
              router.push("/master-data/shift");
          } else {
              await axiosPlanning.post("no-plan-machine", form.values, getHeaderConfigAxios());
              router.push("/master-data/shift");
          }
      showNotification({
          title: "Submit Success",
          message: "No Plan Data Updated Successfully",
          icon: <IconAlertCircle />,
          color: "teal",
      });
      } catch (error) {
         showNotification({
          title: "Submit Failed",
          message: (typeof error?.response?.data?.message == 'object' ? error?.response?.data?.message?.map(item => item + ', ') : error?.response?.data?.message) || "Connection Error",
          icon: <IconAlertCircle />,
          color: "red",
        });
        console.log(error, "error submit no plan");
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
                label="Day"
                maxDropdownHeight="100px"
                dropdownPosition="bottom"
                placeholder="Select Day"
                data={['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']}
                defaultValue="React"
                clearable
                searchable
                {...form.getInputProps("day")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <TimeInput
                label="Time In"
                withAsterisk
                icon={<IconClockHour1 size={18} />}
                {...form.getInputProps("time_in")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <TimeInput
                label="Time Out"
                withAsterisk
                icon={<IconClockHour9 size={18} />}
                {...form.getInputProps("time_out")}
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
  