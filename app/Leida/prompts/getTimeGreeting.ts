export const getTimeGreeting = (date = new Date()) => {
    const hour = date.getHours();

    if (hour < 12) {
        return 'Good Morning';
    }

    if (hour < 18) {
        return 'Good Afternoon';
    }

    return 'Good Evening';
};