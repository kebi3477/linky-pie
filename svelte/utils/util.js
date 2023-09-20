export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function getTimeDifferenceDescription(targetDateStr) {
    const now = new Date();
    const targetDate = new Date(targetDateStr);
    
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;

    const elapsed = now - targetDate;

    if (elapsed < msPerMinute) {
        return "방금 전";
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + "분 전";
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + "시간 전";
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + "일 전";
    } else {
        return targetDate.toLocaleDateString();
    }
}