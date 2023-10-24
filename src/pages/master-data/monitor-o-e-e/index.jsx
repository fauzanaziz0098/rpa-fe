import {
    RingProgress,
    Text,
    Paper,
    Menu,
    Flex
} from '@mantine/core';
import Image from 'next/image';
import mht from '@/assets/mht.png';
import table from '@/assets/tabel.png';
import home from '@/assets/home.png';
import {
    useRouter
} from 'next/router';
import {
    IconLogout
} from '@tabler/icons';
import axiosAuth from '@/libs/auth/axios';
import {
    deleteCookie
} from 'cookies-next';
import client from '@/libs/mqtt'
import {
    getHeaderConfigAxios
} from '@/utils/getHeaderConfigAxios'
import axiosPlanning from '@/libs/planning/axios';
import {
    useEffect,
    useState
} from 'react';
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
                .subscribe(`MC${activePlan.machine.id}:PLAN:RPA`, {
                    qos: 2
                })
                .on("message", (topic, message) => {
                    console.log(topic, 't');
                    if (topic == `MC${activePlan.machine.id}:PLAN:RPA`) {
                        setMqttData1(JSON.parse(message))
                        console.log('message got');
                    }
                })
            return () => {
                client.unsubscribe(`MC${activePlan.machine.id}:PLAN:RPA`, {
                    qos: 2
                })
            }
        }
        if (activePlan.length != 0) {
            client
                .subscribe(`MC${activePlan.machine.id}:LS:RPA`, {
                    qos: 2
                })
                .on("message", (topic, message) => {
                    if (topic == `MC${activePlan.machine.id}:LS:RPA`) {
                        setMqttData2(JSON.parse(message))
                        console.log('message got');
                    }
                })
            return () => {
                client.unsubscribe(`MC${activePlan.machine.id}:PLAN:RPA`, {
                    qos: 2
                })
            }
        }
    }, [activePlan])


    useEffect(() => {
        fetchActiveData()
    }, [])

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
    const [startTime, setStartTime] = useState(null);
    //   useEffect(() => {
    //     const interval = setInterval(() => {
    //       setTimeActual((prevTimeActual) => prevTimeActual + 60);
    //     }, 3600000); // 3600000 milidetik (1 jam)
    //     return () => {
    //       clearInterval(interval);
    //     };
    //   }, []);

    useEffect(() => {
        const startTime = moment(activePlan.date_time_in).tz("Asia/Bangkok");
        const currentTime = moment().tz("Asia/Bangkok");
        const initialTimeDifferenceInMinutes = currentTime.diff(startTime, 'minutes');
        // const fixedMinutes = Math.min(initialTimeDifferenceInMinutes, 47);
        const fixedMinutes = Math.min(initialTimeDifferenceInMinutes,(moment(activePlan.date_time_in).add(1, 'hour').minute(0).diff(moment(activePlan.date_time_in), 'minute')))
        // console.log(fixedMinutes, 'ozan');
        const additionalMinutes = fixedMinutes + Math.floor((initialTimeDifferenceInMinutes - fixedMinutes) / 60) * 60; 
      
        setTimeActual(additionalMinutes);
      
        const interval = setInterval(() => {
          setTimeActual((prevTimeActual) => prevTimeActual + 60);
        }, 3600000);
      
        return () => {
          clearInterval(interval);
        };
      }, [activePlan.date_time_in]);
      
      

    
    // useEffect(() => {
    //     const startTime = moment(activePlan.date_time_in).tz("Asia/Bangkok");
    //     const currentTime = moment().tz("Asia/Bangkok");
    //     const initialTimeDifferenceInHours = currentTime.diff(startTime, 'hours');
    //     const initialTimeDifferenceInMinutes = initialTimeDifferenceInHours * 60;
        
    //     setTimeActual(initialTimeDifferenceInMinutes);
      
    //     const interval = setInterval(() => {
    //       setTimeActual((prevTimeActual) => prevTimeActual + 60);
    //     }, 3600000); // Setiap 1 jam
      
    //     return () => {
    //       clearInterval(interval);
    //     };
    //   }, [activePlan.date_time_in]);

    const cycleTime = activePlan.product ? activePlan.product.cycle_time : 0;
    // console.log(cycleTime, 'adam');
    // console.log(qtyActual, 'adam1');
    const timePlanned = cycleTime * qtyActual ;

    const calculatePerformancePercentage = () => {
        const cycleTimeQtyActual = cycleTime * qtyActual;
        if (timeActual === 0) {
            return 0;
        }
        const performance = (cycleTimeQtyActual / timeActual);
        return performance;
    };

    const performancePercentage = calculatePerformancePercentage()


    //   availibity

    const currentTime = moment().tz("Asia/Bangkok");
    const dateIn = moment(activePlan.date_time_in).tz("Asia/Bangkok");
    // const timeDifference = currentTime.diff(dateIn, 'minutes');
    const [timeDifference, setTimeDifference] = useState(0);

  useEffect(() => {
    const dateIn = moment(activePlan.date_time_in).tz("Asia/Bangkok");

    const updateCurrentTime = () => {
      const currentTime = moment().tz("Asia/Bangkok");
      const newTimeDifference = currentTime.diff(dateIn, 'minutes');
      setTimeDifference(newTimeDifference);
    };
    const interval = setInterval(updateCurrentTime, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [activePlan.date_time_in]);
  
    const calculateAvailabilityPercentage = () => {
        if (timeActual === 0) {
            return 0;
        }

        const currentTime = moment().tz("Asia/Bangkok");
        const dateIn = moment(activePlan.date_time_in).tz("Asia/Bangkok");
        const timeDifference = currentTime.diff(dateIn, 'minutes');
        console.log(timeDifference, '100');

        const totalPlanningTime = activePlan.total_time_planning;
        const availabilityPercentage = ((timeActual - totalPlanningTime) / timeDifference);

        return availabilityPercentage;
    };

    const availabilityPercentage = calculateAvailabilityPercentage();


    // oee
    const multipliedPercentage = availabilityPercentage * performancePercentage * qualityPercentage;
    const resultPercentage = multipliedPercentage / 1000000;
    const finallyPercentage = resultPercentage * 100;





    const router = useRouter()
    const changePage = () => {
        router.push('/home')
    }

    const handleLogout = async () => {
        try {
            const {
                data
            } = (await axiosAuth.get('/auth/logout')).data
        } catch (error) {}
        deleteCookie('auth')
        deleteCookie('user')
        deleteCookie('role')
        deleteCookie('permissions')
        setTimeout(() => {
            router.push('/sign-in')
        }, 500)
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
                    <RingProgress style={{ marginLeft: '60px' }} sections={[{ value: availabilityPercentage, color: 'green'
                        }]} label={ <Text c="green" fw={700} ta="center" size="xl">
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
                    <RingProgress style={{ marginRight: '10px' }} sections={[{ value: performancePercentage, color: 'green'
                        }]} label={ <Text c="green" fw={700} ta="center" size="xl">
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
                <RingProgress sections={[{ value: finallyPercentage, color: 'green' }]} label={ <Text c="green" fw={700}
                    ta="center" size="xl">
                    {multipliedPercentage.toFixed()}%
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
                        <RingProgress style={{ marginRight: '10px' }} sections={[{ value: qualityPercentage, color: 'green'
                            }]} label={ <Text c="green" fw={700} ta="center" size="xl">
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
            <div onClick={changePage}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-50px'}}>
                <Image src={home} alt="Deskripsi Gambar" />
            </div>
        </div>
    );
}