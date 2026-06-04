import Recommendations from './Recommendations';
import RecommendationDetail from './components/RecommendationDetail';
import RecommendationNew from './components/RecommendationNew';
import { initRecommendations } from './actions/initRecommendations';
import { useRecommendations } from './hooks/useRecommendations';
import { setRecommendations } from './actions/setRecommendations';
import { createRecommendation } from './actions/createRecommendation';
import { patchRecommendation } from './actions/patchRecommendation';
import { deleteRecommendation } from './actions/deleteRecommendation';

export {
    Recommendations,
    RecommendationDetail,
    RecommendationNew,
    initRecommendations,
    useRecommendations,
    setRecommendations,
    createRecommendation,
    patchRecommendation,
    deleteRecommendation,
};
