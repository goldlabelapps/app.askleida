import Clients from './Clients';
import { ClientCard, ClientDash, ClientDetail, ClientNew } from './components';
import { initClients } from './actions/initClients';
import { useClients } from './hooks/useClients';
import { setClients } from './actions/setClients';
import { createClient } from './actions/createClient';
import { patchClient } from './actions/patchClient';
import { deleteClient } from './actions/deleteClient';
export {
    Clients,
    ClientCard,
    ClientDash,
    ClientDetail,
    ClientNew,
    initClients,
    useClients,
    setClients,
    createClient,
    patchClient,
    deleteClient,
};
