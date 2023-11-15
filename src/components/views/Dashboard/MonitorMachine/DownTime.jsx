import { ActionIcon, ScrollArea, Table } from "@mantine/core"
import { IconCircleDot } from "@tabler/icons"
import { useEffect, useState } from "react"
import axiosLosstime from "@/libs/losstime/axios"
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import client from '@/libs/mqtt'

const DownTime = ({machineId}) => {
    const [mqttDataLS1, setMqttDataLS1] = useState([])
    const [lineStopDatas, setLineStopDatas] = useState([])
    useEffect(() => {
        if (machineId) {
            client
            .subscribe(`MC${machineId}:LS:RPA`, {qos: 2})
            .on("message", (topic, message) => {
                if (topic == `MC${machineId}:LS:RPA`) {
                    setMqttDataLS1(JSON.parse(message))
                }
            })
            return () => {
                client.unsubscribe(`MC${machineId}:LS:RPA`, { qos: 2 })
            }
        }
    }, [machineId])

    useEffect(() => {
        const fetchLineStop = async () => {
            try {
                const res = await axiosLosstime.get('line-stop', getHeaderConfigAxios()).then(item => item.data)
                setLineStopDatas(res.data)
            } catch (error) {
                console.log(error, 'error fetch ls');
            }
        }
        fetchLineStop()
    },[])
    return (
        <ScrollArea style={{ width: '55%', border: '10px solid skyblue', textAlign: 'center', maxHeight: '304px', height: '304px', marginLeft: '25px'}}>
            <Table highlightOnHover withColumnBorders>
                <thead style={{ backgroundColor: 'gainsboro', textAlign: 'center' }}>
                    <tr>
                        <th style={{ textAlign: 'center', fontSize: '1.1vw' }}>Down Time</th>
                        <th style={{ textAlign: 'center', fontSize: '1.1vw' }}>Durasi</th>
                        <th style={{ textAlign: 'center', fontSize: '1.1vw' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    { machineId ? (lineStopDatas.map((row, index) => (
                        <tr key={index} style={ index == lineStopDatas?.length -1 ? { borderBottom: '1px #d4d6d9 solid' } : {}}>
                            <td style={{ textAlign: 'left', fontSize: '1vw', paddingInline: '50px' }}>{row.name}</td>
                            <td style={{ fontSize: '0.99vw' }}>{mqttDataLS1[`CauseLS${row.typeId}`] == null ? '-' : mqttDataLS1[`CauseLS${row.typeId}`]}</td>
                            <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20px', fontSize: '1.1rem'}}>
                                <ActionIcon>
                                    <IconCircleDot style={{ color: 'white', backgroundColor: `${mqttDataLS1['IsActive'] == row.typeId ? 'red' : mqttDataLS1[`CauseLS${row.typeId}`] == 0 ? 'green' : '#dce305'}`, borderRadius: '100%'}} />
                                </ActionIcon>
                            </td>
                        </tr>
                    ))) : (
                        ''
                    )}
                </tbody>
            </Table>
        </ScrollArea>
    )
}

export default DownTime