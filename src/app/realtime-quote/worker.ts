export type QuoteItem = {
  price: number;
  volume: number;
  changeRate: number;
};

export type WorkerInput = {
  type: "PROCESS";
  payload: QuoteItem[];
};

export type FormattedItem = {
  price: string;
  volume: string;
  changeRate: string;
};

export type WorkerOutput = {
  formatted: FormattedItem[];
};

const workerSelf = self as unknown as DedicatedWorkerGlobalScope;

workerSelf.onmessage = (event: MessageEvent<WorkerInput>) => {
  const { type, payload } = event.data;

  if (type !== "PROCESS") return;

  const formatted: FormattedItem[] = payload.map((item) => ({
    price: item.price.toLocaleString("ko-KR"),
    volume: item.volume.toLocaleString("ko-KR"),
    changeRate: `${item.changeRate >= 0 ? "+" : ""}${item.changeRate.toFixed(2)}%`,
  }));

  workerSelf.postMessage({ formatted } satisfies WorkerOutput);
};

