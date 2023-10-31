import { Typography } from "@material-ui/core";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import client from "@/libs/mqtt";
import axiosPlanning from "@/libs/planning/axios";
import axiosAuth from "@/libs/auth/axios";

export default function BarChartTest() {
  const [mqttData1, setMqttData1] = useState([]);
  const [mqttData2, setMqttData2] = useState([]);

  const [activePlan, setActivePlan] = useState([]);
  const fetchActiveData = async () => {
    try {
      const res1 = await axiosPlanning.get(
        "planning-production",
        getHeaderConfigAxios()
      );
      setActivePlan(res1.data.data);
    } catch (error) {
      console.log(error, "error fetch data");
    }
  };

  useEffect(() => {
    if (activePlan.length != 0) {
      client
        .subscribe(`MC${activePlan.machine.id}:PLAN:RPA`, {
          qos: 2,
        })
        .subscribe(`MC${activePlan.machine.id}:LS:RPA`, {
          qos: 2,
        })
        .on("message", (topic, message) => {
          if (topic == `MC${activePlan.machine.id}:LS:RPA`) {
            setMqttData2(JSON.parse(message));
            console.log("message got");
          }
          if (topic == `MC${activePlan.machine.id}:PLAN:RPA`) {
            setMqttData1(JSON.parse(message));
            console.log("message got");
          }
        });
      return () => {
        client.unsubscribe(`MC${activePlan.machine.id}:PLAN:RPA`, {
          qos: 2,
        });
      };
    }
  }, [activePlan]);

  useEffect(() => {
    fetchActiveData();
  }, []);
  const data = [
    { month: "Jan", sales: 1000 },
    { month: "Feb", sales: 6000 },
    { month: "Mar", sales: 2000 },
    { month: "Apr", sales: 8000 },
    { month: "May", sales: 5000 },
    { month: "Jun", sales: 1000 },
    { month: "Jul", sales: 9000 },
    { month: "Aug", sales: 8000 },
    { month: "Sep", sales: 3000 },
    { month: "Oct", sales: 4000 },
    { month: "Nov", sales: 7000 },
    { month: "Dec", sales: 12000 },
    { month: "Jan", sales: 1000 },
    { month: "Feb", sales: 6000 },
    { month: "Mar", sales: 2000 },
    { month: "Apr", sales: 8000 },
    { month: "May", sales: 5000 },
    { month: "Jun", sales: 1000 },
    { month: "Jul", sales: 9000 },
    { month: "Aug", sales: 8000 },
    { month: "Sep", sales: 3000 },
    { month: "Oct", sales: 4000 },
    { month: "Nov", sales: 7000 },
    { month: "Dec", sales: 12000 },
  ];

  const scale = 100 / Math.max(...data.map((entry) => entry.sales));

  data.forEach((entry) => {
    entry.sales = entry.sales * scale;
  });

  const yAxisDomain = [0, 20, 40, 60, 80, 200, 110];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const formatCustomTick = (value) => `${value}%`;

  return (
    <div style={{ display: "flex", marginTop: "60px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <ResponsiveContainer width={1100} height={400}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={formatCustomTick}
                domain={yAxisDomain}
                tickCount={7}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Bar dataKey="sales" fill="#FFD700" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {!mounted && (
          <style jsx global>
            {`
              .recharts-text.recharts-label {
                font-size: 0 !important;
              }
            `}
          </style>
        )}
      </div>
    </div>
  );
}
