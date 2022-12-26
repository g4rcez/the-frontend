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

export const anyJson = validate(
  z
    .any()
    .transform((val) => [...val])
    .refine((val): val is z.infer<typeof entries> => entries.safeParse(val).success)
    .transform(
      (object): Record<string, unknown | unknown[]> =>
        Array.from(
          object
            .reduce<Map<string, any[]>>((map, [k, v]) => (map.has(k) ? map.set(k, [...map.get(k)!, parse(v)]) : map.set(k, [parse(v)])), new Map())
            .entries()
        ).reduce((acc, [key, value]) => setPath(acc, [key], value.length === 1 ? value[0] : value), {} as Record<string, unknown | unknown[]>)
    )
);

export const formDataToJson = async <T extends {}>(request: Request): Promise<T> => anyJson(await request.formData());
