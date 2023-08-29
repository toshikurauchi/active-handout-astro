export type AddTelemetryEvent = CustomEvent<{
  pageId: string;
  slug: string;
  type: string;
  percentComplete: number;
  data: any;
}>;
export type RetrieveTelemetryEvent = CustomEvent<{
  pageId: string;
  slug: string;
}>;
export type RetrievedTelemetryEvent = CustomEvent<{
  pageId: string;
  slug: string;
  data: any;
}>;
export type ClearTelemetryEvent = CustomEvent<{
  pageId: string;
  slug?: string | undefined;
}>;
interface CustomEventMap {
  AddTelemetry: AddTelemetryEvent;
  RetrieveTelemetry: RetrieveTelemetryEvent;
  RetrievedTelemetry: RetrievedTelemetryEvent;
  ClearTelemetry: ClearTelemetryEvent;
}

declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
  }
}

export function dispatchAddTelemetry(
  pageId: string,
  slug: string,
  type: string,
  percentComplete: number,
  data: any
) {
  if (!pageId) throw new Error("pageId is required");
  if (!slug) throw new Error("slug is required");
  if (!type) throw new Error("type is required");
  if (!percentComplete) throw new Error("percentComplete is required");
  if (percentComplete < 0 || percentComplete > 100)
    throw new Error("percentComplete must be between 0 and 100");
  const event = new CustomEvent("AddTelemetry", {
    detail: {
      pageId,
      slug,
      type,
      percentComplete,
      data,
    },
  });
  document.dispatchEvent(event);
}

export function dispatchRetrieveTelemetry(pageId: string, slug: string) {
  if (!pageId) throw new Error("pageId is required");
  if (!slug) throw new Error("slug is required");
  const event = new CustomEvent("RetrieveTelemetry", {
    detail: {
      pageId,
      slug,
    },
  });
  document.dispatchEvent(event);
}

export function dispatchRetrievedTelemetry(
  pageId: string,
  slug: string,
  data: any
) {
  if (!pageId) throw new Error("pageId is required");
  if (!slug) throw new Error("slug is required");
  const event = new CustomEvent("RetrievedTelemetry", {
    detail: {
      pageId,
      slug,
      data,
    },
  });
  document.dispatchEvent(event);
}

export function dispatchClearTelemetry(pageId: string, slug?: string) {
  if (!pageId) throw new Error("pageId is required");
  const event = new CustomEvent("ClearTelemetry", {
    detail: {
      pageId,
      slug,
    },
  });
  document.dispatchEvent(event);
}
