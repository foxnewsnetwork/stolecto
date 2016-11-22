export interface Enhancer<T> {
  (creator: T): T;
}

export function isEnhancer(maybeEnhancer: Ehancer | any) {
  return typeof maybeEnhancer === 'function';
}
