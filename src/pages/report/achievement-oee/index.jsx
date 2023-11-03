import OverallEquipmentEffectiveness from "@/components/views/Report/OEE/OverallEquipmentEffectiveness";
import { Center, Flex, Table, Text, Title } from '@mantine/core'
import * as moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import axiosPlanning from '@/libs/planning/axios'
import axiosLosstime from '@/libs/losstime/axios'
import { getHeaderConfigAxios } from '@/utils/getHeaderConfigAxios'
export default function AchievementOeeReportPageIndex() {
    const [dateNow, setDateNow] = useState(moment().format('MMMM - YYYY'))
    const [oeeReady, setOeeReady] = useState(false)
    const [reportProductions, setReportProductions] = useState([])
    const [downTimes, setDownTimes] = useState([])
    const tableRef = useRef()
    const oeeRef = useRef()
    useEffect(() => {
        if (oeeReady) {
            setTimeout(() => {
                handleExport()
            }, 1000)
        }
    }, [oeeReady])

    useEffect(() => {
        try {
            const fetchReportPlan = async () => {
                const res = await axiosPlanning.get('planning-production-report/get-data-report', getHeaderConfigAxios())
                setReportProductions(res.data.data)
            }
            const fetchDownTime = async () => {
                const res2 = await axiosLosstime.get('line-stop', getHeaderConfigAxios())
                setDownTimes(res2.data.data)
            }
            fetchReportPlan()
            fetchDownTime()
        } catch (error) {
            console.log(error, 'failed to fetch report plan');
        }
    }, [])
    console.log(downTimes,'dt');

    const handleExport = () => {
        // window.print()
    }
    return (
        <table border={1} ref={tableRef}>
            <tbody>
                <tr>
                    <th rowSpan={3} style={{ width: '20%' }}>
                        {/* <img src={Logo2.src} style={{ width: '90%' }} /> */}
                        <Text>PT RACHMAT PERDANA ADHIMETAL</Text>
                    </th>
                    <th rowSpan={3} >
                        <Center>
                            <Title order={2}>DAILY PRODUCTION ACHIEVEMENT</Title>
                        </Center>
                        <Center>
                            <Title order={4}>{dateNow}</Title>
                        </Center>
                    </th>
                </tr>
                <tr></tr>
                <tr></tr>
                <tr>
                    <td colSpan={'100%'}>
                        <Flex align='middle' justify='space-around'>
                            {/* Periode / bulan */}
                            <div style={{ margin: '4px' }}>
                                <Table>
                                    <tbody>
                                        <tr style={{ fontSize: '0.8rem', border: '1px solid black' }}>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>PERIODE / BULAN</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}></td>
                                        </tr>
                                        <tr style={{ fontSize: '0.8rem', border: '1px solid black' }}>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>PART NOMOR</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}></td>
                                        </tr>
                                        <tr style={{ fontSize: '0.8rem', border: '1px solid black' }}>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>PART NAME</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>STAY ECHU K97</td>
                                        </tr>
                                        <tr style={{ fontSize: '0.8rem', border: '1px solid black' }}>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>GROUP / LEADER</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>RED (RUDY)</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>

                            {/* Cycle Time */}
                            <div style={{ margin: '4px' }}>
                                <Table>
                                    <tbody>
                                        <tr style={{ fontSize: '0.8rem', border: '1px solid black', textAlign: 'center', background: 'yellow' }}>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>Cycle Time</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>41.0</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>Detik</td>
                                        </tr>
                                        <tr style={{ fontSize: '0.8rem', border: '1px solid black', textAlign: 'center' }}>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>CAPACITY PER JAM</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>88</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>Pcs</td>
                                        </tr>
                                        <tr style={{ fontSize: '0.8rem', border: '1px solid black', textAlign: 'center' }}>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>AVALABLE TIME</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>480.0</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>Menit</td>
                                        </tr>
                                        <tr style={{ fontSize: '0.8rem', border: '1px solid black', textAlign: 'center' }}>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>TARGET EFFICIENCY</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }} colSpan='2'>89.6%</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>

                            {/* Effective Working time */}
                            <div style={{ margin: '4px' }}>
                                <Table>
                                    <tbody>
                                        <tr style={{ fontSize: '0.8rem', border: '1px solid black' }}>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>EFFECTIVE WORKING TIME</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>430</td>
                                        </tr>
                                        <tr style={{ fontSize: '0.8rem', border: '1px solid black' }}>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>CAPACITY SHIFT 1 (8H)</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>62</td>
                                        </tr>
                                        <tr style={{ fontSize: '0.8rem', border: '1px solid black' }}>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>CAPACITY SHIFT 2 (8H)</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>62</td>
                                        </tr>
                                        <tr style={{ fontSize: '0.8rem', border: '1px solid black' }}>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>TOTAL CAPACITY 2 SHIFT</td>
                                            <td style={{ border: '1px solid black', minWidth: '100px', padding: '0 10px' }}>1,2</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Flex>
                        <div style={{  borderTop: '1px solid black' }}>
                            <legend>
                                <Title order={4}>
                                    OEE Line UB Robot 5
                                </Title>
                            </legend>
                            <OverallEquipmentEffectiveness isExport={true} isReadyCallback={(val, ref) => {
                                setOeeReady(val)
                                oeeRef.current = ref.current
                            }} />

                        </div>
                    </td>
                </tr>
                <tr>
                    <td colSpan={'100%'}>
                        <Flex direction='column' style={{ marginTop: '10px' }}>
                            
                            <div style={{ marginTop: '5px' }}>
                                <table width="100%" border='1' cellSpacing='0'>
                                    <tbody>
                                        <tr>
                                            <th rowSpan='2'>NO</th>
                                            <th rowSpan='2'>DESCRIPTION</th>
                                            <th rowSpan='2'>SYMBOL</th>
                                            <th colSpan={'100%'} rowSpan='1'>TANGGAL</th>
                                        </tr>

                                        <tr>
                                        {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{moment(value.date).format('D')}</td>
                                            ))}
                                        </tr>

                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '3%', textAlign: 'center' }}>1</td>
                                            <td style={{ fontSize: '0.8rem', width: '35%' }}>PLANNING PRODUKSI - Sesuai dengan SPK</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%' }}>Pcs</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.qtyActual}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '3%', textAlign: 'center' }}>2</td>
                                            <td style={{ fontSize: '0.8rem', width: '35%' }}>WAKTU TERSEDIA / AVALABLE TIME - Jam Kerja Normal (N)</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%' }}>Menit</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.normalWorkingTime}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '3%', textAlign: 'center' }}>3</td>
                                            <td style={{ fontSize: '0.8rem', width: '35%' }}>WAKTU TAMBAHAN / OVER TIME - Jam Kerja Tambahan (OT)</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%' }}>Menit</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.overTime}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '35%', textAlign: 'end', paddingRight: '10px' }} colSpan='2'>TOTAL WAKTU YANG TERSEDIA (N+OT)</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%', textAlign: 'center' }}>(A)</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.normalWorkingTime + value.overTime}</td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ marginTop: '5px' }}>
                                <table width="100%" border='1' cellSpacing='0'>
                                    <tbody>
                                        <tr>
                                            <td rowSpan='2' style={{ fontSize: '0.8rem', textAlign: 'center' }}>4</td>
                                            <td rowSpan='2' style={{ fontSize: '0.8rem' }} colSpan='2'><bold>STOP TIME PLAN (STP) Waktu hilang yang diizinkan:</bold></td>
                                            <td colSpan={'100%'} rowSpan='1' style={{ textAlign: 'center' }}>TANGGAL</td>
                                        </tr>

                                        <tr>
                                        {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{moment(value.date).format('D')}</td>
                                            ))}
                                        </tr>

                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '3%', textAlign: 'center' }}></td>
                                            <td style={{ fontSize: '0.8rem', width: '35%' }}>1. TOTAL STOP TIME PLAN Jam Kerja Normal (N)</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%' }}>Menit</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.noPlanNormal}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '3%', textAlign: 'center' }}></td>
                                            <td style={{ fontSize: '0.8rem', width: '35%' }}>2. TOTAL STOP TIME PLAN Jam Over Time (OT)</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%' }}>Menit</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.noPlanOT}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '3%', textAlign: 'center' }}></td>
                                            <td style={{ fontSize: '0.8rem', width: '35%' }}>3. NO PLANNING = Tidak ada tarikan Customer, Stock part Cukup</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%' }}>Menit</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.noPlanOT ? 0 : null}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '35%', textAlign: 'end', paddingRight: '10px' }} colSpan='2'>TOTAL STOP TIME PLAN (STP)</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%', textAlign: 'center' }}>(A)</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.noPlanNormal + value.noPlanOT}</td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* <div style={{ marginTop: '5px' }}>
                                <table width="100%" border='1' cellSpacing='0'>
                                    <tbody>
                                        <tr>
                                            <td rowSpan='2' style={{ fontSize: '0.8rem', textAlign: 'center' }}>5</td>
                                            <td rowSpan='2' style={{ fontSize: '0.8rem' }} colSpan='3'><bold>DOWN TIME (Waktu Hilang yang tidak diizinkan)</bold></td>
                                            <td colSpan={'100%'} rowSpan='1' style={{ textAlign: 'center' }}>TANGGAL</td>
                                        </tr>

                                        <tr>
                                        {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{moment(value.date).format('D')}</td>
                                            ))}
                                        </tr>

                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '3%', textAlign: 'center' }}></td>
                                            <td style={{ fontSize: '0.8rem', width: '10%' }}>MACHINE</td>
                                            <td style={{ fontSize: '0.8rem', width: '25%' }}>Mesin Mati, Angin Bocor, Over Load, Kabel Putus, Kompressor Mati, dll.</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%' }}>Menit</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.downTime?.find(item => item.lineStopName == 'MACHINE')?.timeTotal}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '3%', textAlign: 'center' }}></td>
                                            <td style={{ fontSize: '0.8rem', width: '10%' }}>MATERIAL</td>
                                            <td style={{ fontSize: '0.8rem', width: '25%' }}>Material / komponen telat, habis, jumlahnya kurang dll.</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%' }}>Menit</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.downTime?.find(item => item.lineStopName == 'MATERIAL')?.timeTotal}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '3%', textAlign: 'center' }}></td>
                                            <td style={{ fontSize: '0.8rem', width: '10%' }}>MAN POWER</td>
                                            <td style={{ fontSize: '0.8rem', width: '25%' }}>Operator tidak hadir, dipindah proesem blm ada / jumlahnya kurang.</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%' }}>Menit</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.downTime?.find(item => item.lineStopName == 'MAN POWER')?.timeTotal}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '3%', textAlign: 'center' }}></td>
                                            <td style={{ fontSize: '0.8rem', width: '10%' }}>JIG PROCESS WELD</td>
                                            <td style={{ fontSize: '0.8rem', width: '25%' }}>Jig Welding rusak, Aus, Clamper Kendor, Pin Patah, lokator aus, dll.</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%' }}>Menit</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.downTime?.find(item => item.lineStopName == 'JIG PROCESS WELD')?.timeTotal}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '3%', textAlign: 'center' }}></td>
                                            <td style={{ fontSize: '0.8rem', width: '10%' }}>PACKING STANDARD</td>
                                            <td style={{ fontSize: '0.8rem', width: '25%' }}>Pollybox / pallet kosong, telat, jumlahnya kurang, dll.</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%' }}>Menit</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.downTime?.find(item => item.lineStopName == 'PACKING STANDARD')?.timeTotal}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: '0.8rem', width: '3%', textAlign: 'center' }}></td>
                                            <td style={{ fontSize: '0.8rem', width: '10%' }}>GAS & WIRE WELDING</td>
                                            <td style={{ fontSize: '0.8rem', width: '25%' }}>GAS atau Wire Welding habis, telat datang, kurang, dll.</td>
                                            <td style={{ fontSize: '0.8rem', width: '5%' }}>Menit</td>
                                            {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.downTime?.find(item => item.lineStopName == 'GAS & WIRE WELDING')?.timeTotal}</td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div> */}

                            <div style={{ marginTop: '5px' }}>
                                <table width="100%" border='1' cellSpacing='0'>
                                    <tbody>
                                        <tr>
                                            <td rowSpan='2' style={{ fontSize: '0.8rem', textAlign: 'center' }}>5</td>
                                            <td rowSpan='2' style={{ fontSize: '0.8rem' }} colSpan='3'><bold>DOWN TIME (Waktu Hilang yang tidak diizinkan)</bold></td>
                                            <td colSpan={'100%'} rowSpan='1' style={{ textAlign: 'center' }}>TANGGAL</td>
                                        </tr>

                                        <tr>
                                        {reportProductions.map((value, index) => (
                                                <td key={index} style={{ width: '2%', textAlign: 'center' }}>{moment(value.date).format('D')}</td>
                                            ))}
                                        </tr>

                                        {downTimes.map((dt, key) => (
                                            <tr key={key}>
                                                <td style={{ fontSize: '0.8rem', width: '3%', textAlign: 'center' }}></td>
                                                <td style={{ fontSize: '0.8rem', width: '10%' }}>{dt.name}</td>
                                                <td style={{ fontSize: '0.8rem', width: '25%' }}>{dt?.categoryLineStop?.name}</td>
                                                <td style={{ fontSize: '0.8rem', width: '5%' }}>Menit</td>
                                                {reportProductions.map((value, index) => (
                                                    <td key={index} style={{ width: '2%', textAlign: 'center' }}>{value.downTime?.find(item => item.lineStopName == dt.name)?.timeTotal}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Flex>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}