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
import axios from 'axios';
import { match } from 'assert';

export default function Home() {
    const [mqttData1, setMqttData1] = useState([])
    const [mqttData2, setMqttData2] = useState([])

    const [activePlan, setActivePlan] = useState([])
    const [shift, setShift] = useState([])
    const [noPlanToday, setNoPlanToday] = useState([])
    const [shiftName, setShiftName] = useState("");
    const [shiftToday, setShiftToday] = useState([])

    console.log(activePlan, 'active');
    console.log(shift, 'shift');
    console.log(mqttData1, 'mqdata1');
    console.log(mqttData2, 'mqdata2');

    const fetchActiveData = async () => {
        try {
            const res1 = await axiosPlanning.get('planning-production', getHeaderConfigAxios())
            setActivePlan(res1.data.data)
            const res2 = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_PLANNING_SERVICE}/report-shift/report`, getHeaderConfigAxios())
            setShift(res2.data.data)
            console.log(res2.data.data, 'res2');
        } catch (error) {
            console.log(error, 'error fetch data');
        }
    }
      useEffect(() => {
        fetchActiveData();
        const intervalId = setInterval(() => {
          fetchActiveData();
        }, 5000);
        
        return () => {
            clearInterval(intervalId);
        };
      }, []);

    useEffect(() => {
        if (activePlan.length != 0) {
            client
                .subscribe(`MC${activePlan.machine.id}:PLAN:RPA`, {
                    qos: 2
                })
                .subscribe(`MC${activePlan.machine.id}:LS:RPA`, {
                    qos: 2
                })
                .on("message", (topic, message) => {
                    if (topic == `MC${activePlan.machine.id}:LS:RPA`) {
                        setMqttData2(JSON.parse(message))
                    }
                    if (topic == `MC${activePlan.machine.id}:PLAN:RPA`) {
                        setMqttData1(JSON.parse(message))
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
        if (activePlan) {
            try {
                const fetchNoPlan = async () => {
                    const res2 = await axiosPlanning.get('no-plan-machine', getHeaderConfigAxios())
                    const noPlanTdy = res2.data.data.filter(item => {
                        if (item.day == moment().format('dddd').toLowerCase()) {
                            const timeInNoPlan = moment(item.time_in, 'HH:mm:ss')
                            const timeOutNoPlan = moment(item.time_out, 'HH:mm:ss')
                            const timeNow = moment(moment().format('HH:mm:ss'), 'HH:mm:ss')
                            const timeStart = moment(moment(activePlan?.date_time_in).format('HH:mm:ss'), 'HH:mm:ss')
        
                            // if (timeInNoPlan.isBetween(timeStart, timeNow) && timeOutNoPlan.isBetween(timeStart, timeNow) ) {
                                return item
                            // }
                        }
                    })
                    setNoPlanToday(noPlanTdy)
                }
                fetchNoPlan()
            } catch (error) {
                console.log(error, 'error fetch noplan');
            }
        }
    }, [activePlan])

    useEffect(() => {
        fetchActiveData()
    }, [])

    useEffect(() => {
        if (activePlan && shift.length > 0) {
            const matchingShift = shift.find(s => s.planning_id === activePlan.id);
            if (matchingShift && activePlan.active_plan) {
                setShiftName(matchingShift.operator_name);
            }
        }
    }, [activePlan, shift]);


    // quality ring
    const qtyActual = mqttData1.qty_actual;
    const qtyOk  = mqttData1.qty_actual - 0;

    const calculateQualityPercentage = () => {
        let qtyActualShift = 0
        let qtyNGShift = 0
        if (shiftToday.length > 0) {
            qtyActualShift = shiftToday.filter(item => item?.shift?.includes(activePlan?.shift?.name))?.reduce((a,b) => Number(a) + Number(b.qty_actual) ,0)
        }
        const qtyActual = mqttData1.qty_actual + qtyActualShift;
        const qtyOk = (mqttData1.qty_actual + qtyActualShift) - (0 + qtyNGShift);
        const qtyPlanning = activePlan.qty_planning;
        if (qtyPlanning === 0) {
            return 0;
        }
        // const qualityPercentage = Math.ceil((qtyActual - 0) / qtyPlanning);
        const qualityPercentage = Math.round( qtyActual/ qtyOk * 100);

        if (isNaN(qualityPercentage)) {
            return 0;
        }


        return qualityPercentage;
    };

    const qualityPercentage = calculateQualityPercentage();

    // quality untuk oee
    const calculateQuality = () => {
        let qtyActualShift = 0
        let qtyNGShift = 0
        if (shiftToday.length > 0) {
            qtyActualShift = shiftToday.filter(item => item?.shift?.includes(activePlan?.shift?.name))?.reduce((a,b) => Number(a) + Number(b.qty_actual) ,0)
        }
        const qtyActual = mqttData1.qty_actual + qtyActualShift;
        const qtyOk = (mqttData1.qty_actual + qtyActualShift) - (0 + qtyNGShift);
        const qtyPlanning = activePlan.qty_planning;

        if (qtyPlanning === 0) {
            return 0;
        }
        const qualityPercentage = (qtyActual/ qtyOk);

        if (isNaN(qualityPercentage)) {
            return 0;
        }
        
        return qualityPercentage;
    };

    const quality = calculateQuality();
    console.log(qualityPercentage, 'qua');


    //   perfomance
    const [timeActual, setTimeActual] = useState(0);
    const [startTime, setStartTime] = useState(null);

    const cycleTime = activePlan.product ? activePlan.product.cycle_time : 0;
    let timePlanned = Math.round(cycleTime * qtyActual / 60);
    if (shiftToday.length > 0) {
        shiftToday?.filter(item => item.shift.includes(activePlan?.shift?.name))?.map(item => {
            const reportShiftTimePlanned = item.product_cycle_time * item.qty_actual / 60
            timePlanned += Number(reportShiftTimePlanned)
        })
    }

    //perfomance ring
    const calculatePerformancePercentage = () => {
        // const cycleTimeQtyActual = cycleTime * qtyActual;
        if (timeActual === 0) {
            return 0;
        }
        let noPlnaTempry=0
        if (activePlan.shift.no_plan_machine_id) {
            const totalNoPlan = activePlan.shift.no_plan_machine_id.reduce((total, value) => total ?? 0 + value.total, 0);
            noPlnaTempry = totalNoPlan ?? 0;
        }
        const performance = timePlanned / (timeActual - noPlnaTempry) * 100;
        console.log(cycleTime,qtyActual , timeActual, noPlnaTempry, 'perfomance');
        const performancePercentage = Math.round(performance);
        return performancePercentage;
    };

    const performancePercentage = calculatePerformancePercentage();

    //perfomance 
    const calculatePerformance = () => {
        const cycleTimeQtyActual = cycleTime * qtyActual;
        if (timeActual === 0) {
            return 0;
        }
        const performance = timePlanned / timeActual;
        const performancePercentage = performance;
        return performancePercentage;
    };

    const performance = calculatePerformance();



    //   availibity
    const [plannedAvailability, setPlannedAvailability] = useState(0);

    useEffect(() => {
        //time actual
        const startTime = moment(activePlan.date_time_in).tz("Asia/Bangkok");
        const currentTime = moment().tz("Asia/Bangkok");
        let initialTimeDifferenceInMinutes = currentTime.diff(startTime, 'minutes');
        // const fixedMinutes = Math.min(initialTimeDifferenceInMinutes, 47);
        const fixedMinutes = Math.min(initialTimeDifferenceInMinutes,(moment(activePlan.date_time_in).add(1, 'hour').minute(0).diff(moment(activePlan.date_time_in), 'minute')))
        const additionalMinutes = fixedMinutes + Math.floor((initialTimeDifferenceInMinutes - fixedMinutes) / 60) * 60; 
        if (shiftToday.length > 0) {
            initialTimeDifferenceInMinutes += shiftToday?.filter(item => item.shift.includes(activePlan?.shift?.name))?.reduce((a, b) => Number(a) + Number(b.total_planning) , 0)
        }
        setTimeActual(initialTimeDifferenceInMinutes);
      

        // availability actual
        const calculatePlannedAvailability = () => {
            const startTime = moment(activePlan.date_time_in).tz("Asia/Bangkok");
            const currentTime = moment().tz("Asia/Bangkok");
            let timeDifference = currentTime.diff(startTime, 'minutes');
            if (shiftToday.length > 0) {
                timeDifference += shiftToday?.filter(item => item.shift.includes(activePlan?.shift?.name))?.reduce((a, b) => Number(a) + Number(b.total_planning) ,0)
            }
            // let newPlannedAvailability = 0;

            // if (timeDifference >= 0) {
            //     newPlannedAvailability = Math.floor(timeDifference / 10) * 10;
            // }

            // if (activePlan.shift.no_plan_machine_id) {
            //     const totalNoPlan = activePlan.shift.no_plan_machine_id.reduce((total, value) => total + value.total, 0);
            //     newPlannedAvailability -= totalNoPlan;
            // }

            // newPlannedAvailability = Math.max(newPlannedAvailability, 0);
            setPlannedAvailability(timeDifference);
        };
        calculatePlannedAvailability();
        const intervalId = setInterval(() => {
            setPlannedAvailability((prevTimeActual) => prevTimeActual + 1);
            setTimeActual((prevTimeActual) => prevTimeActual + 1);
        }, 60000);
        // const intervalId = setInterval(() => {
        //     calculatePlannedAvailability();
        // }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [activePlan, shiftToday]);

    const [plannedActual, setPlannedActual] = useState(0);
    useEffect(() => {
        const calculatePlannedActual = () => {
            const startTime = moment(activePlan.date_time_in).tz("Asia/Bangkok");
            const currentTime = moment().tz("Asia/Bangkok");
            let timeDifference = currentTime.diff(startTime, 'minutes');
            if (shiftToday.length > 0) {
                timeDifference = Number(timeDifference) + shiftToday?.filter(item => item.shift.includes(activePlan?.shift?.name))?.reduce((a, b) => Number(a) + Number(b.total_planning) ,0)
            }

            let newPlannedActual = 0;
            
            // if (timeDifference >= 0) {
            //     // newPlannedActual = Math.floor(timeDifference / 10) * 10;
            // }
            
            newPlannedActual = timeActual;
            let noPlnaTempry = 0
            if (noPlanToday.length > 0) {
                newPlannedActual = timeDifference / 2;
                noPlanToday.map(item => {
                    if (
                        moment(item.time_in, 'HH:mm:ss').isSameOrAfter(moment(moment(activePlan.date_time_in).format('HH:mm:ss'), 'HH:mm:ss')) && 
                        moment(item.time_in, 'HH:mm:ss').isSameOrBefore(moment(moment().format('HH:mm:ss'), 'HH:mm:ss'))
                    ) {
                        // console.log(item.total, 'no1131');
                        if (moment(moment().format('HH:mm:ss'), 'HH:mm:ss').isSameOrAfter(moment(item.time_in, 'HH:mm:ss'))) {
                            noPlnaTempry += (item.total ?? 0 ) / 2
                        }
                        if (moment(moment().format('HH:mm:ss'), 'HH:mm:ss').isSameOrAfter(moment(item.time_out, 'HH:mm:ss'))) {
                            noPlnaTempry += (item.total ?? 0 ) / 2
                        }
                        // if (item.time_out) {
                        //     // Jika ada time_out, hitung setengah dari total saat time_in
                        //     noPlnaTempry += (item.total ?? 0) / 2;
                        // }
                        // else {
                        //     // Jika tidak ada time_out, hitung seluruh total
                        //     noPlnaTempry += item.total ?? 0;
                        // }
                    }
                })
            }
            newPlannedActual = Math.max(newPlannedActual, 0);
            newPlannedActual -= mqttData2.TotalTime;
            setPlannedActual(timeDifference - mqttData2.TotalTime - noPlnaTempry ?? 0);
            console.log(noPlnaTempry, 'noplan');
        };

        

        calculatePlannedActual();
        const intervalId = setInterval(() => {
            calculatePlannedActual((prevTimeActual) => prevTimeActual + 1);
          }, 60000);

        // const intervalId = setInterval(() => {
        //     calculatePlannedActual();
        // }, 600000);

        return () => {
            clearInterval(intervalId);
        };
    }, [activePlan, mqttData2.TotalTime]);

    const calculateAvailabilityPercentage = () => {
        if (timeActual === 0) {
            return 0;
        }

        const currentTime = moment().tz("Asia/Bangkok");
        const dateIn = moment(activePlan.date_time_in).tz("Asia/Bangkok");
        let timeDifference = currentTime.diff(dateIn, 'minutes');

        const totalPlanningTime = mqttData2.TotalTime;
        // const availabilityPercentage = Math.round((timeDifference - totalPlanningTime) / timeDifference * 100);
        let noPlnaTempry=0
        if (activePlan.shift.no_plan_machine_id) {
            const totalNoPlan = activePlan.shift.no_plan_machine_id.reduce((total, value) => total ?? 0 + value.total, 0);
            noPlnaTempry = totalNoPlan ?? 0;
        }
        if (shiftToday.length > 0) {
            noPlnaTempry += shiftToday?.filter(item => item.shift.includes(activePlan?.shift?.name))?.reduce((a, b ) => Number(a) + Number(b.no_plan),0)
            timeDifference += shiftToday?.filter(item => item.shift.includes(activePlan?.shift?.name))?.reduce((a, b) =>  Number(a) + Number(b.total_planning) ,0)
        }
        console.log(noPlnaTempry, 'tpo');
        const availabilityPercentage = Math.round((timeDifference - totalPlanningTime - noPlnaTempry) / (plannedAvailability - noPlnaTempry) * 100);
        console.log(timeDifference, totalPlanningTime, noPlnaTempry, plannedActual, noPlnaTempry, 'pop');


        return availabilityPercentage;
    };

    const availabilityPercentage = calculateAvailabilityPercentage();

    const calculateAvailability = () => {
        if (timeActual === 0) {
            return 0;
        }

        const currentTime = moment().tz("Asia/Bangkok");
        const dateIn = moment(activePlan.date_time_in).tz("Asia/Bangkok");
        let timeDifference = currentTime.diff(dateIn, 'minutes');

        let noPlnaTempry=0
        if (activePlan.shift.no_plan_machine_id) {
            const totalNoPlan = activePlan.shift.no_plan_machine_id.reduce((total, value) => total ?? 0 + value.total, 0);
            noPlnaTempry = totalNoPlan ?? 0;
        }
        if (shiftToday.length > 0) {
            noPlnaTempry += shiftToday?.filter(item => item.shift.includes(activePlan?.shift?.name))?.reduce((a, b ) => Number(a) + Number(b.no_plan),0)
            timeDifference += shiftToday?.filter(item => item.shift.includes(activePlan?.shift?.name))?.reduce((a, b) =>  Number(a) + Number(b.total_planning) ,0)
        }
        // const availabilityPercentage = Math.round((timeDifference - totalPlanningTime - noPlnaTempry) / plannedAvailability * 100);


        const totalPlanningTime = mqttData2.TotalTime;
        const availability = ((timeDifference - totalPlanningTime - noPlnaTempry) / (plannedAvailability - noPlnaTempry) );


        return availability;
    };

    const availability = calculateAvailability();

    // oee
    // const multipliedPercentage = availabilityPercentage * performance * quality;
    const multipliedPercentage = availability * performance * quality * 100;
    console.log(availability, performance, quality, 'data');

    const roundedPercentage = Math.round(multipliedPercentage);

    useEffect(() => {
        setShiftToday(shift.filter(item => moment(item.created_at).format('YYYY-MM-DD') == moment(activePlan?.created_at).format('YYYY-MM-DD')))
    }, [shift])
    //shift
    console.log(shiftToday, 'today');
    const nameShift0 = shiftToday?.[0]?.shift || '-';
    const nameShift1 = shiftToday?.[1]?.shift || '-';
    const createAt = moment(activePlan?.created_at).format('DD-MM-YYYY');

    const oeeReport0 = (shiftToday.length == 0 ? roundedPercentage : isNaN(Math.round((shiftToday?.[0]?.oee)* 100)) ? '-' : Math.round((shiftToday?.[0]?.oee)* 100) + roundedPercentage);
    const oeeReport1 = shiftToday.length == 1 && shiftToday.length != 0 && shiftToday?.find(item => item.shift != activePlan?.shift?.name) == true ? roundedPercentage : "-";
    console.log(shiftToday.length != 0 && shiftToday?.find(item => item.shift != activePlan?.shift?.name) == true , 'gokil');

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
                    <p style={{ textAlign: 'left', marginLeft: '130px' }}>AVAILABILITY</p>
                </div>
                <div style={{ flex: '1' }}>
                    <p style={{ textAlign: 'right', marginRight: '180px' }}>PERFORMANCE</p>
                </div>
            </div>
            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px', marginTop: '-60px' }}>
                <h1>O E E</h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-70px' }}>
                <div>
                    <RingProgress roundCaps thickness={20} style={{ marginLeft: '130px' }} sections={[{ value: availabilityPercentage, color: 'green'
                        }]} label={ <Text c="green" fw={700} ta="center" size={30}>
                        {availabilityPercentage.toFixed(0)}%
                        </Text>
                        }
                        size={250}
                        />
                        <Paper shadow="xs" withBorder style={{ marginLeft: '130px' }}>
                            <div style={{  textAlign: 'center' }}>
                                <p>Availibity planned :{Math.round(plannedAvailability)} minutes</p>
                                <p>Availibity actual : {Math.round(plannedActual)} minutes</p>
                                {/* <p>Availibity actual : {timeActual} minutes</p> */}
                            </div>
                        </Paper>
                </div>
                <div>
                    <RingProgress roundCaps thickness={20} style={{ marginRight: '120px' }} sections={[{ value: performancePercentage, color: 'green'
                        }]} label={ <Text c="green" fw={700} ta="center" size={30}>
                        {performancePercentage.toFixed(0)}%
                        </Text>
                        }
                        size={250}
                        />
                        <Paper shadow="xs" withBorder style={{ marginRight: '120px' }}>
                            <div style={{  textAlign: 'center' }}>
                                <p>Time planned : {Math.round(timePlanned)} minutes</p>
                                <p>Time actual : {Math.round(timeActual)} minutes</p>
                            </div>
                        </Paper>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-260px' }}>
                <RingProgress roundCaps thickness={40} sections={[{ value: roundedPercentage, color: 'green' }]} label={ <Text c="green" fw={700}
                    ta="center" size={50}>
                    {roundedPercentage.toFixed()}%
                    </Text>
                    }
                    size={600}
                    />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-150px', height: '220px' }}>
                <div style={{ height: '220px',width: '300px', marginLeft: '100px' }}>
                    <div>
                        <Image alt="" src={table} width={300} />
                        <div style={{ fontWeight: 'bold', marginTop: '-190px', textAlign: 'center' }}>
                            <p>{createAt}</p>
                        </div>
                        <div
                            style={{ display: 'flex', fontSize: '35px', fontWeight: 'bold', justifyContent: 'space-between', marginTop: '-35px' }}>
                            <p style={{ marginLeft: '15px' }}>{nameShift0}</p>
                            <p style={{ marginRight: '13px' }}>{nameShift1}</p>
                        </div>
                        <div
                            style={{ display: 'flex', fontSize: '50px', fontWeight: 'bold', color: 'skyblue', justifyContent: 'space-between', marginTop: '-70px' }}>
                            <p style={{ marginLeft: '15px' }}>{oeeReport0}%</p>
                            <p style={{ marginRight: '15px' }}>{oeeReport1}%</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{ flex: '1', marginTop: '-50px', fontWeight: 'bold' }}>
                        <p style={{ textAlign: 'right', marginRight: '200px' }}>QUALITY</p>
                    </div>
                    <div>
                        <RingProgress roundCaps thickness={20} style={{ marginRight: '115px', marginTop: '-15px' }} sections={[{ value: qualityPercentage, color: 'green'
                            }]} label={ <Text c="green" fw={700} ta="center" size={30}>
                            {qualityPercentage.toFixed(0)}%
                            </Text>
                            }
                            size={250}
                            />
                            <Paper shadow="xs" withBorder style={{ marginRight: '110px' }}>
                                <div style={{  textAlign: 'center' }}>
                                    <p>Total Production : {qtyActual} Pcs</p>
                                    <p>Total Product OK : {qtyOk} Pcs</p>
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
