import { RingProgress, Text, Table, Paper, Menu, Flex } from '@mantine/core';
import Image from 'next/image';
import mht from '@/assets/mht.png';
import table from '@/assets/tabel.png';
import home from '@/assets/home.png';
import { useRouter } from 'next/router';
import { IconLogout, IconSettings, IconTrash } from '@tabler/icons';
import axiosAuth from '@/libs/auth/axios';
import { deleteCookie } from 'cookies-next';
import client from '@/libs/mqtt'
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import axiosPlanning from '@/libs/planning/axios';
import { useEffect, useState } from 'react';

export default function Home() {
    const [mqttData1, setMqttData1] = useState([])

    const [activePlan, setActivePlan] = useState([])
    const [noPlanToday, setNoPlanToday] = useState([])

    
    const fetchActiveData = async () => {
        try {
            const res1 = await axiosPlanning.get('planning-production', getHeaderConfigAxios())
            setActivePlan(res1.data.data)
        } catch (error) {
            console.log(error, 'error fetch data');
        }
    }

    useEffect(() => {
        if (activePlan.length != 0) {
            client
            .subscribe(`MC${activePlan.machine.id}:PLAN:RPA`, {qos: 2})
            .on("message", (topic, message) => {
                if (topic == `MC${activePlan.machine.id}:PLAN:RPA`) {
                    setMqttData1(JSON.parse(message))
                    console.log('message got');
                }
            })
            return () => {
                client.unsubscribe(`MC${activePlan.machine.id}:PLAN:RPA`, { qos: 2 })
            }
        }
    }, [activePlan])

    
    useEffect(() => {
        fetchActiveData()
    },[])

    console.log(mqttData1, 'mqtt');
    console.log(activePlan, 'acmqtt');

    // quality
    const qtyActual = mqttData1.qty_actual;

    const calculateQualityPercentage = () => {
        const qtyActual = mqttData1.qty_actual;
        const qtyPlanning = activePlan.qty_planning;

        if (qtyPlanning === 0) {
          return 0;
        }
      
        const qualityPercentage = (qtyActual - 0) / qtyPlanning * 100;
        return qualityPercentage;
      };

      const qualityPercentage = calculateQualityPercentage();

    //   perfomance
      const [timeActual, setTimeActual] = useState(0);
      console.log(timeActual, 'time');

      const calculateTimeActual = () => {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const timeInSeconds = (minutes * 60);
        setTimeActual(timeInSeconds);
      };
    
      useEffect(() => {
        calculateTimeActual(); // Hitung waktu aktual saat komponen dimuat
        const timer = setInterval(calculateTimeActual, 1000 * 60); // Perbarui waktu setiap menit
        return () => clearInterval(timer);
      }, []);

        const cycleTime = activePlan.product ? activePlan.product.cycle_time : 0;
        const timePlanned = cycleTime * qtyActual;

        const calculatePerformancePercentage = () => {
            const cycleTimeQtyActual = cycleTime * qtyActual;
            if (timeActual === 0) {
              return 0;
            }
            const performance = (cycleTimeQtyActual / timeActual) * 100;
            return performance;
          };
        
          const performancePercentage = calculatePerformancePercentage()


      

const router = useRouter()
const changePage = () => {
    router.push('/monitor-machine')
}
  const rows = [
    { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
  ];

  const oeeData = [
    { shift: 'Shift 1', value: '75%' },
    { shift: 'Shift 2', value: '50%' },
  ];

  const handleLogout = async () => {
    try{
        const {data} = (await axiosAuth.get('/auth/logout')).data
    }catch(error){
    }
    deleteCookie('auth')
    deleteCookie('user')
    deleteCookie('role')
    deleteCookie('permissions')
    setTimeout(() => {
        router.push('/sign-in')
    },500)
}

  return (
    <div>
        <div style={{ display: 'flex', fontWeight: 'bold', marginTop: '10px' }}>
          <Menu shadow="md" width={200}>
            <Menu.Target>
                <div>
                    <Image src={mht} alt="Deskripsi Gambar" width={60} height={60} style={{ marginLeft: '10px' }} />
                </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>
                <Flex justify={"space-between"} align="center">
                  Application
                </Flex>
              </Menu.Label>
              <Menu.Item color="red" onClick={handleLogout} icon={<IconLogout size={14} />}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
            <div style={{ flex: '1' }}>
                <p style={{ textAlign: 'left', marginLeft: '30px' }}>AVAILABILITY</p>
            </div>
            <div style={{ flex: '1' }}>
                <p style={{ textAlign: 'right', marginRight: '50px' }}>PERFORMANCE</p>
            </div>
        </div>
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px', marginTop: '-60px' }}>
            <h1>O E E</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-60px' }}>
            <div>
                <RingProgress style={{ marginLeft: '60px' }} sections={[{ value: 40, color: 'green' }]} label={ <Text
                    c="green" fw={700} ta="center" size="xl">
                    40%
                    </Text>
                    }
                    size={200}
                    />
                    <Paper shadow="xs" withBorder style={{ marginLeft: '60px' }}>
                        <div style={{  textAlign: 'center' }}>
                            <p>Time planned : 500 minutes</p>
                            <p>Time actual : 500 minutes</p>
                        </div>
                    </Paper>
            </div>
            <div>
                <RingProgress style={{ marginRight: '10px' }} sections={[{ value: performancePercentage, color: 'green' }]} label={ <Text
                    c="green" fw={700} ta="center" size="xl">
                    {performancePercentage.toFixed(0)}%
                    </Text>
                    }
                    size={200}
                    />
                    <Paper shadow="xs" withBorder style={{ marginRight: '10px' }}>
                        <div style={{  textAlign: 'center' }}>
                            <p>Time planned : {timePlanned} minutes</p>
                            <p>Time actual : {timeActual} minutes</p>
                        </div>
                    </Paper>
            </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-260px' }}>
            <RingProgress sections={[{ value: 55, color: 'green' }]} label={ <Text c="green" fw={700} ta="center"
                size="xl">
                55%
                </Text>
                }
                size={500}
                />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-150px', height: '220px' }}>
            <div style={{ height: '220px',width: '300px', marginLeft: '100px' }}>
                <div>
                    <Image alt="" src={table} width={300} />
                    <div
                        style={{ display: 'flex', fontSize: '50px', fontWeight: 'bold', color: 'skyblue', justifyContent: 'space-between', marginTop: '-130px' }}>
                        <p style={{ marginLeft: '30px' }}>75%</p>
                        <p style={{ marginRight: '10px' }}>100%</p>
                    </div>
                </div>
            </div>
            <div>
            <div style={{ flex: '1', marginTop: '-50px', fontWeight: 'bold' }}>
                <p style={{ textAlign: 'right', marginRight: '70px' }}>QUALITY</p>
            </div>
            <div>
                <RingProgress style={{ marginRight: '10px' }} 
                sections={[{ value: qualityPercentage, color: 'green'}]} 
                label={ <Text c="green" fw={700} ta="center" size="xl">
                    {qualityPercentage.toFixed(0)}%
                    </Text>
                    }
                    size={200}
                    />
                    <Paper shadow="xs" withBorder style={{ marginRight: '10px' }}>
                        <div style={{  textAlign: 'center' }}>
                            <p>Qty planned : 0 minutes</p>
                            <p>Qty actual : {qtyActual} minutes</p>
                        </div>
                    </Paper>
            </div>
            </div>
        </div>
        <div onClick={changePage} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-50px'}}>
            <Image src={home} alt="Deskripsi Gambar" />
        </div>
    </div>
  );
}