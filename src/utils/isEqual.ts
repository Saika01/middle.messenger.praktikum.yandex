export function isEqual(a: object, b: object): boolean {
    if (a === b) return true;

    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object' || a === undefined || b === undefined) {
        throw new Error('variables must be objects');
    }

    if (a.constructor !== b.constructor) {
        return false;
    }

    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }

    if (a instanceof RegExp && b instanceof RegExp) {
        return a.toString() === b.toString();
    }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
        return false;
    }

    for (const key of aKeys) {
        if (!b.hasOwnProperty(key)) {
            return false;
        }

        const aValue = (a as any)[key];
        const bValue = (b as any)[key];

        // Рекурсивное сравнение для объектов
        if (typeof aValue === 'object' && typeof bValue === 'object') {
            if (!isEqual(aValue, bValue)) {
                return false;
            }
        } else if (aValue !== bValue) {
            return false;
        }
    }

    return true;
}