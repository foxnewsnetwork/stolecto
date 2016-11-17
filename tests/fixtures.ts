export const SHOPS = {
  "666": {
    id: 666,
    name: "Hot Topic",
    owner: 12
  }
};

export const OWNERS = {
  "12": {
    id: 12,
    name: "Sephiorth",
    shops: [666]
  }
};

export const JSON_TYPE = {"Content-Type": "application/json"};
export const all = (X) => JSON.stringify(Object.keys(X).map((k) => X[k]));
