import type { WorkerInput } from "./worker";

export const MOCK_QUOTE_COUNT = 500;

export const startMockQuoteStream = (
  onData: (payload: WorkerInput["payload"]) => void,
) => {
  const intervalId = setInterval(() => {
    const basePrice = 75000;
    const payload = Array.from({ length: MOCK_QUOTE_COUNT }, (_, index) => ({
      price: basePrice + (index - 5) * 100,
      volume: Math.floor(Math.random() * 10000),
      changeRate: (Math.random() - 0.5) * 4,
    }));
    onData(payload);
  }, 100);

  return () => clearInterval(intervalId);
};
