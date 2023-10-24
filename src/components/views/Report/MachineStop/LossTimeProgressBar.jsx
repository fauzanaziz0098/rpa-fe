import { Divider, Group, Modal, Paper, Progress, Text } from "@mantine/core";
import dayjs from "dayjs";
import React, { memo, useEffect, useState } from "react";

import "dayjs/locale/id";

dayjs.locale("id");

const LossTimeProgressBar = memo(({ hours, item }) => {
  const [opened, setOpened] = useState({
    open: false,
    data: null,
  });
  return (
    <Paper withBorder p={"xl"}>
      <Text>{item?.name ?? "-"}</Text>
      <Modal
        opened={opened.open}
        onClose={() =>
          setOpened({
            open: false,
            data: null,
          })
        }
        title="Detail"
      >
        {opened.data && opened.open ? (
          <div>
            <p>Nama Machine: {item?.name}</p>
            <p>Oprator: {opened?.data.oprator}</p>
            <p>Kondisi Machine: {opened?.data.type}</p>
            <p>Waktu Machine: {opened?.data.second} detik</p>
            <p>Durasi waktu: </p>
            <p>
              {dayjs(opened?.data.created_at)
                .locale("id")
                .format("DD-MM-YYYY, HH:mm:ss")}{" "}
              -{" "}
              {dayjs(opened?.data.updated_at)
                .locale("id")
                .format("DD-MM-YYYY, HH:mm:ss")}
            </p>
            {opened?.data.type == "stop" ? (
              <p>Diakibatkan: {opened?.data.line_stop ?? "-"}</p>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {/* Modal content */}
      </Modal>
      <Divider />
      <div style={{ display: "flex" }}>
        {hours.map((hour) => {
          return (
            <div key={hour} style={{ width: "100%" }}>
              <Group position={"apart"} mx={"xs"}>
                <Text size={"xs"} weight={600}>
                  {dayjs().set("hour", hour).startOf("hour").format("HH:mm")}
                </Text>
                <Text size={"xs"} weight={600}>
                  {dayjs().set("hour", hour).endOf("hour").format("HH:mm")}
                </Text>
              </Group>
              <Progress
                sx={{ height: "30px" }}
                size={"xl"}
                radius={"xs"}
                sections={item.lossTimes
                  .filter((value) => {
                    if (
                      dayjs(value.created_at).locale("id").format("HH") ==
                      dayjs().set("hour", hour).startOf("hour").format("HH")
                    ) {
                      return value;
                    }
                  })
                  .map((value) => {
                    return {
                      value: Number(value.percentage),
                      color: value.color,
                      tooltip: (
                        <Text fz="xs">
                          {dayjs(value.created_at)
                            .locale("id")
                            .format("HH:mm:ss")}{" "}
                          -{" "}
                          {dayjs(value.updated_at)
                            .locale("id")
                            .format("HH:mm:ss")}
                          <br /> {value.line_stop ?? ""}
                        </Text>
                      ),
                      style: { cursor: "pointer" },
                      onClick: () =>
                        setOpened({
                          open: true,
                          data: value,
                        }),
                    };
                  })}
              />
            </div>
          );
        })}
      </div>
    </Paper>
  );
});

export default LossTimeProgressBar;
