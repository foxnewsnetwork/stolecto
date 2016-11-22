export default function enhanceWith(enhancements) {
  return (originalCreator) => {
    return (originalParams) => {
      const original = originalCreator(originalParams);

      return { ...original, ...enhancements };
    };
  };
}
