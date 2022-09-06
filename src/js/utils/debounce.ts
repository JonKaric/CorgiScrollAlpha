export function debounce(callback: any, wait: number) {
    let timeoutId: any = null;
    return (...args: any) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}