import { Button, Space } from '@mantine/core';
import ChartComponent from './ChartComponent';
import Link from 'next/link';


export default function BarChart() {

  return ( 
			<>
			  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
			    <h2>Production Achievement</h2>
			    <Button>
			      <p style={{ textDecoration: 'none', color: 'white' }}>Export</p>
			    </Button>
			  </div>
			  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			    <h2>RW 5 - Achievement</h2>
			  </div>
			  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			    <div
			      style={{ borderRadius: '5px', height: '30px', width: '250px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid black'}}>
			      <div
			        style={{ backgroundColor: 'aqua', width: '25px', height: '25px', marginLeft: '20px'  }}>
			      </div>
			      <p style={{ fontSize: '1.1rem', textAlign: 'center', marginRight: '50px' }}>Annual averege</p>
			    </div>
          <div
			      style={{ borderRadius: '5px', height: '30px', width: '250px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid black', marginLeft: '90px'}}>
			      <div
			        style={{ backgroundColor: 'lime', width: '25px', height: '25px', marginLeft: '20px'  }}>
			      </div>
			      <p style={{ fontSize: '1.1rem', textAlign: 'center', marginRight: '50px' }}>Montly averege</p>
			    </div>
          <div
			      style={{ borderRadius: '5px', height: '30px', width: '250px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid black', marginLeft: '90px'}}>
			      <div
			        style={{ backgroundColor: 'gold', width: '25px', height: '25px', marginLeft: '20px'  }}>
			      </div>
			      <p style={{ fontSize: '1.1rem', textAlign: 'center', marginRight: '50px' }}>Daily averege</p>
			    </div>
			  </div>
			  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			    <ChartComponent />
			  </div>
			</>
  );
}

BarChart.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
