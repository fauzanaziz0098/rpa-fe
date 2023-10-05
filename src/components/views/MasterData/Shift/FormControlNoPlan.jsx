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
import { IconClockHour1, IconClockHour9 } from "@tabler/icons";
import dayjs from "dayjs";
  
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
      form.setValues({shift: id})
    }, [id])
  
    const handleSubmit = async () => {
      try {
        await axiosPlanning.post("no-plan-machine", form.values, getHeaderConfigAxios());
        router.push("/master-data/shift");
      } catch (error) {
        console.log(error, "error submit shift");
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
  