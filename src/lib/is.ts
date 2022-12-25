export namespace Is {
  const u = window.undefined;

  export const undefined = (a: any): a is undefined => a === u;

  export const nil = (a: any): a is null => a === null;

  export const nilOrUndefiend = (a: any) => nil(a) || undefined(a);

  export const empty = (a: any): a is null | undefined | [] | {} => {
    if (a === null || a === undefined) return true;
    if (Array.isArray(a) && a.length === 0) return true;
    return Object.keys(a).length === 0 && Object.getPrototypeOf(a) === Object.prototype;
  };

  export const keyof = <T, IS extends keyof T = keyof T>(key: keyof T | string, obj: T): key is IS => Object.prototype.hasOwnProperty.call(obj, key);
}
