import {
    Box,
    Button,
    Card,
    Checkbox,
    Divider,
    Flex,
    Grid,
    Group,
    Paper,
    PasswordInput,
    Radio,
    Select,
    Space,
    Text,
    TextInput,
    Title,
  } from "@mantine/core";
  import { useForm } from "@mantine/form";
  import { useEffect, useState } from "react";
  import axiosHour from "@/libs/service_per_hour/axios";
  import { getHeaderConfigAxios } from "@/utils/getHeaderConfigAxios";
  import { useRouter } from "next/router";
  import { AxiosError } from "axios";
  import Link from "next/link";
import { showNotification } from "@mantine/notifications";
import { IconFaceId, IconFaceIdError, IconId } from "@tabler/icons";
  
  export default function FormControl({ id }) {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
  
    const form = useForm({
      initialValues: {
        contact_name: "",
        contact_number: "",
        is_group: false,
        is_line_stops_1: false,
        is_line_stops_10: false,
        is_line_stops_20: false,
        is_line_stops_30: false,      
      },
    });
  
    useEffect(() => {
        if (id) {
            (async (id) => {
                try {
                  const { data } = await axiosHour.get(`notification-whatsapp/${id}`, getHeaderConfigAxios()).then(item => item.data)
                form.setValues({
                    contact_name: data.contact_name,
                    contact_number: data.contact_number,
                    is_group: data.is_group,
                    is_line_stops_1: data.is_line_stops_1,
                    is_line_stops_10: data.is_line_stops_10,
                    is_line_stops_20: data.is_line_stops_20,
                    is_line_stops_30: data.is_line_stops_30,      
                              })
                } catch (error) {
                    console.log(error, 'error fetch notification-whatsapp data');
                }
            })(id)
        }
    }, [id])
    
  
    const handleSubmit = async () => {
      try {
          if (id) {
              await axiosHour.patch(`notification-whatsapp/${id}`, form.values, getHeaderConfigAxios());
              router.push("/system-activity/whatsapp-notification");
          } else {
              await axiosHour.post("notification-whatsapp", form.values, getHeaderConfigAxios());
              router.push("/system-activity/whatsapp-notification");
          }
          showNotification({
            title: "Successful Submit",
            message: "Submit Success👏",
            icon: <IconFaceId />,
            color: "teal",
        });
      } catch (error) {
        if (error) {
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
            <Group>
              <Radio.Group
                label="select type of notification"
                withAsterisk
                value={form.values.is_group.toString()} // Convert the boolean to a string
                onChange={(value) => form.setFieldValue("is_group", value === "true")} // Convert the string back to a boolean
              >
                <Radio value="false" label="Person" />
                <Radio value="true" label="Group" />
              </Radio.Group>
              <Divider mt={10}/>
            </Group>
            <Grid columns={12}>
                <Grid.Col span={6}>
                    <TextInput {...form.getInputProps('contact_name')} label={'Contact Name'} placeholder={'input a contact name'} required />
                </Grid.Col>
                {
                    form.values.is_group == false && (
                        <Grid.Col span={6}>
                            <TextInput {...form.getInputProps('contact_number')} label={'Contact Number'} icon={ <Text size={'xs'} weight={600}>+62</Text>} placeholder={'input a contact number'} required />
                        </Grid.Col>
                    )
                }
                {
                    form.values.is_group == true && (
                        <Grid.Col span={6}>
                            <TextInput {...form.getInputProps('contact_number')} label={'Group Id'} icon={<IconId size={18} />} placeholder={'input a contact number'} required />
                        </Grid.Col>
                    )
                }
            </Grid>
            <Space my={'md'} />
            <Text weight={600}>Check Notification</Text>
            <Grid columns={12}>
                <Grid.Col span={12}>
                    <Checkbox checked={form.values.is_line_stops_1} {...form.getInputProps('is_line_stops_1')} label={'Line Stop 1 Menit'} />
                </Grid.Col>
                <Grid.Col span={12}>
                    <Checkbox checked={form.values.is_line_stops_10} {...form.getInputProps('is_line_stops_10')} label={'Line Stop 10 Menit'} />
                </Grid.Col>
                <Grid.Col span={12}>
                    <Checkbox checked={form.values.is_line_stops_20} {...form.getInputProps('is_line_stops_20')} label={'Line Stop 20 Menit'} />
                </Grid.Col>
                <Grid.Col span={12}>
                    <Checkbox checked={form.values.is_line_stops_30} {...form.getInputProps('is_line_stops_30')} label={'Line Stop 30 Menit'} />
                </Grid.Col>
            </Grid>


          <Group position="right" mt="xl">
              <Button color="red" component={Link} href="/system-activity/whatsapp-notification">
              Back
              </Button>
              <Button type="submit">Submit</Button>
          </Group>
          </form>
      </div>
    );
  }
  