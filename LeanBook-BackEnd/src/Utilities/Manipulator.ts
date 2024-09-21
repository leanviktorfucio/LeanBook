export const ObjectManipulator = {
    // <T extends object>: This allows the function to accept any object type.
    // Array<keyof T>: This ensures that the keys you pass in are valid keys of the object type.
    // Partial<T>: This indicates that the returned object may have some properties missing.
    removeProperties<T extends object>(obj: T, keys: Array<keyof T>): Partial<T> {
        const newObject = { ...obj };
        keys.forEach(key => {
            delete newObject[key];
        });
    
        return newObject;
    }
}