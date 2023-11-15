import axiosPlanning from "@/libs/planning/axios"
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import client from '@/libs/mqtt'
import { useEffect, useState } from "react"
import { yellow } from "@material-ui/core/colors"
import { Button, Modal, ScrollArea, Table } from "@mantine/core"
import moment from "moment"
import { showNotification } from "@mantine/notifications"
import { IconCheck, IconFaceIdError } from "@tabler/icons"

const MachineCondition = ({activePlan, machineId}) => {
    const [conditionMachineProductionDatas, setConditionMachineProductionDatas] = useState([])
    const [mqttConditionMachine, setMqttConditionMachine] = useState(null)
    const [openModal, setOpenModal] = useState({
        isOpen: false,
        data: null
    })

    useEffect(() => {
        client
        .subscribe(`MC${machineId}:CD:RPA`, {qos: 2})
        .on("message", (topic, message) => {
            if (topic == `MC${machineId}:CD:RPA`) {
                setMqttConditionMachine(JSON.parse(message));
            }
        })
    },[machineId])


    useEffect(() => {
        if (mqttConditionMachine) {
            conditionMachineProductionDatas.map(async(item) => {
                if (item.id == mqttConditionMachine['ConditionMachineID']) {
                    try {
                        await axiosPlanning.patch(`condition-machine-production/${item.id}`, {status: mqttConditionMachine["Status"]},getHeaderConfigAxios())
                        fetchConditionMachine()        
                        if (item.status != mqttConditionMachine["Status"]) {
                            showNotification({
                                title: "Successful Update",
                                message: "Update Status Success",
                                icon: <IconCheck />,
                                color: "teal",
                            });        
                        }
                    } catch (error) {
                        showNotification({
                            title: "Failed to Update",
                            message: error?.response?.data?.message ?? "Connection Error",
                            icon: <IconFaceIdError />,
                            color: "red",
                        });
                    }
                }
            })
        }
    }, [mqttConditionMachine])
    const fetchConditionMachine = async () => {
        try {
            const res = await axiosPlanning.get(`condition-machine-production/${machineId}`, getHeaderConfigAxios()).then(item => item.data)
            const resSort = res?.data?.sort((a,b) => a.id - b.id)
            setConditionMachineProductionDatas(resSort)
        } catch (error) {
            console.log(error, 'error fetch condition machine');
        }
    }
    useEffect(() => {
        if (activePlan) {
            fetchConditionMachine()
        }
    },[activePlan])

    const handleModalOpen = (data) => {
        setOpenModal({isOpen: true, data: data})
    }

    const handleUpdateStatus = async (status) => {
        try {
            await axiosPlanning.patch(`condition-machine-production/${openModal?.data?.id}`, {status: status},getHeaderConfigAxios())
            fetchConditionMachine()
            setOpenModal({isOpen: false, data: null})

            showNotification({
                title: "Successful Update",
                message: "Update Status Success",
                icon: <IconCheck />,
                color: "teal",
            });        
        } catch (error) {
            showNotification({
                title: "Error Attempting Authorization",
                message: error?.response?.data?.message ?? "Connection Error",
                icon: <IconFaceIdError />,
                color: "red",
            });
        }
    }

    return (
        <div
        style={{ width: '37%', border: '10px solid skyblue', textAlign: 'center', height: '304px', marginLeft: '25px' }}>
        <Modal size={"40%"} opened={openModal.isOpen} withCloseButton={false} onClose={() => setOpenModal({isOpen: false})} centered>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Condition</th>
                            <th>Update Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td width={"50%"}>{openModal?.data?.conditionMachine?.name}</td>
                            <td style={{ display: 'flex', gap: '10px' }}>
                                <Button disabled={moment().diff(moment(activePlan?.created_at), 'minutes') < 15 ? false : true} onClick={() => handleUpdateStatus(0)} style={{ opacity: `${moment().diff(moment(activePlan?.created_at), 'minutes') < 15 ? '1' : '0.7'}`, background: 'lime', borderRadius: '2px' , width: '70px', height: '35px', boxShadow: `inset 5px 5px 5px green, inset -5px -5px 5px green`}}></Button>
                                <Button disabled={moment().diff(moment(activePlan?.created_at), 'minutes') < 15 ? false : true} onClick={() => handleUpdateStatus(1)} style={{ opacity: `${moment().diff(moment(activePlan?.created_at), 'minutes') < 15 ? '1' : '0.7'}`, background: 'gold', borderRadius: '2px' , width: '70px', height: '35px', boxShadow: `inset 5px 5px 5px  #6c6e00, inset -5px -5px 5px #6c6e00`}}></Button>
                                <Button disabled={moment().diff(moment(activePlan?.created_at), 'minutes') < 15 ? false : true} onClick={() => handleUpdateStatus(2)} style={{ opacity: `${moment().diff(moment(activePlan?.created_at), 'minutes') < 15 ? '1' : '0.7'}`, background: 'firebrick', borderRadius: '2px' , width: '70px', height: '35px', boxShadow: `inset 5px 5px 5px #400400, inset -5px -5px 5px #400400`}}></Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </Modal>
        {activePlan ? (
            <>
                <div style={{ marginTop: '-16px' }}>
                    <p style={{ backgroundColor: 'gainsboro', padding: '10px', fontWeight: 'bold', color: '#495057', fontSize: '16px', fontFamily: 'sans-serif' }}>Cek Mesin Start</p>
                </div>
                <div
                    style={{ backgroundColor: 'lavender', height: '266px', marginTop: '-16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                    <ScrollArea>

                    {conditionMachineProductionDatas.map((row, index) => (
                        <div
                            onClick={() => handleModalOpen(row)}
                            key={index}
                            style={{ cursor: 'pointer', marginTop: `${index != 0 ? '10px' : '0'}`, backgroundColor: 'lavender', borderRadius: '10px', height: '50px', width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '2px solid grey'}}>
                            <p style={{ fontSize: '1.1rem', textAlign: 'center', marginLeft: '20px' }}>{row?.conditionMachine?.name}</p>
                            <div style={{ backgroundColor: `${row?.status == 0 ? 'lime' : row?.status == 1 ? 'gold' : 'firebrick'}`, width: '70px', height: '35px', marginRight: '20px', boxShadow: `inset 5px 5px 5px  ${row?.status == 0 ? 'green' : row?.status == 1 ? '#6c6e00' : '#400400'}, inset -5px -5px 5px  ${row?.status == 0 ? 'green' : row?.status == 1 ? '#6c6e00' : '#400400'}`  }}></div>
                        </div>
                    ))}
                    </ScrollArea>
                </div>
            </>
        ) : (
            <>
               <div style={{ marginTop: '-16px' }}>
                    <p style={{ backgroundColor: 'gainsboro', padding: '10px' }}>Kondisi Mesin</p>
                </div>
                <div
                    style={{ backgroundColor: 'lavender', height: '266px', marginTop: '-16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                    <ScrollArea>
                    </ScrollArea>
                </div>
            </>
        )}
    </div>
    )
}

export default MachineCondition