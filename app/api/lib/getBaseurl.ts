// grab the baseURL from the config
export const getBaseurl = () => {
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:1888/api';
    }
    return 'https://app.askleida.com/api';
};
