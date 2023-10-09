import { ActionIcon, Table } from "@mantine/core"
import { IconCircleDot } from "@tabler/icons"
import { useEffect, useState } from "react"
import axiosLosstime from "@/libs/losstime/axios"
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import client from '@/libs/mqtt'

const DownTime = () => {
    const [mqttDataLS1, setMqttDataLS1] = useState([])
    const [lineStopDatas, setLineStopDatas] = useState([])
    useEffect(() => {
        client
        .subscribe("MC1:DT:RPA", {qos: 2})
        .on("message", (topic, message) => {
            if (topic == "MC1:DT:RPA") {
                setMqttDataLS1(JSON.parse(message))
            }
        })
        return () => {
            client.unsubscribe('MC1:DT:RPA', { qos: 2 })
        }
    }, [])

    useEffect(() => {
        const fetchLineStop = async () => {
            const res = await axiosLosstime.get('line-stop', getHeaderConfigAxios()).then(item => item.data)
            setLineStopDatas(res.data)
        }
        fetchLineStop()
    },[])

    console.log(lineStopDatas, 'ls');
    console.log(mqttDataLS1, 'mqtt ls');
    return (
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
                    {lineStopDatas.map((row, index) => (
                        <tr key={index}>
                            <td>{row.name}</td>
                            <td>{mqttDataLS1[`causeLS${row.typeId}`] == null ? '-' : mqttDataLS1[`causeLS${row.typeId}`]}</td>
                            <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20px'}}>
                                <ActionIcon>
                                    <IconCircleDot style={{ color: 'white', backgroundColor: `${mqttDataLS1['isActive'] == row.typeId ? 'red' : mqttDataLS1[`causeLS${row.typeId}`] == 0 ? 'green' : 'yellow'}`, borderRadius: '100%'}} />
                                </ActionIcon>
                            </td>
                        </tr>
                    ))}
                    {/* <tr>
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
                    </tr> */}
                </tbody>
            </Table>
        </div>
    )
}

export default DownTime