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

const ClientDash = ({ 
    title, 
    description, 
    icon, 
    cta }: I_ClientDash) => {

		const router = useRouter();
		const dispatch = useDispatch();
		const clientsState = useClients();
		const clientCount = Array.isArray(clientsState?.list) ? clientsState.list.length : 0;

		const handleNewClient = () => {
			dispatch(navigateTo(router, '/clients/new'));
		}
	return (
		<>
			<Box sx={{ my: 2 }}>
				<Button
					fullWidth
					size="large"
					color="primary"
					variant="contained"
					startIcon={<Icon icon="clients" />}
					endIcon={<Icon icon="add" />}
					onClick={handleNewClient}
				>
					New Client
				</Button>
			</Box>
			<Card 
				variant='outlined' 
				sx={{ 
					height: '100%', 
					display: 'flex', 
					flexDirection: 'column', 
					mb: 3
				}}>
				<CardActionArea 
					onClick={cta} 
					sx={{ 
					}}>
					<CardContent sx={{ flexGrow: 1 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Icon icon={icon as any} />
							</Box>
							<Typography variant="h6">
								{title}
							</Typography>
						</Box>
						<Box 
							sx={{ 
								display: 'flex', 
								alignItems: 'left' }}>
							{description && <Typography variant="body2" color="text.secondary">
								{description}
							</Typography>}
							<Typography variant="subtitle2" color="text.secondary">
								{clientCount} client{clientCount === 1 ? '' : 's'}
							</Typography>
						</Box>
					</CardContent>
				</CardActionArea>
			</Card>
			
		</>
	);
};

export default ClientDash;
