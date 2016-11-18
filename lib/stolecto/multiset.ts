import { Map, ResultsHash } from './base-types';

export interface Multiset {
  map<T>(mapF: Map<Singleset, T>): ResultsHash<T>;
}
