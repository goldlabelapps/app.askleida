import lingua from './lingua.json';

type T_GreetingKey = 'GREET_MORNING' | 'GREET_AFTERNOON' | 'GREET_EVENING';

const DEFAULT_LANGUAGE = 'en-GB';

export const getTimeGreeting = (date = new Date()) => {
    const hour = date.getHours();

    const greetingKey: T_GreetingKey =
        hour < 12
            ? 'GREET_MORNING'
            : hour < 18
                ? 'GREET_AFTERNOON'
                : 'GREET_EVENING';

    const translations = lingua[greetingKey] || {};
    const languages = Object.keys(translations);

    if (languages.length === 0) {
        return '';
    }

    const randomLanguage = languages[Math.floor(Math.random() * languages.length)];

    return (
        translations[randomLanguage as keyof typeof translations] ||
        translations[DEFAULT_LANGUAGE as keyof typeof translations] ||
        ''
    );
};