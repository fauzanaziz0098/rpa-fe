import { Divider, Group, Paper, Progress, Text } from "@mantine/core";
import dayjs from "dayjs";
import React, { memo, useEffect } from "react";

import "dayjs/locale/id";

dayjs.locale("id");

const LossTimeProgressBar = memo(({ hours, item }) => {
  return (
    <Paper withBorder p={"xl"}>
      <Text>{item?.name ?? "-"}</Text>
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
                      tooltip: value.line_stop ?? "",
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
