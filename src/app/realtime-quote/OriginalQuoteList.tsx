"use client";

// [원본] 싱글스레드 — 메인 스레드에서 직접 포맷 처리 후 setState
// 모든 작업(포맷 + 렌더)이 메인 스레드에서 실행됨

import { useEffect, useRef, useState } from "react";
import { startMockQuoteStream } from "./mock";
import type { QuoteItem, WorkerOutput } from "./worker";
import { QuoteRow } from "./QuoteRow";

function formatQuotes(payload: QuoteItem[]): WorkerOutput {
  return {
    formatted: payload.map((item) => ({
      price: item.price.toLocaleString("ko-KR"),
      volume: item.volume.toLocaleString("ko-KR"),
      changeRate: `${item.changeRate >= 0 ? "+" : ""}${item.changeRate.toFixed(2)}%`,
    })),
  };
}

export function OriginalQuoteList() {
  const [quoteOutput, setQuoteOutput] = useState<WorkerOutput | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const renderCount = useRef(0);
  renderCount.current++;

  useEffect(() => {
    const stop = startMockQuoteStream((payload) => {
      setQuoteOutput(formatQuotes(payload)); // 메인 스레드에서 포맷 + setState
    });

    return stop;
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4 mb-2">
        <p className="text-xs text-gray-400">
          renders: <span className="text-yellow-400">{renderCount.current}</span>
        </p>
        <button
          onClick={() => setClickCount((c) => c + 1)}
          className="px-3 py-1 text-xs bg-yellow-600 hover:bg-yellow-500 rounded"
        >
          클릭
        </button>
        <p className="text-xs text-gray-400">
          clicks: <span className="text-white">{clickCount}</span>
        </p>
      </div>
      {quoteOutput?.formatted.map((item, index) => (
        <QuoteRow key={index} item={item} />
      ))}
    </div>
  );
}
