export namespace Is {
  export const empty = (a: any): a is null | undefined | [] | {} => {
    if (a === null || a === undefined) return true;
    if (Array.isArray(a) && a.length === 0) return true;
    return Object.keys(a).length === 0 && Object.getPrototypeOf(a) === Object.prototype;
  };
}
