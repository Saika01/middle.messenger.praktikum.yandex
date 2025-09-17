function cloneDeep<T extends object = object>(obj: T) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as any;
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags) as any;
    }

    if (Array.isArray(obj)) {
        const arrCopy: any[] = [];
        for (let i = 0; i < obj.length; i++) {
            arrCopy[i] = cloneDeep(obj[i]);
        }
        return arrCopy as any;
    }

    const prototype = Object.getPrototypeOf(obj);
    if (prototype !== Object.prototype) {
        const classCopy = Object.create(prototype);
        
        // Копируем все свойства (включая символы при необходимости)
        Object.getOwnPropertyNames(obj).forEach(key => {
            // Используем прямой доступ к свойству
            const value = (obj as Record<string, any>)[key];
            if (value !== undefined) {
                classCopy[key] = cloneDeep(value);
            }
        });
        
        return classCopy as T;
    }

    const objCopy: Record<string, any> = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            objCopy[key] = cloneDeep((obj as any)[key]);
        }
    }

    return objCopy as T;
}

export default cloneDeep;