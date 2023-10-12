import { Table, Menu, Button, Space, ActionIcon, Select, Text, rem, useMantineTheme, ScrollArea } from '@mantine/core';
import Image from 'next/image';
import mht from '@/assets/mht.png';
import robot from '@/assets/robot.png';
import { IconCircleDot, IconSquareCheck, IconPackage, IconUsers, IconCalendar, IconChevronDown } from '@tabler/icons';
import { useState, useEffect, useRef } from 'react';
import axiosPlanning from "@/libs/planning/axios";
import axiosHour from "@/libs/service_per_hour/axios";
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import * as moment from 'moment-timezone';
import { useRouter } from 'next/router';
import client from '@/libs/mqtt'
import DownTime from '@/components/views/Dashboard/MonitorMachine/DownTime';
import MachineCondition from '@/components/views/Dashboard/MonitorMachine/MachineCondition';
import { getCookie } from 'cookies-next';

export default function Home({headers}) {

    const [mqttData1, setMqttData1] = useState([])

    const theme = useMantineTheme();
    const router = useRouter()

    const [activeCategory, setActiveCategory] = useState(null);
    const [activeMenuItem, setActiveMenuItem] = useState(null);
    const [isMenuActive, setMenuActive] = useState(false);
    const [isFullActive, setFullActive] = useState(false);
    const [dashboardButtonText, setDashboardButtonText] = useState('Dashboard');
    const [updownButtonColor, setUpdownButtonColor] = useState('teal');
    const isDashboardVisible = !isFullActive;
    const [activePlan, setActivePlan] = useState([])
    const [productionData, setProductionData] = useState([])
    const [noPlanMachine, setNoPlanMachine] = useState([])
    const [noPlanToday, setNoPlanToday] = useState([])

    const fetchActiveData = async () => {
        try {
            const res1 = await axiosPlanning.get('planning-production', getHeaderConfigAxios())
            setActivePlan(res1.data.data)
            const res2 = await axiosPlanning.get('no-plan-machine', getHeaderConfigAxios())
            setNoPlanMachine(res2.data.data)
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
    
    useEffect(() => {
        if (activePlan?.id) {
            const fetchData = async () => {
                try {
                    const res = await axiosHour.get(`production/data-active/${activePlan.id}`, getHeaderConfigAxios())
                    setProductionData(res.data.data)
                } catch (error) {
                    console.log(error, 'production fetch error');
                }
            }
            fetchData()
        }
        if (noPlanMachine) {
            const today = moment().format('dddd')?.toLowerCase()
            const noPlanToday = noPlanMachine.filter(item => item.day == today)
            setNoPlanToday(noPlanToday ? noPlanToday : [])
        }
    }, [activePlan])

    if (activePlan.id) {
        setInterval(async () => {
            const res = await axiosHour.get(`production/data-active/${activePlan.id}`, headers)
            setProductionData(res.data.data)
        }, 1000 * 60);
    }
    // Fungsi untuk mengubah kategori aktif
    const handleCategoryClick = (category) => {
        setActiveCategory(category === activeCategory ? null : category);
    };

    // Fungsi untuk mengubah menu item aktif
    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem === activeMenuItem ? null : menuItem);
        router.push(`/master-data/${((menuItem).replaceAll(" ",'-')).toLowerCase()}`)
    };

    const handleMenuClick = () => {
        setMenuActive(true);
        setFullActive(false);
        setUpdownButtonColor('teal');
    };

    const handleFullClick = () => {
        setMenuActive(false);
        setFullActive(true);
        setUpdownButtonColor('gray');
    };

    const totalActual = () => {
        let total = 0
        productionData.map(item => (
            total += item.qty_actual
        ))
        return Math.round(total)
    }

    const totalTarget = () => {
        // Math.round((activePlan?.qty_per_minute * 60)) * productionData.length
        let totalTarget = 0
        {productionData.map((item, index) => {
            let noPlanTotal = 0
            noPlanToday.map(row => {
                if (
                    moment(row.time_in, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) &&
                    moment(row.time_out, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_out, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) 
                ) {
                    noPlanTotal += row.total
                } else if (
                    moment(row.time_in, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) &&
                    moment(row.time_out, 'HH:mm').isAfter(moment(item.time_start, 'HH:mm')) 
                ) {
                    noPlanTotal += (moment(row.time_out, "HH:mm").diff(moment(item.time, "HH:mm"), 'minutes') -1)
                } else if (
                    moment(row.time_in, 'HH:mm').isBefore(moment(item.time_start, "HH:mm")) && moment(row.time_out, "HH:mm").isSameOrAfter(moment(item.time_start, "HH:mm")) &&
                    moment(row.time_out, "HH:mm").isSameOrBefore(moment(item.time, "HH:mm"))
                ) {
                    noPlanTotal += moment(row.time_out, "HH:mm").diff(moment(item.time_start, "HH:mm"), 'minutes')
                }
            })
            totalTarget += Math.round((activePlan?.qty_per_minute * (60 - noPlanTotal)))
        })}
        return totalTarget
    }

    const totalNoPlan = () => {
        let total = 0
        noPlanToday.map(item => {
            total += item.total
        })
        return total
    }

    const totalDurasi = () => {
        let duration = 0
        {productionData.map((item) => {
            let noPlanTotal = 0
            noPlanToday.map(row => {
                if (
                    moment(row.time_in, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) &&
                    moment(row.time_out, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_out, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) 
                ) {
                    noPlanTotal += row.total
                } else if (
                    moment(row.time_in, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) &&
                    moment(row.time_out, 'HH:mm').isAfter(moment(item.time_start, 'HH:mm')) 
                ) {
                    noPlanTotal += (moment(row.time_out, "HH:mm").diff(moment(item.time, "HH:mm"), 'minutes') -1)
                } else if (
                    moment(row.time_in, 'HH:mm').isBefore(moment(item.time_start, "HH:mm")) && moment(row.time_out, "HH:mm").isSameOrAfter(moment(item.time_start, "HH:mm")) &&
                    moment(row.time_out, "HH:mm").isSameOrBefore(moment(item.time, "HH:mm"))
                ) {
                    noPlanTotal += moment(row.time_out, "HH:mm").diff(moment(item.time_start, "HH:mm"), 'minutes')
                }
            })
            duration += 60 - noPlanTotal
        })}
        return duration + durasiMqtt()
    }

    const qtyActualMqtt = () => {
        let qtyActualMqtt = mqttData1.qty_actual ? mqttData1.qty_actual : 0
        return qtyActualMqtt - totalActual()
    }

    const qtyTargetMqtt = () => {
        let duration = 60
        const timeStart = moment(productionData[productionData.length - 1]?.time_start, "HH:mm").add(1, 'hours').format('HH:mm')
        const timeEnd = moment(productionData[productionData.length - 1]?.time_start, "HH:mm").add(1, 'hours').add(59, 'minutes').format('HH:mm')
        noPlanToday.map(row => {
            if (
                moment(row.time_in, 'HH:mm').isSameOrAfter(moment(timeStart, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(timeEnd, 'HH:mm')) &&
                moment(row.time_out, 'HH:mm').isSameOrAfter(moment(timeStart, 'HH:mm')) && moment(row.time_out, 'HH:mm').isSameOrBefore(moment(timeEnd, 'HH:mm')) 
            ) {
                duration -= row.total
            } else if (
                moment(row.time_in, 'HH:mm').isSameOrAfter(moment(timeStart, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(timeEnd, 'HH:mm')) &&
                moment(row.time_out, 'HH:mm').isAfter(moment(timeStart, 'HH:mm')) 
            ) {
                duration -= (moment(row.time_out, "HH:mm").diff(moment(timeEnd, "HH:mm"), 'minutes') -1)
            } else if (
                moment(row.time_in, 'HH:mm').isBefore(moment(timeStart, "HH:mm")) && moment(row.time_out, "HH:mm").isSameOrAfter(moment(timeStart, "HH:mm")) &&
                moment(row.time_out, "HH:mm").isSameOrBefore(moment(timeEnd, "HH:mm"))
            ) {
                duration -= moment(row.time_out, "HH:mm").diff(moment(timeStart, "HH:mm"), 'minutes')
            }
        })
        return Math.round(duration * activePlan.qty_per_minute)
    }

    const durasiMqtt = () => {
        let duration = 60
        const timeStart = moment(productionData[productionData.length - 1]?.time_start, "HH:mm").add(1, 'hours').format('HH:mm')
        const timeEnd = moment(productionData[productionData.length - 1]?.time_start, "HH:mm").add(1, 'hours').add(59, 'minutes').format('HH:mm')
        noPlanToday.map(row => {
            if (
                moment(row.time_in, 'HH:mm').isSameOrAfter(moment(timeStart, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(timeEnd, 'HH:mm')) &&
                moment(row.time_out, 'HH:mm').isSameOrAfter(moment(timeStart, 'HH:mm')) && moment(row.time_out, 'HH:mm').isSameOrBefore(moment(timeEnd, 'HH:mm')) 
            ) {
                duration -= row.total
            } else if (
                moment(row.time_in, 'HH:mm').isSameOrAfter(moment(timeStart, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(timeEnd, 'HH:mm')) &&
                moment(row.time_out, 'HH:mm').isAfter(moment(timeStart, 'HH:mm')) 
            ) {
                duration -= (moment(row.time_out, "HH:mm").diff(moment(timeEnd, "HH:mm"), 'minutes') -1)
            } else if (
                moment(row.time_in, 'HH:mm').isBefore(moment(timeStart, "HH:mm")) && moment(row.time_out, "HH:mm").isSameOrAfter(moment(timeStart, "HH:mm")) &&
                moment(row.time_out, "HH:mm").isSameOrBefore(moment(timeEnd, "HH:mm"))
            ) {
                duration -= moment(row.time_out, "HH:mm").diff(moment(timeStart, "HH:mm"), 'minutes')
            }
        })
        return duration
    }

    const persentaseMqtt = () => {
        return Math.round(qtyActualMqtt() / qtyTargetMqtt() * 100)
    }

    
    const totalPersentase = (
        productionData.length == 0 ? (Math.round(qtyActualMqtt() / qtyTargetMqtt() * 100)) : (Math.round(isNaN(totalActual() / totalTarget()) ? 0 : ((totalActual() + qtyActualMqtt()) / (totalTarget() + qtyTargetMqtt())) * 100))
    )

    let content;
if (isFullActive) {
    content = (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button style={{
                width: '210px',
                backgroundColor: 'peru',
                display: 'flex', 
                justifyContent: 'center',
            }}
            pr={12}
            >
            <div
                style={{ display: 'flex', alignItems: 'center', width: '150px', justifyContent: 'center', height: '100px' }}>
                <ActionIcon>
                    <IconCircleDot style={{ color: 'white', backgroundColor: 'green', borderRadius: '100%'}} />
                </ActionIcon>
                No Trouble
            </div>
            </Button>
            <Space w="xs" />
            <Button style={{
                width: '210px',
                backgroundColor: 'peru',
                display: 'flex',
                justifyContent: 'center'
            }}
            pr={12}
            >
            <div
                style={{ display: 'flex', alignItems: 'center', width: '150px', justifyContent: 'center', height: '100px' }}>
                <ActionIcon>
                    <IconCircleDot style={{ color: 'white', backgroundColor: 'gold', borderRadius: '100%'}} />
                </ActionIcon>
                Trouble Solved
            </div>
            </Button>
            <Space w="xs" />
            <Button style={{
                width: '210px',
                backgroundColor: 'peru',
                display: 'flex',
                justifyContent: 'center'
            }} 
            pr={12}
            >
            <div
                style={{ display: 'flex', alignItems: 'center', width: '150px', justifyContent: 'center', height: '100px' }}>
                <ActionIcon>
                    <IconCircleDot style={{ color: 'white', backgroundColor: 'firebrick', borderRadius: '100%'}} />
                </ActionIcon>
                In Trouble
            </div>
            </Button>
            <Space w="xs" />
            <Button style={{
                width: '210px',
                backgroundColor: 'peru'
            }} 
            pr={12}
            >
                <div style={{ backgroundColor: 'lime', width: '100px', height: '25px', borderRadius: '5px', marginRight: '20px'  }}></div>
            Normal
            </Button>
            <Space w="xs" />
            <Button style={{
                width: '210px',
                backgroundColor: 'peru'
            }} 
            pr={12}
            >
            <div style={{ backgroundColor: 'gold', width: '100px', height: '25px', borderRadius: '5px', marginRight: '20px'  }}></div>
            Kritis
            </Button>
            <Space w="xs" />
            <Button style={{
                width: '210px',
                backgroundColor: 'peru'
            }} 
            pr={12}
            >
                <div style={{ backgroundColor: 'firebrick', width: '100px', height: '25px', borderRadius: '5px', marginRight: '20px'  }}></div>
            Trouble
            </Button>
        </div>
    );
}else {
    content = (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Tampilkan kategori hanya jika isFullActive adalah false */}
        {isDashboardVisible && (
            <>
            <Menu onOpen={() => handleCategoryClick('Dashboard')} onClose={() => handleCategoryClick('Dashboard')} position="top-end" width={310} withinPortal>
            <Menu.Target>
                    <Button style={{
                width: '320px',
                backgroundColor: activeCategory === 'Dashboard' ? '#e84393' : 'skyblue',
            }} 
                    pr={12}
                    
                    >
                    DASHBOARD
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item 
                onClick={() => handleMenuItemClick('Monitor Pencapaian per jam')}
                style={{
                    backgroundColor: activeMenuItem === 'Monitor Pencapaian per jam' ? 'skyblue' : 'white',
                }}
                >
                    <div style={{ display: 'flex', gap: '5px', aligItems: 'center' }}>
                        <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                        Monitor Pencapaian per jam
                    </div>
                    </Menu.Item>
                    <Menu.Item 
                onClick={() => handleMenuItemClick('Monitor O E E')}
                style={{
                    backgroundColor: activeMenuItem === 'Monitor O E E' ? 'skyblue' : 'white',
                }}
                >
                    <div style={{ display: 'flex', gap: '5px', aligItems: 'center' }}>
                        <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                        Monitor O E E
                    </div>
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <Space w="xs" />
            <Menu onOpen={() => handleCategoryClick('Master Data')} onClose={() => handleCategoryClick('Master Data')} position="top-end" width={310} withinPortal>
                <Menu.Target>
                    <Button style={{
                width: '320px',
                backgroundColor: activeCategory === 'Master Data' ? '#e84393' : 'skyblue',
            }} 
                    pr={12}
                    >
                    MASTER DATA
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>
                <Menu.Item onClick={() => handleMenuItemClick('User')}
                style={{
                    backgroundColor: activeMenuItem === 'User' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                        User
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Customer')}
                style={{
                    backgroundColor: activeMenuItem === 'Customer' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                        Customer
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Role')}
                style={{
                    backgroundColor: activeMenuItem === 'Role' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <IconUsers color={theme.colors.cyan[6]} stroke={1.5} />
                        Role
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Permission')}
                style={{
                    backgroundColor: activeMenuItem === 'Permission' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <IconCalendar color={theme.colors.violet[6]} stroke={1.5} />
                        Permission
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Machine Production')}
                style={{
                    backgroundColor: activeMenuItem === 'Machine Production' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                        Machine Production
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Product')}
                style={{
                    backgroundColor: activeMenuItem === 'Product' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                        Product
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Machine Condition')}
                style={{
                    backgroundColor: activeMenuItem === 'Machine Condition' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <IconUsers color={theme.colors.cyan[6]} stroke={1.5} />
                        Machine Condition
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Down Time')}
                style={{
                    backgroundColor: activeMenuItem === 'Down Time' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <IconCalendar color={theme.colors.violet[6]} stroke={1.5} />
                        Down Time
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Product Category')}
                style={{
                    backgroundColor: activeMenuItem === 'Product Category' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                        Product Category
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Machine Category')}
                style={{
                    backgroundColor: activeMenuItem === 'Machine Category' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                        Machine Category
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Down Time Category')}
                style={{
                    backgroundColor: activeMenuItem === 'Down Time Category' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <IconUsers color={theme.colors.cyan[6]} stroke={1.5} />
                        Down Time Category
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Shift')}
                style={{
                    backgroundColor: activeMenuItem === 'Shift' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <IconCalendar color={theme.colors.violet[6]} stroke={1.5} />
                        Shift
                    </div>
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <Space w="xs" />
            <Menu onOpen={() => handleCategoryClick('System Activity')} onClose={() => handleCategoryClick('System Activity')} position="top-end" width={310} withinPortal>
                <Menu.Target>
                    <Button style={{
                width: '320px',
                backgroundColor: activeCategory === 'System Activity' ? '#e84393' : 'skyblue',
            }} 
                    pr={12}
                    >
                    SYSTEM ACTIVITY
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item onClick={() => handleMenuItemClick('Production Planning')}
                style={{
                    backgroundColor: activeMenuItem === 'Production Planning' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', aligItems: 'center' }}>
                        <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                        Production Planning
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('WhatsApp Notification')}
                style={{
                    backgroundColor: activeMenuItem === 'WhatsApp Notification' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', aligItems: 'center' }}>
                        <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                        WhatsApp Notification
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Activity Rivise')}
                style={{
                    backgroundColor: activeMenuItem === 'Activity Rivise' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', aligItems: 'center' }}>
                        <IconUsers color={theme.colors.cyan[6]} stroke={1.5} />
                        Activity Rivise
                    </div>
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <Space w="xs" />
            <Menu onOpen={() => handleCategoryClick('System Report')} onClose={() => handleCategoryClick('System Report')} position="top-end" width={310} withinPortal>
                <Menu.Target>
                    <Button style={{
                width: '320px',
                backgroundColor: activeCategory === 'System Report' ? '#e84393' : 'skyblue',
            }}
                    pr={12}
                    >
                    SYSTEM REPORT
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item onClick={() => handleMenuItemClick('Acheivement Report')}
                style={{
                    backgroundColor: activeMenuItem === 'Acheivement Report' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', aligItems: 'center' }}>
                        <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                        Acheivement Report
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('OEE Report')}
                style={{
                    backgroundColor: activeMenuItem === 'OEE Report' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', aligItems: 'center' }}>
                        <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                        OEE Report
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Production Daily Report')}
                style={{
                    backgroundColor: activeMenuItem === 'Production Daily Report' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', aligItems: 'center' }}>
                        <IconUsers color={theme.colors.cyan[6]} stroke={1.5} />
                        Production Daily Report
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Production Montly Report')}
                style={{
                    backgroundColor: activeMenuItem === 'Production Montly Report' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', aligItems: 'center' }}>
                        <IconCalendar color={theme.colors.violet[6]} stroke={1.5} />
                        Production Montly Report
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Planning Daily Report')}
                style={{
                    backgroundColor: activeMenuItem === 'Planning Daily Report' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', aligItems: 'center' }}>
                        <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                        Planning Daily Report
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Planning Montly Report')}
                style={{
                    backgroundColor: activeMenuItem === 'Planning Montly Report' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', aligItems: 'center' }}>
                        <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                        Planning Montly Report
                    </div>
                    </Menu.Item>
                    <Menu.Item onClick={() => handleMenuItemClick('Pareto Report')}
                style={{
                    backgroundColor: activeMenuItem === 'Pareto Report' ? 'skyblue' : 'white',
                }}>
                    <div style={{ display: 'flex', gap: '5px', aligItems: 'center' }}>
                        <IconUsers color={theme.colors.cyan[6]} stroke={1.5} />
                        Pareto Report
                    </div>
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
            </>
        )}
    </div>
    );
}

return (
    <div>
        <div style={{
        display: 'flex',
        fontWeight: 'bold',
        backgroundColor: 'pink',
        height: '80px',
        alignItems: 'center', // Untuk mengatur vertikal ke tengah
        justifyContent: 'space-between', // Untuk mengatur horizontal ke pojok kanan
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Image src={mht} alt="Deskripsi Gambar" width={60} height={60} style={{ marginLeft: '10px' }} />
                <Image src={robot} alt="Deskripsi Gambar" width={60} height={60} style={{ marginLeft: '10px' }} />
                <h1 style={{ marginLeft: '10px' }}>RW 05</h1>
            </div>
            <div style={{ display: 'flex' }}>
                <div
                    id="buttonContainer"
                    style={{ backgroundColor: 'orange', borderRadius: '100px', padding: '10px', height: '30px', marginRight: '50px', marginTop: '7px' }}>
                    <div style={{ marginTop: '-3px' }}>
                        <Button variant="filled" style={{ background: !isFullActive ? '#e84393' : '#fff', marginRight: '10px', color: '#000'  }} radius="xl" onClick={handleMenuClick}>
                            Menu
                        </Button>
                        <Button variant="filled" radius="xl" style={{ background: isFullActive ? '#e84393' : '#fff', color: '#000' }} onClick={handleFullClick}>
                            Full
                        </Button>
                    </div>
                </div>
                <div>
                    <h2 style={{ marginRight: '40px' }}>DATE: {moment().format('YYYY-MM-DD')}</h2>
                </div>
            </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', overflowX: 'visible', overflowY: 'hidden' }}>
            <div style={{ display: 'flex' }}>
                <div
                    style={{ textAlign: 'center', backgroundColor: 'lavender', height: '225px', width: '120px', marginTop: '10px' }}>
                    <div
                        style={{ textAlign: 'center', backgroundColor: 'lavender', width: '120px', marginTop: '-7px' }}>
                        <p>Jam Mulai</p>
                        <p style={{ marginBottom: '35px' }}>Durasi (Menit)</p>
                        <p style={{ marginBottom: '35px' }}>Target</p>
                        <p style={{ marginBottom: '33px' }}>Actual</p>
                        <p>%-tase</p>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginLeft: '10px' }}>
                    <p>:</p>
                    <p style={{ marginBottom: '35px' }}>:</p>
                    <p style={{ marginBottom: '35px' }}>:</p>
                    <p style={{ marginBottom: '33px' }}>:</p>
                    <p>:</p>
                </div>
                {activePlan.length == 0 ? (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', backgroundColor: '#99c2a1', height: '75px', minWidth: '1190px' }}>
                            No Active Plan
                        </div>
                    </div>
                ) : (
                <div>
                    <div style={{ backgroundColor: 'gainsboro', marginLeft: '10px', height: '75px', minWidth: '1190px' }}>
                        <div>
                            <div style={{ display: 'flex', marginTop: '10px', fontWeight: 'bold' }}>
                                <div style={{ display: 'flex', marginTop: '-7px', marginLeft: '20px', gap: '70px', justifyContent: 'center', alignItems: 'center' }}>
                                    {productionData.map((item, index) => (
                                        <p key={index} style={index == 0 ? { width: '50px', textAlign: 'center' } : { width: '50px', textAlign: 'center'}}>{item.time_start}</p>
                                    ))}
                                    <p style={{width: '50px', textAlign: 'center' }}>{productionData.length > 0 ? moment(productionData[productionData.length - 1]?.time_start, "HH:mm").add(1, 'hours').format('HH:mm') : moment(activePlan.date_time_in).tz('Asia/Bangkok').format("HH")+':00'}</p>
                                    <p style={{display: 'flex', width: '100px', flexWrap: 'nowrap', justifyContent: 'center' }}>Total Shift</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', marginTop: '-16px', marginLeft: '20px', textAlign: 'center', gap: '70px' }}>
                                {productionData.map((item, index) => {
                                    let duration = 60
                                    noPlanToday.map(row => {
                                        if (
                                            moment(row.time_in, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) &&
                                            moment(row.time_out, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_out, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) 
                                        ) {
                                            duration -= row.total
                                        } else if (
                                            moment(row.time_in, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) &&
                                            moment(row.time_out, 'HH:mm').isAfter(moment(item.time_start, 'HH:mm')) 
                                        ) {
                                            duration -= (moment(row.time_out, "HH:mm").diff(moment(item.time, "HH:mm"), 'minutes') -1)
                                        } else if (
                                            moment(row.time_in, 'HH:mm').isBefore(moment(item.time_start, "HH:mm")) && moment(row.time_out, "HH:mm").isSameOrAfter(moment(item.time_start, "HH:mm")) &&
                                            moment(row.time_out, "HH:mm").isSameOrBefore(moment(item.time, "HH:mm"))
                                        ) {
                                            duration -= moment(row.time_out, "HH:mm").diff(moment(item.time_start, "HH:mm"), 'minutes')
                                        }
                                    })
                                    return (
                                        <p key={index} style={index == 0 ? { width: '50px', textAlign: 'center' } : { width: '50px', textAlign: 'center'}}>{duration}</p>
                                    )
                                })}
                                <p style={{width: '50px', textAlign: 'center' }}>{durasiMqtt()}</p>
                                <p style={{width: '100px' }}>{totalDurasi()}</p>
                            </div>
                        </div>
                    </div>
                    <div
                        style={{ backgroundColor: 'lightcyan', marginTop: '-15px', marginLeft: '10px', marginTop: '10px', height: '140px', textAlign: 'center' }}>
                        <div>
                            <div
                                style={{ display: 'flex', marginTop: '10px', marginLeft: '20px', fontSize: '25px', fontWeight: 'bold', color: 'cornflowerblue' }}>
                                <div style={{ display: 'flex', marginTop: '-20px', gap: '70px' }}>
                                    {productionData.map((item, index) => {
                                        let noPlanTotal = 0
                                        noPlanToday.map(row => {
                                            if (
                                                moment(row.time_in, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) &&
                                                moment(row.time_out, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_out, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) 
                                            ) {
                                                noPlanTotal += row.total
                                            } else if (
                                                moment(row.time_in, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) &&
                                                moment(row.time_out, 'HH:mm').isAfter(moment(item.time_start, 'HH:mm')) 
                                            ) {
                                                noPlanTotal += (moment(row.time_out, "HH:mm").diff(moment(item.time, "HH:mm"), 'minutes') -1)
                                            } else if (
                                                moment(row.time_in, 'HH:mm').isBefore(moment(item.time_start, "HH:mm")) && moment(row.time_out, "HH:mm").isSameOrAfter(moment(item.time_start, "HH:mm")) &&
                                                moment(row.time_out, "HH:mm").isSameOrBefore(moment(item.time, "HH:mm"))
                                            ) {
                                                noPlanTotal += moment(row.time_out, "HH:mm").diff(moment(item.time_start, "HH:mm"), 'minutes')
                                            }
                                        })
                                        return (
                                            <p key={index} style={index == 0 ?{ width: '50px', textAlign: 'center'} : { width: '50px', textAlign: 'center' }}>{Math.round((60 - noPlanTotal) * activePlan.qty_per_minute)}</p>
                                        )
                                    })}
                                    <p style={{ width: '50px', textAlign: 'center' }}>{qtyTargetMqtt()}</p>
                                    <p style={{  width: '100px' }}>{totalTarget() + qtyTargetMqtt()}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', fontSize: '35px', fontWeight: 'bold', color: 'gold' }}>
                                <div style={{ display: 'flex', marginTop: '-40px', marginLeft: '20px', gap: '70px' }}>
                                    {productionData.map((item, index) => (
                                        <p key={index} style={index == 0 ? { width: '50px', textAlign: 'center' } : { width: '50px', textAlign: 'center' }}>{item.qty_actual}</p>
                                    ))}
                                    <p style={{ width: '50px', textAlign: 'center' }}>{qtyActualMqtt()}</p>
                                    <p style={{  width: '100px' }}>{mqttData1.qty_actual ? mqttData1.qty_actual : 0}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', fontSize: '22px', fontWeight: 'bold', color: 'firebrick' }}>
                                <div style={{ display: 'flex', marginTop: '-40px', marginLeft: '28px', gap: '70px' }}>
                                    {productionData.map((item,index) => {
                                        let persentase = 0
                                        let noPlanTotal = 0
                                        noPlanToday.map(row => {
                                            if (
                                                moment(row.time_in, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) &&
                                                moment(row.time_out, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_out, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) 
                                            ) {
                                                noPlanTotal += row.total
                                            } else if (
                                                moment(row.time_in, 'HH:mm').isSameOrAfter(moment(item.time_start, 'HH:mm')) && moment(row.time_in, 'HH:mm').isSameOrBefore(moment(item.time, 'HH:mm')) &&
                                                moment(row.time_out, 'HH:mm').isAfter(moment(item.time_start, 'HH:mm')) 
                                            ) {
                                                noPlanTotal += (moment(row.time_out, "HH:mm").diff(moment(item.time, "HH:mm"), 'minutes') -1)
                                            } else if (
                                                moment(row.time_in, 'HH:mm').isBefore(moment(item.time_start, "HH:mm")) && moment(row.time_out, "HH:mm").isSameOrAfter(moment(item.time_start, "HH:mm")) &&
                                                moment(row.time_out, "HH:mm").isSameOrBefore(moment(item.time, "HH:mm"))
                                            ) {
                                                noPlanTotal += moment(row.time_out, "HH:mm").diff(moment(item.time_start, "HH:mm"), 'minutes')
                                            }
                                        })
                                        persentase = Math.round((item.qty_actual / Math.round(activePlan.qty_per_minute * (60 - noPlanTotal))) * 100)
                                        return <p key={index} style={index == 0 ? { width: '50px', textAlign: 'center', color: `${persentase >= 100 ? 'green' : ''}`} : { width: '50px', textAlign: 'center' , color: `${persentase >= 100 ? 'green' : ''}`}}>{persentase}%</p>
                                    })}
                                    <p style={{ width: '50px', textAlign: 'center' , color: `${(persentaseMqtt()) >= 100 ? 'green' : ''}` }}>{persentaseMqtt()}%</p>
                                    <p style={{  width: '100px', color: `${totalPersentase >= 100 ? 'green' : ''}` }}>{totalPersentase}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                )}
            </div>
        </div>
        <div style={{ display: 'flex' }}>
            <div style={{ width: '100px', border: '10px solid skyblue', textAlign: 'center', minHeight: '304px' }}>
                <div style={{ marginTop: '-16px' }}>
                    <p style={{ backgroundColor: 'gainsboro', padding: '10px' }}>Operator</p>
                    <p style={{ padding: '10px', marginTop: '-16px' }}>{activePlan?.user}</p>
                </div>
                <div>
                    <p style={{ backgroundColor: 'gainsboro', padding: '10px', marginTop: '-16px' }}>Shift</p>
                    <p style={{ padding: '10px', marginTop: '-16px' }}>{activePlan?.shift?.name}</p>
                </div>
                <div>
                    <p style={{ backgroundColor: 'gainsboro', padding: '10px', marginTop: '-16px' }}>Nama Part</p>
                    <p style={{ padding: '10px', marginTop: '-16px' }}>{activePlan?.product?.part_name}</p>
                </div>
                <div>
                    <p style={{ backgroundColor: 'gainsboro', padding: '10px', marginTop: '-16px' }}>Cycle Time</p>
                    <p style={{ padding: '0', marginTop: '-16px' }}>{activePlan?.product?.cycle_time}</p>
                </div>
            </div>
            <DownTime machineId={activePlan?.machine?.id} />
           <MachineCondition activePlan={activePlan} machineId={activePlan?.machine?.id}/>
        </div>
        <div
            style={{ backgroundColor: 'lavender', height: '50px', borderRadius: '10px', marginTop: '10px', border: '2px solid skyblue', display: 'flex', alignItems: 'center', justifyContent: 'center'  }}>
            <Menu position="top-end" width={310} withinPortal>
            <Menu.Target>
                <ScrollArea>
                    {content}
                </ScrollArea>
            </Menu.Target>
                
                
            </Menu>
        </div>
    </div>
);
}

export async function getServerSideProps(context) {
    try {
      const headers = getHeaderConfigAxios(context.req, context.res);
      return {
        props: {
          headers: headers,
        },
      };
    } catch (error) {
      return {
        props: {
          error: 'Error message',
        },
      };
    }
  }
  