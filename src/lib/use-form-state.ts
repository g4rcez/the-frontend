import { useFetcher, useLoaderData, useNavigation } from "react-router-dom";
import { useRef } from "react";

export const useLoader = <T>(): T => useLoaderData() as any;

export const useFormState = <T>() => {
  const initialData = useLoader<T>();
  const fetcher = useFetcher<T>();
  const ref = useRef<HTMLFormElement>(null);
  const navigation = useNavigation();

  return { fetcher, loading: navigation.state === "loading", ref, state: fetcher.data ?? initialData };
};
