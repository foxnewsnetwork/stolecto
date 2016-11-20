export interface Enhancer<T> {
  (creator: T): T;
}

export function isEnhancer(maybeEnhancer: Ehancer | any) {
  return typeof maybeEnhancer === 'function';
}

export default function enhanceWith(enhancements) {
  return (originalCreator) => {
    return (originalParams) => {
      const original = originalCreator(originalParams);
      for(let featureName in enhancements) {
        original[featureName] = enhancements[featureName];
      }
      return original;
    };
  };
}
