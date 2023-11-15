import {
  Table,
  Menu,
  Button,
  Space,
  ActionIcon,
  Select,
  Text,
  rem,
  useMantineTheme,
  ScrollArea,
  Center,
} from "@mantine/core";
import Image from "next/image";
import mht from "@/assets/mht.png";
import robot from "@/assets/robot.png";
import {
  IconCircleDot,
  IconSquareCheck,
  IconPackage,
  IconUsers,
  IconAlarmSnooze,
  IconCalendar,
  IconChevronDown,
} from "@tabler/icons";
import { useState, useEffect, useRef } from "react";
import axiosPlanning from "@/libs/planning/axios";
import axiosHour from "@/libs/service_per_hour/axios";
import { getHeaderConfigAxios } from "@/utils/getHeaderConfigAxios";
import * as moment from "moment-timezone";
import { useRouter } from "next/router";
import client from "@/libs/mqtt";
import DownTime from "@/components/views/Dashboard/MonitorMachine/DownTime";
import MachineCondition from "@/components/views/Dashboard/MonitorMachine/MachineCondition";
import { getCookie } from "cookies-next";

export default function Home({ headers }) {
  const [mqttData1, setMqttData1] = useState([]);

  const theme = useMantineTheme();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [isMenuActive, setMenuActive] = useState(false);
  const [isFullActive, setFullActive] = useState(false);
  const [updownButtonColor, setUpdownButtonColor] = useState("teal");
  const isDashboardVisible = !isFullActive;
  const [activePlan, setActivePlan] = useState([]);
  const [productionData, setProductionData] = useState([]);
  const [machines, setMachines] = useState([])
  const [machinePlan, setMachinePlan] = useState(null)
  

  const fetchData = async (machineId) => {
    try {
      const res = await axiosHour.get(`production/data-active-new/${machineId}`, headers);
      console.log(res.data.data, 'data');
      setProductionData(res.data.data);
      setActivePlan(res.data.data.planningMachineActive);
    } catch (error) {
      setActivePlan([]);
      console.log(error, "production fetch error");
    }
  };
  const fetchMachines = async () => {
    try {
      const res = await axiosPlanning.get('machine', headers)
      const machines = res.data.data.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })
      setMachines(machines)
    } catch (error) {
      console.log(error, 'machines')
    }
  }
  useEffect(() => {
    fetchMachines();
  }, [])

  useEffect(() => {
    if (machines.length > 0) {
      fetchData(machines[0].value);
      setMachinePlan(machines[0].value)
    }
  }, [machines])

  useEffect(() => {
    fetchData(machinePlan);
    const interval = setInterval(async () => {
      if (machinePlan) {
        try {
          console.log("re-fetch");
          fetchData(machinePlan);
        } catch (error) {
          console.log(error, "error refetch");
        }
      }
    }, 1000 * 10);
    return () => clearInterval(interval);
  }, [machinePlan]);

  console.log(mqttData1, 'data');

  useEffect(() => {
    if (productionData.planningMachineActive) {
      client
        .subscribe(`MC${productionData.planningMachineActive.machine.id}:PLAN:RPA`, { qos: 2 })
        .on("message", (topic, message) => {
          if (topic == `MC${productionData.planningMachineActive.machine.id}:PLAN:RPA`) {
            setMqttData1(JSON.parse(message));
            console.log("message got");
          }
        });
      return () => {
        client.unsubscribe(`MC${productionData.planningMachineActive.machine.id}:PLAN:RPA`, { qos: 2 });
      };
    }
  }, [productionData]);

  const handleMenuItemClickReport = (menuItem) => {
    setActiveMenuItem(menuItem === activeMenuItem ? null : menuItem);
    router.push(`/report/${menuItem.replaceAll(" ", "-").toLowerCase()}`);
  };

  const handleMenuItemClickActivity = (menuItem) => {
    setActiveMenuItem(menuItem === activeMenuItem ? null : menuItem);
    router.push(`/system-activity/${menuItem.replaceAll(" ", "-").toLowerCase()}`);
  };

  // Fungsi untuk mengubah kategori aktif
  const handleCategoryClick = (category) => {
    setActiveCategory(category === activeCategory ? null : category);
  };

  // Fungsi untuk mengubah menu item aktif
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem === activeMenuItem ? null : menuItem);
    router.push(`/master-data/${menuItem.replaceAll(" ", "-").toLowerCase()}`);
  };

  const handleMenuClick = () => {
    setMenuActive(true);
    setFullActive(false);
    setUpdownButtonColor("teal");
  };

  const handleFullClick = () => {
    setMenuActive(false);
    setFullActive(true);
    setUpdownButtonColor("gray");
  };


  return (
    <div>
      <div
        style={{
          display: "flex",
          fontWeight: "bold",
          backgroundColor: "pink",
          height: "80px",
          alignItems: "center", // Untuk mengatur vertikal ke tengah
          justifyContent: "space-between", // Untuk mengatur horizontal ke pojok kanan
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={mht}
            alt="Deskripsi Gambar"
            width={60}
            height={60}
            style={{ marginLeft: "10px" }}
          />
          <Image
            src={robot}
            alt="Deskripsi Gambar"
            width={60}
            height={60}
            style={{ marginLeft: "10px" }}
          />
          {/* <h1 style={{ marginLeft: "10px" }}>{activePlan?.machine?.name}</h1> */}
          <Select
            style={{ marginLeft: "10px"  }}
            placeholder="Pilih Mesin"
            value={machinePlan}
            data={machines}
            onChange={(e) => setMachinePlan(e)}
          />
          {/* <Button
          style={{
            width: "210px",
            backgroundColor: "peru",
          }}
          pr={12}
        ></Button> */}
        {/* <div style={{ height: '35px', display: 'table-column', justifyContent: 'center', textAlign: 'center', alignItems: "center", marginLeft: '25px'}}>
        <div
            style={{
              backgroundColor: "red",
              width: "100px",
              height: "35px",
              borderRadius: "5px",
            }}
          ></div>
          <p style={{ marginTop: '2px' }}>Run</p>
        </div> */}
        <div
          style={{ height: '35px', display: 'flex', justifyContent: 'center', textAlign: 'center', alignItems: "center", marginLeft: '25px'}}>
          <div style={{
      backgroundColor: data.mc_run[0] ? "green" : data.mc_stop[0] ? "red" : "transparent",
      width: "100px",
      height: "35px",
      borderRadius: "5px",
    }}></div>
          <p style={{ marginTop: '2px' }}>{data.mc_run[0] ? "Run" : data.mc_stop[0] ? "Stop" : ""}</p>
        </div>
        </div>
        <div style={{ display: "flex" }}>
          <div
            id="buttonContainer"
            style={{
              backgroundColor: "orange",
              borderRadius: "100px",
              padding: "10px",
              height: "30px",
              marginRight: "50px",
              marginTop: "7px",
            }}
          >
            <div style={{ marginTop: "-3px" }}>
              <Button
                variant="filled"
                style={{
                  background: !isFullActive ? "#e84393" : "#fff",
                  marginRight: "10px",
                  color: "#000",
                }}
                radius="xl"
                onClick={handleMenuClick}
              >
                Menu
              </Button>
              <Button
                variant="filled"
                radius="xl"
                style={{
                  background: isFullActive ? "#e84393" : "#fff",
                  color: "#000",
                }}
                onClick={handleFullClick}
              >
                Full
              </Button>
            </div>
          </div>
          <div>
            <h2 style={{ marginRight: "40px" }}>
              DATE: {moment().format("YYYY-MM-DD")}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
