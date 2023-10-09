import axiosPlanning from "@/libs/planning/axios"
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'
import client from '@/libs/mqtt'
import { useEffect, useState } from "react"
import { yellow } from "@material-ui/core/colors"
import { Button, Modal, Table } from "@mantine/core"

const MachineCondition = () => {
    const [conditionMachineProductionDatas, setConditionMachineProductionDatas] = useState([])
    const [openModal, setOpenModal] = useState({
        isOpen: false,
        data: null
    })
    useEffect(() => {
        const fetchConditionMachine = async () => {
            try {
                const res = await axiosPlanning.get('condition-machine-production', getHeaderConfigAxios()).then(item => item.data)
                setConditionMachineProductionDatas(res.data)
            } catch (error) {
                console.log(error, 'error fetch condition machine');
            }
        }
        fetchConditionMachine()
    },[])

    const handleModalOpen = (data) => {
        setOpenModal({isOpen: true, data: data})
    }

    const handleUpdateStatus = async (status) => {
        try {
            await axiosPlanning.patch(`condition-machine-production/${openModal?.data?.id}`, {status: status},getHeaderConfigAxios())
            setOpenModal({isOpen: false, data: null})
            router.reload()
        } catch (error) {}
    }

    return (
        <div
        style={{ width: '480px', border: '10px solid skyblue', textAlign: 'center', height: '304px', marginLeft: '25px' }}>
        <Modal size={"40%"} opened={openModal.isOpen} withCloseButton={false} onClose={() => setOpenModal({isOpen: false})} centered>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Condition</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td width={"50%"}>{openModal?.data?.conditionMachine?.name}</td>
                            <td style={{ display: 'flex', gap: '10px' }}>
                                <Button onClick={() => handleUpdateStatus(0)} style={{ background: 'lime', borderRadius: '2px' , width: '70px', height: '35px', boxShadow: `inset 5px 5px 5px green, inset -5px -5px 5px green`}}></Button>
                                <Button onClick={() => handleUpdateStatus(1)} style={{ background: 'gold', borderRadius: '2px' , width: '70px', height: '35px', boxShadow: `inset 5px 5px 5px  #6c6e00, inset -5px -5px 5px #6c6e00`}}></Button>
                                <Button onClick={() => handleUpdateStatus(2)} style={{ background: 'firebrick', borderRadius: '2px' , width: '70px', height: '35px', boxShadow: `inset 5px 5px 5px #400400, inset -5px -5px 5px #400400`}}></Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </Modal>

        <div style={{ marginTop: '-16px' }}>
            <p style={{ backgroundColor: 'gainsboro', padding: '10px' }}>Kondisi Mesin</p>
        </div>
        <div
            style={{ backgroundColor: 'lavender', height: '266px', marginTop: '-16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
            {conditionMachineProductionDatas.map((row, index) => (
                <div
                    onClick={() => handleModalOpen(row)}
                    key={index}
                    style={{ marginTop: `${index != 0 ? '10px' : '0'}`, backgroundColor: 'lavender', borderRadius: '10px', height: '50px', width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '2px solid grey'}}>
                    <p style={{ fontSize: '1.1rem', textAlign: 'center', marginLeft: '20px' }}>{row?.conditionMachine?.name}</p>
                    <div style={{ backgroundColor: `${row?.status == 0 ? 'lime' : row?.status == 1 ? 'gold' : 'firebrick'}`, width: '70px', height: '35px', marginRight: '20px', boxShadow: `inset 5px 5px 5px  ${row?.status == 0 ? 'green' : row?.status == 1 ? '#6c6e00' : '#400400'}, inset -5px -5px 5px  ${row?.status == 0 ? 'green' : row?.status == 1 ? '#6c6e00' : '#400400'}`  }}></div>
                </div>
            ))}
            {/* <div
                style={{ backgroundColor: 'lavender', borderRadius: '10px', height: '50px', width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', border: '2px solid grey'}}>
                <p style={{ fontSize: '1.1rem', textAlign: 'center', marginLeft: '20px' }}>Zero Set Position Jig</p>
                <div style={{ backgroundColor: 'gold', width: '70px', height: '35px', marginRight: '20px', boxShadow: 'inset 5px 5px 5px #6c6e00, inset -5px -5px 5px #6c6e00'  }}></div>
            </div>
            <div
                style={{ backgroundColor: 'lavender', borderRadius: '10px', height: '50px', width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', border: '2px solid grey'}}>
                <p style={{ fontSize: '1.1rem', textAlign: 'center', marginLeft: '20px' }}>CO2 Gas</p>
                <div style={{ backgroundColor: 'lime', width: '70px', height: '35px', marginRight: '20px', boxShadow: 'inset 5px 5px 5px green, inset -5px -5px 5px green'  }}></div>
            </div>
            <div
                style={{ backgroundColor: 'lavender', borderRadius: '10px', height: '50px', width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', border: '2px solid grey'}}>
                <p style={{ fontSize: '1.1rem', textAlign: 'center', marginLeft: '20px' }}>Welding Jig</p>
                <div style={{ backgroundColor: 'firebrick', width: '70px', height: '35px', marginRight: '20px', boxShadow: 'inset 5px 5px 5px #400400, inset -5px -5px 5px #400400'  }}></div>
            </div> */}
        </div>
    </div>
    )
}

export default MachineCondition