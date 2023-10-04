    import { Table, Menu, Button, Space, ActionIcon, Select, Text, rem, useMantineTheme } from '@mantine/core';
    import Image from 'next/image';
    import mht from '@/assets/mht.png';
    import robot from '@/assets/robot.png';
    import { IconCircleDot, IconSquareCheck, IconPackage, IconUsers, IconCalendar, IconChevronDown } from '@tabler/icons';
    import { useState, useEffect, useRef } from 'react';
    import axiosPlanning from "@/libs/planning/axios";
    import axiosHour from "@/libs/service_per_hour/axios";
    import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import moment from 'moment';
    export default function Home() {
        const theme = useMantineTheme();

        const [activeCategory, setActiveCategory] = useState(null);
        const [activeMenuItem, setActiveMenuItem] = useState(null);
        const [isMenuActive, setMenuActive] = useState(false);
        const [isFullActive, setFullActive] = useState(false);
        const [dashboardButtonText, setDashboardButtonText] = useState('Dashboard');
        const [updownButtonColor, setUpdownButtonColor] = useState('teal');
        const isDashboardVisible = !isFullActive;
        const [activePlan, setActivePlan] = useState([])
        const [data, setData] = useState([])
        const [noPlanMachine, setNoPlanMachine] = useState([])
        const [noPlanToday, setNoPlanToday] = useState([])

        useEffect(() => {
            const fetchActiveData = async () => {
                const res = await axiosPlanning.get('planning-production', getHeaderConfigAxios())
                setActivePlan(res.data.data)
            }
            const fetchNoPlanMachine = async () => {
                const res = await axiosPlanning.get('no-plan-machine', getHeaderConfigAxios())
                setNoPlanMachine(res.data.data)
            }
            fetchActiveData()
            fetchNoPlanMachine()
        },[])

        useEffect(() => {
            if (activePlan.id) {
                const fetchData = async () => {
                    const res = await axiosHour.get(`production/data-active/${activePlan.id}`, getHeaderConfigAxios())
                    setData(res.data.data)
                }
                fetchData()
            }
            if (noPlanMachine) {
                const today = moment().format('dddd')?.toLowerCase()
                const noPlanToday = noPlanMachine.find(item => item.day == today)
                setNoPlanToday(noPlanToday ? noPlanToday : [])
            }
        }, [activePlan, noPlanMachine])

        console.log(activePlan, 'active plan');
        console.log(data, 'active data');
        console.log(noPlanMachine, 'noplan');
        console.log(noPlanToday, 'noplan today');

        const totalQtyActual = () => {
            let totalActual = 0
            data.filter(item => (
                item.time == "07:59:59" ||
                item.time == "08:59:59" ||
                item.time == "09:59:59" ||
                item.time == "10:59:59" ||
                item.time == "11:59:59" ||
                item.time == "12:59:59" ||
                item.time == "13:59:59" ||
                item.time == "14:59:59" ||
                item.time == "15:59:59" ||
                item.time == "16:59:59"
            )).map(item => (
                totalActual += item.qty_actual
            ))
            return totalActual
        }

        // Fungsi untuk mengubah kategori aktif
        const handleCategoryClick = (category) => {
            setActiveCategory(category === activeCategory ? null : category);
        };

        // Fungsi untuk mengubah menu item aktif
        const handleMenuItemClick = (menuItem) => {
            setActiveMenuItem(menuItem === activeMenuItem ? null : menuItem);
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

        const percentage1 = '100%';

        const isPercentage100 = (percentage) => {
            return percentage === '100%';
        };

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
                <Menu position="top-end" width={310} withinPortal>
                <Menu.Target>
                        <Button style={{
                    width: '320px',
                    backgroundColor: activeCategory === 'Dashboard' ? 'gold' : 'skyblue',
                }} 
                        pr={12}
                        onClick={() => handleCategoryClick('Dashboard')}
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
                            <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                            Monitor Pencapaian per jam
                        </Menu.Item>
                        <Menu.Item 
                    onClick={() => handleMenuItemClick('Monitor O E E')}
                    style={{
                        backgroundColor: activeMenuItem === 'Monitor O E E' ? 'skyblue' : 'white',
                    }}
                    >
                            <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                            Monitor O E E
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                <Space w="xs" />
                <Menu position="top-end" width={310} withinPortal>
                    <Menu.Target>
                        <Button style={{
                    width: '320px',
                    backgroundColor: activeCategory === 'Master Data' ? 'gold' : 'skyblue',
                }} 
                        pr={12}
                        onClick={() => handleCategoryClick('Master Data')}
                        >
                        MASTER DATA
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                    <Menu.Item onClick={() => handleMenuItemClick('User')}
                    style={{
                        backgroundColor: activeMenuItem === 'User' ? 'skyblue' : 'white',
                    }}>
                            <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                            User
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Customer')}
                    style={{
                        backgroundColor: activeMenuItem === 'Customer' ? 'skyblue' : 'white',
                    }}>
                            <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                            Customer
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Role')}
                    style={{
                        backgroundColor: activeMenuItem === 'Role' ? 'skyblue' : 'white',
                    }}>
                            <IconUsers color={theme.colors.cyan[6]} stroke={1.5} />
                            Role
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Permission')}
                    style={{
                        backgroundColor: activeMenuItem === 'Permission' ? 'skyblue' : 'white',
                    }}>
                            <IconCalendar color={theme.colors.violet[6]} stroke={1.5} />
                            Permission
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Machine Production')}
                    style={{
                        backgroundColor: activeMenuItem === 'Machine Production' ? 'skyblue' : 'white',
                    }}>
                            <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                            Machine Production
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Product')}
                    style={{
                        backgroundColor: activeMenuItem === 'Product' ? 'skyblue' : 'white',
                    }}>
                            <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                            Product
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Machine Condition')}
                    style={{
                        backgroundColor: activeMenuItem === 'Machine Condition' ? 'skyblue' : 'white',
                    }}>
                            <IconUsers color={theme.colors.cyan[6]} stroke={1.5} />
                            Machine Condition
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Down Time')}
                    style={{
                        backgroundColor: activeMenuItem === 'Down Time' ? 'skyblue' : 'white',
                    }}>
                            <IconCalendar color={theme.colors.violet[6]} stroke={1.5} />
                            Down Time
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Product Category')}
                    style={{
                        backgroundColor: activeMenuItem === 'Product Category' ? 'skyblue' : 'white',
                    }}>
                            <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                            Product Category
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Machine Category')}
                    style={{
                        backgroundColor: activeMenuItem === 'Machine Category' ? 'skyblue' : 'white',
                    }}>
                            <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                            Machine Category
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Down Time Category')}
                    style={{
                        backgroundColor: activeMenuItem === 'Down Time Category' ? 'skyblue' : 'white',
                    }}>
                            <IconUsers color={theme.colors.cyan[6]} stroke={1.5} />
                            Down Time Category
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Shift')}
                    style={{
                        backgroundColor: activeMenuItem === 'Shift' ? 'skyblue' : 'white',
                    }}>
                            <IconCalendar color={theme.colors.violet[6]} stroke={1.5} />
                            Shift
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                <Space w="xs" />
                <Menu position="top-end" width={310} withinPortal>
                    <Menu.Target>
                        <Button style={{
                    width: '320px',
                    backgroundColor: activeCategory === 'System Activity' ? 'gold' : 'skyblue',
                }} 
                        pr={12}
                        onClick={() => handleCategoryClick('System Activity')}
                        >
                        SYSTEM ACTIVITY
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item onClick={() => handleMenuItemClick('Production Planning')}
                    style={{
                        backgroundColor: activeMenuItem === 'Production Planning' ? 'skyblue' : 'white',
                    }}>
                            <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                            Production Planning
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('WhatsApp Notification')}
                    style={{
                        backgroundColor: activeMenuItem === 'WhatsApp Notification' ? 'skyblue' : 'white',
                    }}>
                            <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                            WhatsApp Notification
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Activity Rivise')}
                    style={{
                        backgroundColor: activeMenuItem === 'Activity Rivise' ? 'skyblue' : 'white',
                    }}>
                            <IconUsers color={theme.colors.cyan[6]} stroke={1.5} />
                            Activity Rivise
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                <Space w="xs" />
                <Menu position="top-end" width={310} withinPortal>
                    <Menu.Target>
                        <Button style={{
                    width: '320px',
                    backgroundColor: activeCategory === 'System Report' ? 'gold' : 'skyblue',
                }}
                        pr={12}
                        onClick={() => handleCategoryClick('System Report')}
                        >
                        SYSTEM REPORT
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item onClick={() => handleMenuItemClick('Acheivement Report')}
                    style={{
                        backgroundColor: activeMenuItem === 'Acheivement Report' ? 'skyblue' : 'white',
                    }}>
                            <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                            Acheivement Report
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('OEE Report')}
                    style={{
                        backgroundColor: activeMenuItem === 'OEE Report' ? 'skyblue' : 'white',
                    }}>
                            <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                            OEE Report
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Production Daily Report')}
                    style={{
                        backgroundColor: activeMenuItem === 'Production Daily Report' ? 'skyblue' : 'white',
                    }}>
                            <IconUsers color={theme.colors.cyan[6]} stroke={1.5} />
                            Production Daily Report
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Production Montly Report')}
                    style={{
                        backgroundColor: activeMenuItem === 'Production Montly Report' ? 'skyblue' : 'white',
                    }}>
                            <IconCalendar color={theme.colors.violet[6]} stroke={1.5} />
                            Production Montly Report
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Planning Daily Report')}
                    style={{
                        backgroundColor: activeMenuItem === 'Planning Daily Report' ? 'skyblue' : 'white',
                    }}>
                            <IconPackage color={theme.colors.blue[6]} stroke={1.5} />
                            Planning Daily Report
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Planning Montly Report')}
                    style={{
                        backgroundColor: activeMenuItem === 'Planning Montly Report' ? 'skyblue' : 'white',
                    }}>
                            <IconSquareCheck color={theme.colors.pink[6]} stroke={1.5} />
                            Planning Montly Report
                        </Menu.Item>
                        <Menu.Item onClick={() => handleMenuItemClick('Pareto Report')}
                    style={{
                        backgroundColor: activeMenuItem === 'Pareto Report' ? 'skyblue' : 'white',
                    }}>
                            <IconUsers color={theme.colors.cyan[6]} stroke={1.5} />
                            Pareto Report
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
                            <Button variant="filled" color={updownButtonColor} radius="xl" style={{ marginRight: '10px' }} onClick={handleMenuClick}>
                                Menu
                            </Button>
                            <Button variant="filled" radius="xl" color={isFullActive ? 'teal' : 'gray'} onClick={handleFullClick}>
                                Full
                            </Button>
                        </div>
                    </div>
                    <div>
                        <h2 style={{ marginRight: '40px' }}>DATE: 2023-09-12</h2>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                    <div>
                        <div style={{ backgroundColor: 'gainsboro', marginLeft: '10px', height: '75px', width: '1190px' }}>
                            <div>
                                <div style={{ display: 'flex', marginTop: '10px', fontWeight: 'bold' }}>
                                    <div style={{ display: 'flex', marginTop: '-7px' }}>
                                        <p style={{ width: '40px', marginLeft: '5px' }}>07:00</p>
                                        <p style={{ marginLeft: '72px', width: '40px' }}>08:00</p>
                                        <p style={{ marginLeft: '72px', width: '40px' }}>09:00</p>
                                        <p style={{ marginLeft: '72px', width: '40px' }}>72:00</p>
                                        <p style={{ marginLeft: '72px', width: '40px' }}>11:00</p>
                                        <p style={{ marginLeft: '72px', width: '40px' }}>12:00</p>
                                        <p style={{ marginLeft: '72px', width: '40px' }}>13:00</p>
                                        <p style={{ marginLeft: '72px', width: '40px' }}>14:00</p>
                                        <p style={{ marginLeft: '72px', width: '40px' }}>15:00</p>
                                        <p style={{ marginLeft: '72px', width: '40px' }}>16:00</p>
                                        <p style={{ marginLeft: '55px' }}>Total Shift</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: '-16px', textAlign: 'center' }}>
                                    <p style={{ width: '30px', marginLeft: '10px' }}>{60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("07:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("07:59:59", "HH:mm:ss")) && noPlanToday.total)}</p>
                                    <p style={{ marginLeft: '80px', width: '30px' }}>{60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("08:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("08:59:59", "HH:mm:ss")) && noPlanToday.total)}</p>
                                    <p style={{  marginLeft: '83px', width: '30px' }}>{60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("09:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("09:59:59", "HH:mm:ss")) && noPlanToday.total)}</p>
                                    <p style={{  marginLeft: '83px', width: '30px' }}>{60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("10:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("10:59:59", "HH:mm:ss")) && noPlanToday.total)}</p>
                                    <p style={{  marginLeft: '80px', width: '30px' }}>{60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("11:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("11:59:59", "HH:mm:ss")) && noPlanToday.total)}</p>
                                    <p style={{  marginLeft: '83px', width: '30px' }}>{60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("12:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("12:59:59", "HH:mm:ss")) && noPlanToday.total)}</p>
                                    <p style={{  marginLeft: '83px', width: '30px' }}>{60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("13:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("13:59:59", "HH:mm:ss")) && noPlanToday.total)}</p>
                                    <p style={{  marginLeft: '82px', width: '30px' }}>{60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("14:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("14:59:59", "HH:mm:ss")) && noPlanToday.total)}</p>
                                    <p style={{  marginLeft: '82px', width: '30px' }}>{60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("15:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("15:59:59", "HH:mm:ss")) && noPlanToday.total)}</p>
                                    <p style={{  marginLeft: '83px', width: '30px' }}>{60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("16:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("16:59:59", "HH:mm:ss")) && noPlanToday.total)}</p>
                                    <p style={{  marginLeft: '85px', width: '30px' }}>{(60 * 10) - noPlanToday?.total}</p>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{ backgroundColor: 'lightcyan', marginTop: '-15px', marginLeft: '10px', marginTop: '10px', height: '140px', textAlign: 'center' }}>
                            <div>
                                <div
                                    style={{ display: 'flex', marginTop: '10px', fontSize: '25px', fontWeight: 'bold', color: 'cornflowerblue' }}>
                                    <div style={{ display: 'flex', marginTop: '-20px' }}>
                                        <p style={{ width: '30px', marginLeft: '10px' }}>{Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("07:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("07:59:59", "HH:mm:ss")) && noPlanToday.total))}</p>
                                        <p style={{ marginLeft: '80px', width: '30px' }}>{Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("08:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("08:59:59", "HH:mm:ss")) && noPlanToday.total))}</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("09:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("09:59:59", "HH:mm:ss")) && noPlanToday.total))}</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("10:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("10:59:59", "HH:mm:ss")) && noPlanToday.total))}</p>
                                        <p style={{  marginLeft: '80px', width: '30px' }}>{Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("11:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("11:59:59", "HH:mm:ss")) && noPlanToday.total))}</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("12:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("12:59:59", "HH:mm:ss")) && noPlanToday.total))}</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("13:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("13:59:59", "HH:mm:ss")) && noPlanToday.total))}</p>
                                        <p style={{  marginLeft: '82px', width: '30px' }}>{Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("14:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("14:59:59", "HH:mm:ss")) && noPlanToday.total))}</p>
                                        <p style={{  marginLeft: '82px', width: '30px' }}>{Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("15:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("15:59:59", "HH:mm:ss")) && noPlanToday.total))}</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("16:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("16:59:59", "HH:mm:ss")) && noPlanToday.total))}</p>
                                        <p style={{  marginLeft: '82px', width: '30px' }}>{activePlan?.qty_per_minute && (Math.round((activePlan?.qty_per_minute * 60)) * 10) - noPlanToday.total}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', fontSize: '35px', fontWeight: 'bold', color: 'gold' }}>
                                    <div style={{ display: 'flex', marginTop: '-40px' }}>
                                        <p style={{ width: '30px', marginLeft: '10px' }}>{data.find(item => item.time == "07:59:59")?.qty_actual}</p>
                                        <p style={{ marginLeft: '80px', width: '30px' }}>{data.find(item => item.time == "08:59:59")?.qty_actual}</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{data.find(item => item.time == "09:59:59")?.qty_actual}</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{data.find(item => item.time == "10:59:59")?.qty_actual}</p>
                                        <p style={{  marginLeft: '80px', width: '30px' }}>{data.find(item => item.time == "11:59:59")?.qty_actual}</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{data.find(item => item.time == "12:59:59")?.qty_actual}</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{data.find(item => item.time == "13:59:59")?.qty_actual}</p>
                                        <p style={{  marginLeft: '82px', width: '30px' }}>{data.find(item => item.time == "14:59:59")?.qty_actual}</p>
                                        <p style={{  marginLeft: '82px', width: '30px' }}>{data.find(item => item.time == "15:59:59")?.qty_actual}</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{data.find(item => item.time == "16:59:59")?.qty_actual}</p>
                                        <p style={{  marginLeft: '75px', width: '30px' }}>{totalQtyActual()}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', fontSize: '22px', fontWeight: 'bold', color: 'firebrick' }}>
                                    <div style={{ display: 'flex', marginTop: '-40px' }}>
                                        <p style={{ width: '30px', marginLeft: '10px' }}>{Math.round(data.find(item => item.time == "07:59:59")?.qty_actual == null ? 0 : data.find(item => item.time == "07:59:59")?.qty_actual / Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("07:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("07:59:59", "HH:mm:ss")) && noPlanToday?.total)) * 100)}%</p>
                                        <p style={{ marginLeft: '80px', width: '30px' }}>{Math.round(data.find(item => item.time == "08:59:59")?.qty_actual == null ? 0 : data.find(item => item.time == "08:59:59")?.qty_actual / Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("08:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("08:59:59", "HH:mm:ss")) && noPlanToday?.total)) * 100)}%</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{Math.round(data.find(item => item.time == "09:59:59")?.qty_actual == null ? 0 : data.find(item => item.time == "09:59:59")?.qty_actual / Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("09:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("09:59:59", "HH:mm:ss")) && noPlanToday?.total)) * 100)}%</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{Math.round(data.find(item => item.time == "10:59:59")?.qty_actual == null ? 0 : data.find(item => item.time == "10:59:59")?.qty_actual / Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("10:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("10:59:59", "HH:mm:ss")) && noPlanToday?.total)) * 100)}%</p>
                                        <p style={{  marginLeft: '80px', width: '30px' }}>{Math.round(data.find(item => item.time == "11:59:59")?.qty_actual == null ? 0 : data.find(item => item.time == "11:59:59")?.qty_actual / Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("11:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("11:59:59", "HH:mm:ss")) && noPlanToday?.total)) * 100)}%</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{Math.round(data.find(item => item.time == "12:59:59")?.qty_actual == null ? 0 : data.find(item => item.time == "12:59:59")?.qty_actual / Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("12:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("12:59:59", "HH:mm:ss")) && noPlanToday?.total)) * 100)}%</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{Math.round(data.find(item => item.time == "13:59:59")?.qty_actual == null ? 0 : data.find(item => item.time == "13:59:59")?.qty_actual / Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("13:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("13:59:59", "HH:mm:ss")) && noPlanToday?.total)) * 100)}%</p>
                                        <p style={{  marginLeft: '82px', width: '30px' }}>{Math.round(data.find(item => item.time == "14:59:59")?.qty_actual == null ? 0 : data.find(item => item.time == "14:59:59")?.qty_actual / Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("14:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("14:59:59", "HH:mm:ss")) && noPlanToday?.total)) * 100)}%</p>
                                        <p style={{  marginLeft: '82px', width: '30px' }}>{Math.round(data.find(item => item.time == "15:59:59")?.qty_actual == null ? 0 : data.find(item => item.time == "15:59:59")?.qty_actual / Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("15:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("15:59:59", "HH:mm:ss")) && noPlanToday?.total)) * 100)}%</p>
                                        <p style={{  marginLeft: '83px', width: '30px' }}>{Math.round(data.find(item => item.time == "16:59:59")?.qty_actual == null ? 0 : data.find(item => item.time == "16:59:59")?.qty_actual / Math.round(activePlan.qty_per_minute * 60 - (moment(noPlanToday.time_in, "HH:mm:ss").isSameOrAfter(moment("16:00:00", "HH:mm:ss")) && moment(noPlanToday.time_in, "HH:mm:ss").isSameOrBefore(moment("16:59:59", "HH:mm:ss")) && noPlanToday?.total)) * 100)}%</p>
                                        <p style={{  marginLeft: '85px', width: '30px' }}>99%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '100px', border: '10px solid skyblue', textAlign: 'center', height: '304px' }}>
                    <div style={{ marginTop: '-16px' }}>
                        <p style={{ backgroundColor: 'gainsboro', padding: '10px' }}>Operator</p>
                        <p style={{ padding: '10px', marginTop: '-16px' }}>Adam</p>
                    </div>
                    <div>
                        <p style={{ backgroundColor: 'gainsboro', padding: '10px', marginTop: '-16px' }}>Shift</p>
                        <p style={{ padding: '10px', marginTop: '-16px' }}>1</p>
                    </div>
                    <div>
                        <p style={{ backgroundColor: 'gainsboro', padding: '10px', marginTop: '-16px' }}>Nama Part</p>
                        <p style={{ padding: '10px', marginTop: '-16px' }}>COLLAR</p>
                    </div>
                    <div>
                        <p style={{ backgroundColor: 'gainsboro', padding: '10px', marginTop: '-16px' }}>Cycle Time</p>
                        <p style={{ padding: '10px', marginTop: '-16px' }}>10 second</p>
                    </div>
                </div>
                <div style={{ width: '650px', border: '10px solid skyblue', textAlign: 'center', height: '304px', marginLeft: '25px'}}>
                    <Table highlightOnHover withColumnBorders>
                        <thead style={{ backgroundColor: 'gainsboro', textAlign: 'center' }}>
                            <tr>
                                <th style={{ textAlign: 'center' }}>Down Time</th>
                                <th style={{ textAlign: 'center' }}>Durasi</th>
                                <th style={{ textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>MACHINE</td>
                                <td>0</td>
                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20px'}}>
                                    <ActionIcon>
                                    <IconCircleDot style={{ color: 'white', backgroundColor: 'green', borderRadius: '100%'}} />
                                    </ActionIcon>
                                </td>
                            </tr>
                            <tr>
                                <td>MATERIAL</td>
                                <td>20</td>
                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20px'}}>
                                    <ActionIcon>
                                    <IconCircleDot style={{ color: 'white', backgroundColor: 'firebrick', borderRadius: '100%'}} />
                                    </ActionIcon>
                                </td>
                            </tr>
                            <tr>
                                <td>MAN POWER</td>
                                <td>10</td>
                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20px'}}>
                                    <ActionIcon>
                                    <IconCircleDot style={{ color: 'white', backgroundColor: 'gold', borderRadius: '100%'}} />
                                    </ActionIcon>
                                </td>
                            </tr>
                            <tr>
                                <td>JIG PROCESS WELDING</td>
                                <td>5</td>
                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20px'}}>
                                    <ActionIcon>
                                    <IconCircleDot style={{ color: 'white', backgroundColor: 'firebrick', borderRadius: '100%'}} />
                                    </ActionIcon>
                                </td>
                            </tr>
                            <tr>
                                <td>PACKING STANDAR</td>
                                <td>7</td>
                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20px'}}>
                                    <ActionIcon>
                                    <IconCircleDot style={{ color: 'white', backgroundColor: 'green', borderRadius: '100%'}} />
                                    </ActionIcon>
                                </td>
                            </tr>
                            <tr>
                                <td>GAS & WIRE WELDING</td>
                                <td>0</td>
                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20px'}}>
                                    <ActionIcon>
                                    <IconCircleDot style={{ color: 'white', backgroundColor: 'green', borderRadius: '100%'}} />
                                    </ActionIcon>
                                </td>
                            </tr>
                            <tr>
                                <td>OTHERS</td>
                                <td>5</td>
                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20px'}}>
                                    <ActionIcon>
                                    <IconCircleDot style={{ color: 'white', backgroundColor: 'gold', borderRadius: '100%'}} />
                                    </ActionIcon>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div
                    style={{ width: '480px', border: '10px solid skyblue', textAlign: 'center', height: '304px', marginLeft: '25px' }}>
                    <div style={{ marginTop: '-16px' }}>
                        <p style={{ backgroundColor: 'gainsboro', padding: '10px' }}>Kondisi Mesin</p>
                    </div>
                    <div
                        style={{ backgroundColor: 'lavender', height: '266px', marginTop: '-16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div
                            style={{ backgroundColor: 'lavender', borderRadius: '10px', height: '50px', width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '2px solid grey'}}>
                            <p style={{ textAlign: 'center', marginLeft: '20px' }}>Kondisi mesin 1</p>
                            <div style={{ backgroundColor: 'lime', width: '120px', height: '35px', borderRadius: '10px', marginRight: '20px'  }}></div>
                        </div>
                        <div
                            style={{ backgroundColor: 'lavender', borderRadius: '10px', height: '50px', width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', border: '2px solid grey'}}>
                            <p style={{ textAlign: 'center', marginLeft: '20px' }}>Kondisi mesin 2</p>
                            <div style={{ backgroundColor: 'gold', width: '120px', height: '35px', borderRadius: '10px', marginRight: '20px'  }}></div>
                        </div>
                        <div
                            style={{ backgroundColor: 'lavender', borderRadius: '10px', height: '50px', width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', border: '2px solid grey'}}>
                            <p style={{ textAlign: 'center', marginLeft: '20px' }}>Kondisi mesin 3</p>
                            <div style={{ backgroundColor: 'lime', width: '120px', height: '35px', borderRadius: '10px', marginRight: '20px'  }}></div>
                        </div>
                        <div
                            style={{ backgroundColor: 'lavender', borderRadius: '10px', height: '50px', width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', border: '2px solid grey'}}>
                            <p style={{ textAlign: 'center', marginLeft: '20px' }}>Kondisi mesin 2</p>
                            <div style={{ backgroundColor: 'firebrick', width: '120px', height: '35px', borderRadius: '10px', marginRight: '20px'  }}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                style={{ backgroundColor: 'lavender', height: '50px', borderRadius: '10px', marginTop: '10px', border: '2px solid skyblue', display: 'flex', alignItems: 'center', justifyContent: 'center'  }}>
                <Menu position="top-end" width={310} withinPortal>
                <Menu.Target>
                    <div>
                        {content}
                    </div>
                </Menu.Target>
                    
                    
                </Menu>
            </div>
        </div>
    );
    }

