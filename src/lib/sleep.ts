export const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      return resolve();
    }, ms);
  });
