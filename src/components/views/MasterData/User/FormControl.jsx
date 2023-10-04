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
  import axiosPlanning from "@/libs/planning/axios";
  import { getHeaderConfigAxios } from "@/utils/getHeaderConfigAxios";
  import { useRouter } from "next/router";
  import Link from "next/link";
  
  export default function FormControl({ id }) {
    const router = useRouter();
    const [roles, setRoles] = useState([]);
  
    const form = useForm({
      initialValues: {
        username: "",
        name: "",
        email: "",
        password: "",
        role: "",
      },
    });
  
    useEffect(() => {
      const fetchDataRoles = async () => {
        try {
          const { data } = (await axiosAuth.get("roles", getHeaderConfigAxios()))
            .data;
          setRoles(
            data.map((item) => ({
              label: item.name,
              value: item.id,
            }))
          );
        } catch (error) {
          console.log(error, "error fetch data roles");
        }
      };
      fetchDataRoles();
  
    }, []);

    useEffect(() => {
        if (id) {
            (async (id) => {
                try {
                  const { data } = await axiosAuth.get(`users/${id}`, getHeaderConfigAxios()).then(item => item.data)
                form.setValues({
                      username: data.username,
                      name: data.name,
                      email: data.email,
                      role: data.role.id,
                    })
                } catch (error) {
                    console.log(error, 'error fetch users data');
                }
            })(id)
        }
    }, [id])
    
  
    const handleSubmit = async () => {
      try {
          if (id) {
              await axiosAuth.patch(`users/${id}`, form.values, getHeaderConfigAxios());
              router.push("/master-data/user");
          } else {
              await axiosAuth.post("users/client", form.values, getHeaderConfigAxios());
              router.push("/master-data/user");
          }
      } catch (error) {
        console.log(error, "error submit users");
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
              <Select
                  label="Role"
                  placeholder="Select Role"
                  data={roles}
                  searchable
                  clearable
                  withAsterisk
                  {...form.getInputProps("role")}
              />
              </Grid.Col>
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
                  label="Username"
                  placeholder="Username"
                  withAsterisk
                  {...form.getInputProps("username")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <TextInput
                  label="Email"
                  placeholder="Email"
                  withAsterisk
                  {...form.getInputProps("email")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              <PasswordInput
                  label="Password"
                  placeholder="Password"
                  withAsterisk
                  {...form.getInputProps("password")}
              />
              </Grid.Col>
              <Grid.Col span={1}>
              </Grid.Col>
          </Grid>
  
          <Group position="right" mt="xl">
              <Button color="red" component={Link} href="/master-data/user">
              Back
              </Button>
              <Button type="submit">Submit</Button>
          </Group>
          </form>
      </div>
    );
  }
  