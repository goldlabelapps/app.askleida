import Clients from './Clients';
import ClientDetail from './components/ClientDetail';
import ClientNew from './components/ClientNew';
import { initClients } from './actions/initClients';
import { useClients } from './hooks/useClients';
import { setClients } from './actions/setClients';
import { createClient } from './actions/createClient';
import { patchClient } from './actions/patchClient';
import { deleteClient } from './actions/deleteClient';
export {
    Clients,
    ClientDetail,
    ClientNew,
    initClients,
    useClients,
    setClients,
    createClient,
    patchClient,
    deleteClient,
};
