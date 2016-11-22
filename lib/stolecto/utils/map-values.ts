import reduceValues from './reduce-values';

export default function mapValues(keyMap, mapper) {
  return reduceValues(keyMap, (output, value, fieldName) => {
    output[fieldName] = mapper(value);
    return output;
  });
}
