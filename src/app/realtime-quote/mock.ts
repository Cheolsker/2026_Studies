import type { WorkerInput } from "./worker";

export const startMockQuoteStream = (
  onData: (payload: WorkerInput["payload"]) => void,
) => {
  const intervalId = setInterval(() => {
    const basePrice = 75000;
    const payload = Array.from({ length: 10 }, (_, index) => ({
      price: basePrice + (index - 5) * 100,
      volume: Math.floor(Math.random() * 10000),
      changeRate: (Math.random() - 0.5) * 4,
    }));
    onData(payload);
  }, 33);

  return () => clearInterval(intervalId);
};
