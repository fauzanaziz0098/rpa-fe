import { range } from '@mantine/hooks';
import dayjs from 'dayjs';
import "dayjs/locale/id";
import { getHeaderConfigAxios } from '@/utils/getHeaderConfigAxios'
import axiosPlanning from '@/libs/planning/axios'
import {Alert, Button, Group, Skeleton, Text} from '@mantine/core'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useEffect, useRef, useState } from 'react';
import {IconFileExport} from '@tabler/icons'
import Link from 'next/link';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
);

export const options = {
    responsive: true,
    // animation: {
    //     onComplete: () => {
    //         delayed = true;
    //     },
    //     delay: (context) => {
    //         let delay = 0;
    //         if (context.type === 'data' && context.mode === 'default' && !delayed) {
    //             delay = context.dataIndex * 300 + context.datasetIndex * 100;
    //         }
    //         return delay;
    //     }
    // },
    plugins: {
        legend: {
            position: 'top',
            align: 'end',
        },
        title: {
            display: true,
            text: `OEE Line UB Robot 5`,
            padding: {
                top: 30,
            }
        },
        annotation: {
            annotations: {
                line1: {
                    type: 'line',
                    yMin: 100,
                    yMax: 100,
                    borderColor: 'rgb(0, 255, 17)',
                    borderWidth: 3,
                }
            }
        },
        datalabels: {
            rotation: 90,
            color: 'transparent',
            labels: {
                // title: {
                //     font: {
                //         weight: 'bold'
                //     }
                // },
                value: {
                    color: 'transparent'
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 110,
            display: true,
            ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, ticks) {
                    return value + '%';
                }
            }
        },
        x: {
            ticks: {
                maxRotation: 90,
                minRotation: 90
            }
        }
    }
};
export default function OeeReport({ isExport = false, isReadyCallback = () => console.log() }) {
    const [data, setData] = useState()
    const [isReady, setReady] = useState(false)
    const pdfRef = useRef()
    const chartRef = useRef()
    useEffect(() => {
        if (isReady) {
            isReadyCallback(isReady, chartRef)
        }
    }, [isReady])
    useEffect(() => {
        if (isExport) {
            getOverallEquipmentEffectivenessExport()
        } else {
            getOverallEquipmentEffectiveness()
        }
    }, [])
    const getOverallEquipmentEffectivenessExport = async () => {
        try {
            const response = (await axiosPlanning.get('planning-production-report/report-oee-monthly', getHeaderConfigAxios())).data
            const labels = response.data.map(item => item.label)
            const items = {
                labels,
                datasets: [
                    {
                        label: 'OEE Line UB Robot 5',
                        data: response.data.map(item => item.value.oee),
                        // backgroundColor: response.data.map(item => item.color)
                        backgroundColor: '#CB4335'
                    },
                    {
                        label: 'Availability',
                        data: response.data.map(item => item.value.availabilityPercentage),
                        // backgroundColor: response.data.map(item => item.color)
                        backgroundColor: '#884EA0'
                    },
                    {
                        label: 'Performance',
                        data: response.data.map(item => item.value.performancePercentage),
                        // backgroundColor: response.data.map(item => item.color)
                        backgroundColor: '#17A589'
                    },
                    {
                        label: 'Quality',
                        data: response.data.map(item => item.value.qualityPercentage),
                        // backgroundColor: response.data.map(item => item.color)
                        backgroundColor: '#D4AC0D'
                    },
                ]
            }
            console.log(items)
            setData(items)
            setReady(true)
        } catch (error) {

        }
    }
    const getOverallEquipmentEffectiveness = async () => {
        try {
            const { data, start, end, one, two, month } = (await axiosPlanning.get('planning-production-report/report-oee', getHeaderConfigAxios())).data
            const startDate = dayjs(start).startOf('M')
            const endDate = dayjs(end).endOf('M')
            const totalDay = startDate.diff(endDate, 'd') * -1
            const labels = [two.label, one.label, month.label, ...range(0, totalDay).map(value => {
                return startDate.add(value, 'd').format('dddd')
            })];
            const oee = data.map(item=>item.oee)
            const availabilityPercentage = data.map(item=>item.availabilityPercentage)
            const performancePercentage = data.map(item=>item.performancePercentage)
            const qualityPercentage = data.map(item=>item.qualityPercentage)
            const items = {
                labels,
                datasets: [
                    {
                        categoryPercentage: 1.0,
                        barPercentage: 1.0,
                        label: 'OEE Line UB Robot 5',
                        data: [two.value, one.value, month.value, ...oee],
                        backgroundColor: ['#CB4335', '#CB4335', '#CB4335', '#CB4335', ...range(0, totalDay).map(value => {
                            return '#CB4335'
                        })],
                        borderWidth: 1
                    },
                    {
                        categoryPercentage: 1.0,
                        barPercentage: 1.0,
                        label: 'Availability',
                        data: [two.value, one.value, ...availabilityPercentage],
                        backgroundColor: ['#884EA0', '#884EA0', ...range(0, totalDay).map(value => {
                            return '#884EA0'
                        })],
                        borderWidth: 1
                    },
                    {
                        categoryPercentage: 1.0,
                        barPercentage: 1.0,
                        label: 'Performance',
                        data: [two.value, one.value, ...performancePercentage],
                        backgroundColor: ['#17A589', '#17A589', ...range(0, totalDay).map(value => {
                            return '#17A589'
                        })],
                        borderWidth: 1
                    },
                    {
                        categoryPercentage: 1.0,
                        barPercentage: 1.0,
                        label: 'Quality',
                        data: [two.value, one.value, ...qualityPercentage],
                        backgroundColor: ['#D4AC0D', '#D4AC0D', ...range(0, totalDay).map(value => {
                            return '#D4AC0D'
                        })],
                        borderWidth: 1
                    },
                ],
            };
            setData(items)
        } catch (error) {
            console.log(error)
        } finally {
            setReady(true)
        }
    }

    if (isReady) {
        if (isExport) {
            return <Bar height={'70%'} ref={chartRef} options={options} data={data} plugins={[ChartDataLabels, annotationPlugin]} />
        }
        return (
            <div>
                <Alert color={'green'}>
                    <Group position='apart'>
                        <Text color={'green'} weight={700} size={'xl'}>OVERALL EQUIPMENT EFFECTIVENESS</Text>
                        <Button component={Link} href="/report/achievement-oee">export</Button>
                    </Group>
                </Alert>
                <div ref={pdfRef}>
                    <Bar height={'100%'} ref={chartRef} options={options} data={data} plugins={[ChartDataLabels, annotationPlugin]} />
                </div>
            </div>
        )
    }
    return <>
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </>
}