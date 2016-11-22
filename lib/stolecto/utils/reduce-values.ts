export default function reduceValues(objMap, reducer, init) {
  for(let key in objMap) {
    init = reducer(init, objMap[key], key);
  }
  return init;
}
