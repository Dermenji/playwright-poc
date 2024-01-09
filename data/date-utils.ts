// date-utils.ts

// Function to format a date in the required format
export const formatDate = (date: Date): string => {
    const formatDigit = (num: number): string => (num < 10 ? `0${num}` : num.toString());

    // Explicitly set seconds to '00'
    date.setSeconds(0);

    return (
        date.getFullYear() +
        '-' +
        formatDigit(date.getMonth() + 1) +
        '-' +
        formatDigit(date.getDate()) +
        'T' +
        formatDigit(date.getHours()) +
        ':' +
        formatDigit(date.getMinutes()) +
        ':00' + // Set seconds to '00'
        '+0100'
    );
};