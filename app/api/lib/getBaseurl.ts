// grab the baseURL from the config
export const getBaseurl = () => {
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:2027/api';
    }
    return 'https://goldlabel.pro/api';
};
