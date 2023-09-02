import type { Reference, DataSnapshot } from "firebase-admin/database";

export function getData<T>(
  ref: Reference,
  fromJSON: (json: any) => T
): Promise<T | null> {
  return new Promise((resolve, reject) => {
    const onData = (snap: DataSnapshot | null) => {
      const val = snap?.val();
      return resolve(val ? fromJSON(val) : null);
    };
    const onError = (error: Error) => reject(error);

    ref.on("value", onData, onError);
  });
}

export function setData(ref: Reference, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const onComplete = (error: Error | null) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    };
    ref.set(data, onComplete);
  });
}

export function deleteData(ref: Reference): Promise<void> {
  return new Promise((resolve, reject) => {
    const onComplete = (error: Error | null) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    };
    ref.remove(onComplete);
  });
}

export function pushData(ref: Reference, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const onComplete = (error: Error | null) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    };
    ref.push(data, onComplete);
  });
}

export function updateData(ref: Reference, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const onComplete = (error: Error | null) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    };
    ref.update(data, onComplete);
  });
}

export function transactionUpdate(
  ref: Reference,
  updateFn: (data: any) => any
): Promise<void> {
  return new Promise((resolve, reject) => {
    const onComplete = (error: Error | null) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    };
    ref.transaction(updateFn, onComplete);
  });
}
