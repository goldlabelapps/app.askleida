import Tips from './Tips';
import TipDetail from './components/TipDetail';
import TipNew from './components/TipNew';
import { initTips } from './actions/initTips';
import { useTips } from './hooks/useTips';
import { setTips } from './actions/setTips';
import { deleteTip } from './actions/deleteTip';
import { patchTip } from './actions/patchTip';
import { createTip } from './actions/createTip';

export {
    Tips,
    TipDetail,
    TipNew,
    initTips,
    useTips,
    setTips,
    deleteTip,
    patchTip,
    createTip,
};
