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
import { useClients } from '../../Clients';

type I_ClientDash = {
	title: string;
	description?: string;
	icon: string;
	cta: () => void;
};

const ClientList = () => {

	const router = useRouter();
	const dispatch = useDispatch();
	const clients = useClients();
	
	const handleNewClient = () => {
		dispatch(navigateTo(router, '/clients/new'));
	}
	
	return (
		<>
			<pre>clients: {JSON.stringify(clients, null, 2)}</pre>
		</>
	);
};

export default ClientList;
