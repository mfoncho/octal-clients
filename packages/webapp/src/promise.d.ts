
export interface Thenable<T = any> {
    then<S, E>(
        onFullfill: (data: T) => S,
        onReject?: (reason: any) => E
    ): Promise<S | E>;
}

export interface Finalizable<T = any> {
    finally<F = never>(onFullfill: () => F): Promise<T | F>;
}

export interface Catchable<T = any> {
    catch<F = never>(onError: () => F): Promise<T | F>;
}

export interface Promiseable<T = any, E = any>
    extends Thenable<T>,
    Finalizable<T>,
    Catchable<E> {
}
