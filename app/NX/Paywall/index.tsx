import { firebaseLogin, firebaseLogout } from './actions/firebaseAuth';
// Components
import SignIn from './components/SignIn';
import SupabaseAuth from './components/SupabaseAuth';
import SimpleSignIn from './components/SimpleSignIn';
import Register from './components/Register';
import ChooseAvatar from './components/ChooseAvatar';
import SignOutBtn from './components/SignOutBtn';
import MiniAccount from './components/MiniAccount';
// Actions
import { setPaywall } from './actions/setPaywall';
import { avatarsByUID } from './actions/avatarsByUID';
import { subscribeAccount } from './actions/subscribeAccount';
import { updateAccount } from './actions/updateAccount';
import { login } from './actions/login';
import { logout } from './actions/logout';

// Hooks
import { usePaywall } from './hooks/usePaywall';


// Components
export {
    SignIn,
    SimpleSignIn,
    SignOutBtn,
    SupabaseAuth,
    Register,
    ChooseAvatar,
    MiniAccount,
};

// Actions
export {
    setPaywall,
    avatarsByUID,
    subscribeAccount,
    updateAccount,
    firebaseLogin,
    firebaseLogout,
    login,
    logout,
};

// Hooks
export {
    usePaywall,
};

// Supabase Auth
export { useSupabaseAuth } from './hooks/useSupabaseAuth';
export { default as RequireSupabaseAuth } from './components/RequireSupabaseAuth';
export { default as SupabaseLogin } from './components/SupabaseLogin';
