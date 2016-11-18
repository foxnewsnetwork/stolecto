export interface Enhancer {
  
}

export function isEnhancer(maybeEnhancer: Ehancer | any) {
  return typeof maybeEnhancer === 'function';
}
