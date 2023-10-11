import { useRouter } from "next/router"
import FormControl from "@/components/views/MasterData/Role/FormControl"
import { Button, Card, Checkbox, Divider, Grid, Group, Pagination, Select, Space, Title } from "@mantine/core"
import { useSetState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import axiosAuth from '@/libs/auth/axios'
import {getHeaderConfigAxios} from '@/utils/getHeaderConfigAxios'

export default function EditProduct({role}) {
    const router = useRouter()
    const [permissions, setPermissions] = useState([])

    const [name, setName] = useState(role);
	const [selectedPermissions, setSelectedPermission] = useState([]);

	const [activePage, setActivePage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(20);

    const handleItemsPerPageChange = value => {
		setItemsPerPage(parseInt(value));
	};

    const totalItems = permissions.length;
	const startIndex = (activePage - 1) * itemsPerPage;
	const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);

	useEffect(() => {
		const newTotalPages = Math.ceil(permissions.length / itemsPerPage);
		if (newTotalPages !== totalPages) {
			setActivePage(1);
			setTotalPages(newTotalPages);
		}
		if (newTotalPages > 100) {
			setTotalPages(100);
		}
	}, [permissions, itemsPerPage, totalPages]);


		
	useEffect(() => {
		const getDefaultPermission = async () => {
			const permission = (await axiosAuth.get(`roles/permissions/${router.query.id}`, getHeaderConfigAxios())).data.data;
			setSelectedPermission(permission[0].permissions.map(p => p.id));
		};
		getDefaultPermission();
	}, [router.query.id]);

    useEffect(() => {
        const fetchRole = async () => {
            const { data } = await axiosAuth.get(`permissions`, getHeaderConfigAxios()).then(item => item.data)
            setPermissions(data)
        }
        fetchRole()
    }, []) 

	const handlePageChange = newPage => {
		setActivePage(newPage);
	};


    const handleAssignPermission = async () => {
		const roleId = router.query.id
		await axiosAuth.post(`roles/permissions/${roleId}`, {permissionIds: selectedPermissions}, getHeaderConfigAxios());
		// router.push('/master-data/role');
	};

    const handleCheckboxChange = e => {
		const value = e.target.value;
		const isChecked = e.target.checked;
	
		if (isChecked) {
			setSelectedPermission([...selectedPermissions, value]);
		} else {
			setSelectedPermission(selectedPermissions.filter(item => item != value));
		}
	};

    return (
    <Card style={{ background: 'transparent' }}>
        <Title size={'1rem'} mb={20}>Edit Product</Title>
        <FormControl id={router.query?.id}/>
        <Divider size="sm" />
			<Group position="right" style={{ marginTop: '30px' }}>
			<Select
					maw={200}
					placeholder="Select Number"
					data={['5', '10', '20']}
					onChange={handleItemsPerPageChange}
				/>
				<Pagination
					style={{ marginLeft: '150px' }}
					totalPages={totalPages}
					activePage={activePage}
					onChange={handlePageChange}
					total={totalPages}
				/>
				<p style={{ fontSize: '13px' }}>
					Showing {startIndex + 1} To {endIndex + 1} of {totalItems} Entries
				</p>
			</Group>
			<Space h="xl" />
			<Grid gutter="xl">
				{permissions.slice(startIndex, endIndex + 1).map(permission => (
					<Grid.Col span={3}>
						<Checkbox
							style={{ marginRight: '100px' }}
							size="md"
							key={permission.id}
							value={permission.id}
							onChange={handleCheckboxChange}
							label={permission.name}
							checked={selectedPermissions.find((item)=>item == permission.id)}
						/>
					</Grid.Col>
				))}
				<Button style={{ width: '100%' }} onClick={() => handleAssignPermission()}>
					Sync Permission
				</Button>
            </Grid>
    </Card>
    )
}