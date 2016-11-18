export type Command = string | symbol;
export type Primitive = string | number | boolean
export interface Resolver {
  (value: any): any;
}

export interface Promise<T> {
  then: (resolve: Resolver) => Promise<T>;
  reject: (reject: Resolver) => Promise<T>;
  finally: (handler: Resolver) => Promise<T>;
}

export interface Map<A, B> {
  (a: A): B;
}

export interface ResultsHash<T> {
  [propName: string]: T;
}

export interface Error {
  stack: string;
  message: string;
  name: string;
}
