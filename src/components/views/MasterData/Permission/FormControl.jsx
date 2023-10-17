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
  import axiosAuth from "@/libs/auth/axios";
  import { getHeaderConfigAxios } from "@/utils/getHeaderConfigAxios";
  import { useRouter } from "next/router";
  import { AxiosError } from "axios";
  import Link from "next/link";
import { showNotification } from "@mantine/notifications";
import { IconFaceId, IconFaceIdError } from "@tabler/icons";
  
  export default function FormControl() {
    const router = useRouter();
  
    const form = useForm({
      initialValues: {
        name: "",
      },
    });
  
    const handleSubmit = async () => {
      try {
          await axiosAuth.post("permissions", form.values, getHeaderConfigAxios());
          router.push("/master-data/permission");
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
                  autoFocus={true}
                  label="Name"
                  placeholder="Name"
                  withAsterisk
                  {...form.getInputProps("name")}
              />
              </Grid.Col>
          </Grid>
  
          <Group position="right" mt="xl">
              <Button color="red" component={Link} href="/master-data/permission">
              Back
              </Button>
              <Button type="submit">Submit</Button>
          </Group>
          </form>
      </div>
    );
  }
  