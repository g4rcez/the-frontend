import { z, ZodTypeAny } from "zod";

export const setPath = <T>(obj: T, pathArray: Array<string | number>, value: any) => {
  const clone = structuredClone(obj);
  pathArray.reduce((acc, key, i) => {
    if (acc[key] === undefined) acc[key] = {};
    if (i === pathArray.length - 1) acc[key] = value;
    return acc[key];
  }, clone);
  return clone as T;
};

const validate = (schema: ZodTypeAny) => (x: unknown) => {
  const result = schema.safeParse(x);
  return result.success ? result.data : x;
};

const parse = (a: any) => {
  try {
    return JSON.parse(a);
  } catch (error) {
    return a;
  }
};

const entries = z.array(z.tuple([z.string(), z.any()]));

const formDataRemap = validate(
  z
    .any()
    .transform((x) => [...x])
    .refine((x) => entries.safeParse(x).success)
    .transform(
      (data): Record<string, any> =>
        Array.from(
          [...data].reduce<Map<string, any[]>>((map, [k, v]) => {
            const vl = parse(v);
            const hasK = map.has(k);
            const value = hasK ? vl : [vl];
            if (!hasK) return map.set(k, [value]);
            map.get(k)!.push(value);
            return map;
          }, new Map<string, unknown[]>())
        ).reduce((acc, [key, value]) => setPath(acc, [key], value.length === 1 ? value[0] : value), {} as Record<string, unknown | unknown[]>)
    )
);

export const formDataToJson = async <T extends {}>(request: Request): Promise<T> => formDataRemap(await request.formData());
