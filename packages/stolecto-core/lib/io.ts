export interface Promise {
  then: (resolve, reject) => Promise | any | never;
  catch: (handler) => Promise | any | never;
  finally: (handler) => any;
}
export interface IO {
  makeRequest: (uri: string, header, body) => Promise;
  onResponse: (response: any) => void;
}
