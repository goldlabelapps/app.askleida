"use client";
import React from 'react';
import type { T_Client } from '../../../types';
import { useRouter } from 'next/navigation';
import {
	Alert,
	Box,
	Button,
	LinearProgress,
	Pagination,
	Stack,
	Typography,
} from '@mui/material';
import { navigateTo, Icon } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { useClients, RenderClient } from '../../../../Leida';

type T_ClientSlice = {
	loading?: boolean;
	error?: unknown;
	list?: T_Client[];
};

const PAGE_SIZE = 8;

const getText = (value: unknown): string => {
	if (typeof value !== 'string') {
		return '';
	}

	return value.trim();
};

const getClientId = (client: T_Client): string => {
	return getText(client.client_id) || getText(client.id);
};

const getClientButtonLabel = (client: T_Client): string => {
	const data = client?.data && typeof client.data === 'object'
		? (client.data as Record<string, unknown>)
		: null;
	const displayName = getText(data?.display_name);

	if (displayName) {
		return displayName;
	}

	return getText(client.title) || 'Unnamed client';
};

const getErrorMessage = (error: unknown): string => {
	if (!error) {
		return '';
	}

	if (typeof error === 'string') {
		return error;
	}

	if (typeof error === 'object' && error !== null && 'message' in error) {
		return getText((error as { message?: unknown }).message) || 'Unable to load clients.';
	}

	return 'Unable to load clients.';
};

	const handleNew = () => {
		dispatch(navigateTo(router, '/clients/new'));
	};

const ClientList = () => {

	const router = useRouter();
	const dispatch = useDispatch();
	const clients = useClients() as T_ClientSlice;
	const [page, setPage] = React.useState(1);
	const loading = Boolean(clients?.loading);
	const errorMessage = getErrorMessage(clients?.error);
	const hasError = Boolean(errorMessage);
	const list = React.useMemo(() => {
		if (!Array.isArray(clients?.list)) {
			return [] as T_Client[];
		}

		return clients.list;
	}, [clients?.list]);
	const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));

	React.useEffect(() => {
		if (page > pageCount) {
			setPage(pageCount);
		}
	}, [page, pageCount]);

	const paginatedList = React.useMemo(() => {
		const start = (page - 1) * PAGE_SIZE;
		return list.slice(start, start + PAGE_SIZE);
	}, [list, page]);

	const handleClientNew = () => {
		dispatch(navigateTo(router, `/clients/new`));
	};

	return (
		<Box>
			{loading ? <LinearProgress sx={{ mb: 2 }} /> : null}

			{hasError ? (
				<Alert severity="error" sx={{ mb: 2 }}>
					{errorMessage}
				</Alert>
			) : null}

			{!loading && !hasError && list.length === 0 ? (
				<Box>
					<Button
						fullWidth
						endIcon={<Icon icon="add" />}
						onClick={handleClientNew}
					>
						Add first client
					</Button>
				</Box>
				
			) : <Box>
					<Button
						fullWidth
						size="large"
						color="primary"
						variant="contained"
						startIcon={<Icon icon="clients" />}
						endIcon={<Icon icon="add" />}
						onClick={handleClientNew}
					>
						New Client
					</Button>
				</Box>}

			<Stack spacing={1}>
				{paginatedList.map((client, index) => {
					return <RenderClient
						key={`client_${index}`}
						mode="list"
						client={client}
					/>;
				})}
			</Stack>

			{list.length > PAGE_SIZE ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
					<Pagination
						count={pageCount}
						page={page}
						onChange={(_, nextPage) => setPage(nextPage)}
						color="primary"
					/>
				</Box>
			) : null}
{/* 
			<pre>{JSON.stringify(clients, null, 2)}</pre> */}
		</Box>
	);
};

export default ClientList;
