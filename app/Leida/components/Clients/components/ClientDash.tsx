import React from 'react';
import { useRouter } from 'next/navigation';
import {
	Box,
} from '@mui/material';
import { Icon, navigateTo } from '../../../../NX/DesignSystem'
import { useDispatch } from '../../../../NX/Uberedux';
import { 
	ClientList,
} from '../../../../Leida';
import { Wrapper } from '../../../../Leida';

const ClientDash = () => {

	// const router = useRouter();
	// const dispatch = useDispatch();
	
	// const handleNewClient = () => {
	// 	dispatch(navigateTo(router, '/clients/new'));
	// }

	// const handleClients = () => {
	// 	dispatch(navigateTo(router, '/clients'));
	// }

	return (
		<Wrapper>
			<Box sx={{ my: 1 }}>
				<ClientList />
			</Box>
		</Wrapper>
	);
};

export default ClientDash;
