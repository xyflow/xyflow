
export const useRef = <T>(initialValue: T): RefObject<T> => {
    return new RefObject(initialValue);
}

export class RefObject<T> { 
    constructor(private _current: T) {
    }

    get current() {
        return this._current;
    }

    set current(value) {
        this._current = value;
    }
}