import Layout from "../../../components/Layout/App";
import { Card, Grid, Skeleton, Stack, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { range } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { getMachineStop } from "../../../components/views/Report/MachineStop/getMachineStop";
import LossTimeProgressBar from "../../../components/views/Report/MachineStop/LossTimeProgressBar";

const hours = range(
  0,
  dayjs(dayjs().startOf("day")).diff(dayjs().endOf("day"), "hour") * -1
);
export default function MachineStopPageIndex() {
  const { index } = getMachineStop();
  const [loadingState, setLoadingState] = useState(false);
  const [items, setItems] = useState([]);
  const filter = useForm({
    initialValues: {
      date: "",
    },
  });
  const getItems = async (params = null) => {
    setLoadingState(true);
    try {
      const { data } = await index(params);
      setItems(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };
  const refetch = async (params = null) => {
    try {
      const { data } = await index(params);
      setItems(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    filter.setFieldValue("date", new Date());
  }, []);
  useEffect(() => {
    // console.log(filter.values.date, "date");
    if (filter.values.date) {
      getItems(
        new URLSearchParams({
          date: dayjs(filter.values.date).format("YYYY-MM-DD"),
        }).toString()
      );
      const interval = setInterval(() => {
        if (filter.values.date) {
          refetch(
            new URLSearchParams({
              date: dayjs(filter.values.date).format("YYYY-MM-DD"),
            }).toString()
          );
        }
      }, 5000); // Set interval ke 10 detik

      return () => clearInterval(interval);
    }
  }, [filter.values.date]);
  return (
    <Card p={"xl"} sx={{ minHeight: "100vh" }}>
      <Title order={5}>Machine Stop</Title>
      <Grid columns={12} my={"md"}>
        <Grid.Col span={4}>
          <DatePicker
            clearable={false}
            {...filter.getInputProps("date")}
            label={"Date"}
            placeholder={"choose a date"}
          />
        </Grid.Col>
      </Grid>
      <Stack>
        {loadingState ? (
          <Skeleton height={100} />
        ) : (
          items.map((item, key) => {
            return <LossTimeProgressBar key={key} item={item} hours={hours} />;
          })
        )}
      </Stack>
    </Card>
  );
}

MachineStopPageIndex.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
// export async function getServerSideProps({ req, res }) {
//   if (
//     !getCookie("user", { req, res })
//       ?.split(",")
//       ?.includes("machine-stop-access")
//   ) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: "/403",
//       },
//     };
//   }
//   return {
//     props: {},
//   };
// }
