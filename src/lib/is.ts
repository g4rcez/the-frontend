const isUndefined = (a: any): a is undefined => a === undefined;
const nil = (a: any): a is null => a === null;
export const Is = {
  null: nil,
  undefined: isUndefined,
  nil: (a: any) => nil(a) || isUndefined(a),
  empty: (a: any): a is null | undefined | [] | {} => {
    if (a === null || a === undefined) return true;
    if (Array.isArray(a) && a.length === 0) return true;
    return Object.keys(a).length === 0 && Object.getPrototypeOf(a) === Object.prototype;
  },

  keyof: <T, IS extends keyof T = keyof T>(key: keyof T | string, obj: T): key is IS => Object.prototype.hasOwnProperty.call(obj, key),
};
