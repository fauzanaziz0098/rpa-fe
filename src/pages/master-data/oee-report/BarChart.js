import { Typography } from '@material-ui/core';
import { useState, useEffect } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

const data = [
	{ month: 'Jan', sales: 1000 },
	{ month: 'Feb', sales: 6000 },
	{ month: 'Mar', sales: 2000 },
	{ month: 'Apr', sales: 8000 },
	{ month: 'May', sales: 5000 },
	{ month: 'Jun', sales: 1000 },
	{ month: 'Jul', sales: 9000 },
	{ month: 'Aug', sales: 8000 },
	{ month: 'Sep', sales: 3000 },
	{ month: 'Oct', sales: 4000 },
	{ month: 'Nov', sales: 7000 },
	{ month: 'Dec', sales: 12000 },
	{ month: 'Jan', sales: 1000 },
	{ month: 'Feb', sales: 6000 },
	{ month: 'Mar', sales: 2000 },
	{ month: 'Apr', sales: 8000 },
	{ month: 'May', sales: 5000 },
	{ month: 'Jun', sales: 1000 },
	{ month: 'Jul', sales: 9000 },
	{ month: 'Aug', sales: 8000 },
	{ month: 'Sep', sales: 3000 },
	{ month: 'Oct', sales: 4000 },
	{ month: 'Nov', sales: 7000 },
	{ month: 'Dec', sales: 12000 },
	{ month: 'Dec', sales: 12000 },
	{ month: 'Jan', sales: 1000 },
	{ month: 'Feb', sales: 6000 },
	{ month: 'Mar', sales: 2000 },
	{ month: 'Apr', sales: 8000 },
	{ month: 'May', sales: 5000 },
];

const scale = 100 / Math.max(...data.map((entry) => entry.sales));

data.forEach((entry) => {
  entry.sales = entry.sales * scale;
});

const yAxisDomain = [0, 20, 40, 60, 80, 200, 110];

const MonthChart = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const formatCustomTick = (value) => `${value}%`; // Fungsi untuk memformat nilai persentase

	return (
		<div style={{ display: 'flex', marginTop: '60px' }}>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<div>
				<ResponsiveContainer width={1100} height={400}>
					<BarChart data={data} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
						<XAxis dataKey="month" />
						<YAxis
							tickFormatter={formatCustomTick}
							domain={yAxisDomain}
							tickCount={7}
						/>
						<CartesianGrid strokeDasharray="3 3" />
						<Tooltip />
						<Bar dataKey="sales" fill="#00FFFF" />
					</BarChart>
				</ResponsiveContainer>
				</div>
				{!mounted && (
					<style jsx global>{`
						.recharts-text.recharts-label {
							font-size: 0 !important;
						}
					`}</style>
				)}
			</div>
		</div>
	);
};

export default MonthChart;
