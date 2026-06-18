import React from 'react';
import { useRouter } from 'next/navigation';
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	Typography,
} from '@mui/material';
import { Icon, navigateTo } from '../../../../NX/DesignSystem'
import { useDispatch } from '../../../../NX/Uberedux';
import { useClients, ClientList } from '../../Clients';

type I_ClientDash = {
	title: string;
	description?: string;
	icon: string;
	cta: () => void;
};

const ClientDash = () => {

	const router = useRouter();
	const dispatch = useDispatch();
	const clientsState = useClients();
	
	const handleNewClient = () => {
		dispatch(navigateTo(router, '/clients/new'));
	}

	const handleClients = () => {
		dispatch(navigateTo(router, '/clients'));
	}

	return (
		<>
			
			<Box sx={{ my: 2 }}>
				<Button
					fullWidth
					size="large"
					color="primary"
					variant="outlined"
					startIcon={<Icon icon="clients" />}
					onClick={handleClients}
				>
					Clients
				</Button>
			</Box>

			<Box sx={{ my: 2 }}>
				<Button
					fullWidth
					size="large"
					color="primary"
					variant="outlined"
					startIcon={<Icon icon="clients" />}
					endIcon={<Icon icon="add" />}
					onClick={handleNewClient}
				>
					New Client
				</Button>
			</Box>
			
			<ClientList />
		</>
	);
};

export default ClientDash;
