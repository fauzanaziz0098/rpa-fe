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
import * as moment from 'moment-timezone';

export default function Home() {
    const [mqttData1, setMqttData1] = useState([])
    const [mqttData2, setMqttData2] = useState([])

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
        if (activePlan.length != 0) {
            client
            .subscribe(`MC${activePlan.machine.id}:LS:RPA`, {qos: 2})
            .on("message", (topic, message) => {
                if (topic == `MC${activePlan.machine.id}:LS:RPA`) {
                    setMqttData2(JSON.parse(message))
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
      const updateActualTime = () => {
        const currentTime = moment().tz("Asia/Bangkok");
        const dateIn = moment(activePlan.date_time_in).tz("Asia/Bangkok");
        const timeDifference = currentTime.diff(dateIn, 'minutes');
        setTimeActual(timeDifference);
      };
      
      useEffect(() => {
        updateActualTime();
        const timer = setInterval(() => {
          updateActualTime();
        }, 3600000);
        
        return () => clearInterval(timer);
      }, []);
    //   const [startTime] = useState(new Date());

    //   const calculateTimeActual = () => {
    //     const currentTime = moment(activePlan.date_time_in).tz("Asia/Bangkok").format("HH:mm");
    //     const hour = moment(currentTime, 'HH:mm').get('hour');
    //     const minutes = moment(currentTime, 'HH:mm').get('minute');
    //     // const seconds = currentTime.getSeconds();
    //     const timeInSeconds = (hour * 60) + minutes;
    //     setTimeActual(timeInSeconds);
    //     // const currentTime = new Date();
    //     // const currentTime = moment(activePlan.date_time_in).tz("Asia/Bangkok").format("HH:mm");
    //     // const hours = moment(currentTime, 'HH:mm').get('hour');
    //     // const minutes = moment(currentTime, 'HH:mm').get('minute');
    //     // const timeInSeconds = (hours * 60) + minutes;
    //     // setTimeActual(timeInSeconds);
    //   };
    
    //   useEffect(() => {
    //     calculateTimeActual(); // Hitung waktu aktual saat komponen dimuat
    //     const timer = setInterval(calculateTimeActual, 1000 ); // Perbarui waktu setiap menit
    //     return () => clearInterval(timer);
    //   }, []);

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


        //   availibity
        const currentTime = moment().tz("Asia/Bangkok");
            const dateIn = moment(activePlan.date_time_in).tz("Asia/Bangkok");
        const timeDifference = currentTime.diff(dateIn, 'minutes');
        const calculateAvailabilityPercentage = () => {
            if (timeActual === 0) {
              return 0;
            }
          
            // Hitung selisih waktu antara saat ini dan date_time_in dalam menit
            const currentTime = moment().tz("Asia/Bangkok");
            const dateIn = moment(activePlan.date_time_in).tz("Asia/Bangkok");
            const timeDifference = currentTime.diff(dateIn, 'minutes');
          
            // Hitung persentase ketersediaan berdasarkan selisih waktu
            const availabilityPercentage = (timeDifference / timeActual) * 100;
            return availabilityPercentage;
          };
          
          const availabilityPercentage = calculateAvailabilityPercentage();
          

          // oee
          const multipliedPercentage = availabilityPercentage * performancePercentage * qualityPercentage;
          const resultPercentage = multipliedPercentage / 1000000 ;
          const finallyPercentage = resultPercentage * 100;



      

const router = useRouter()
const changePage = () => {
    router.push('/home')
}

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
                <RingProgress style={{ marginLeft: '60px' }} sections={[{ value: availabilityPercentage, color: 'green' }]} label={ <Text
                    c="green" fw={700} ta="center" size="xl">
                    {availabilityPercentage.toFixed(0)}%
                    </Text>
                    }
                    size={200}
                    />
                    <Paper shadow="xs" withBorder style={{ marginLeft: '60px' }}>
                        <div style={{  textAlign: 'center' }}>
                            <p>Availibity planned : {timeDifference} minutes</p>
                            <p>Availibity actual : {timeActual} minutes</p>
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
            <RingProgress sections={[{ value: finallyPercentage, color: 'green' }]} label={ <Text c="green" fw={700} ta="center"
                size="xl">
                    {multipliedPercentage.toFixed(0)}%
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
