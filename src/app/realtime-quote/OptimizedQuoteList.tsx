"use client";

// [개선] Worker 결과를 ref에 버퍼링 → requestAnimationFrame에서만 setState
//
// 개선 포인트:
//  1. Worker 메시지가 아무리 빨리 와도 setState는 최대 ~60fps로 제한
//  2. Worker 생성과 스트림 시작을 하나의 useEffect로 합쳐 의존 관계 명확화
//  3. cancelAnimationFrame으로 rAF 루프 정리 추가
//
// 실제 효과: 목 데이터가 33ms(30fps)이면 차이가 작지만,
// 실제 시세처럼 5~10ms(100~200fps)로 빠른 경우 rAF가 렌더를 60fps로 압축함

import { useEffect, useRef, useState } from "react";
import { startMockQuoteStream } from "./mock";
import type { WorkerInput, WorkerOutput } from "./worker";
import { QuoteRow } from "./QuoteRow";

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return `${String(h).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function OptimizedQuoteList() {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<WorkerOutput | null>(null); // 최신 워커 결과 버퍼
  const rafRef = useRef<number>(0);
  const [quoteOutput, setQuoteOutput] = useState<WorkerOutput | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const renderCount = useRef(0);
  const startTimeRef = useRef(Date.now());
  const resultRef = useRef<Record<number, number>>({
    10000: 0,
    30000: 0,
    60000: 0,
  });
  
  renderCount.current++;

  useEffect(() => {
    const worker = new Worker(
      new URL("./worker.ts", import.meta.url),
    );
    workerRef.current = worker;

    // setState 대신 ref에만 저장 → 렌더 미발생
    worker.onmessage = (event: MessageEvent<WorkerOutput>) => {
      pendingRef.current = event.data;
    };

    // rAF 루프: 새 데이터가 있을 때만 setState
    const tick = () => {
      // console.group(`raf Tick ${renderCount.current}|${rafRef.current}`);
      // console.log(pendingRef.current);
      
      if (pendingRef.current !== null) {
        setQuoteOutput(pendingRef.current);
        pendingRef.current = null;
      }

      // console.log(`current frame scheduled: ${renderCount.current}|${rafRef.current}`);
      rafRef.current = requestAnimationFrame(tick);
      
      // console.log(`next frame scheduled: ${renderCount.current}|${rafRef.current}`);
      // console.groupEnd();
    };
    rafRef.current = requestAnimationFrame(tick);

    const stop = startMockQuoteStream((payload) => {
      worker.postMessage({ type: "PROCESS", payload } satisfies WorkerInput);
    });

    return () => {
      worker.terminate();
      cancelAnimationFrame(rafRef.current);
      stop();
    };
  }, []);

  const elapsed = Date.now() - startTimeRef.current;

  console.log(elapsed);

  if (elapsed >= 10000 || elapsed >= 30000 || elapsed >= 60000) {
    console.log(`elapsed: ${elapsed}ms, renders: ${renderCount.current}`);
    
    const closedElapsed = Math.floor(elapsed / 10000) * 10000;

    if (elapsed % 10000 >= 0 && !resultRef.current[closedElapsed]) {
      resultRef.current[closedElapsed] = renderCount.current;
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4 mb-2">
        <p className="text-xs text-gray-400">
          elapsed: <span className="text-green-400">{formatElapsed(Date.now() - startTimeRef.current)}</span>
        </p>
        <p className="text-xs text-gray-400">
          renders: <span className="text-green-400">{renderCount.current}</span>
        </p>
        <button
          onClick={() => setClickCount((c) => c + 1)}
          className="px-3 py-1 text-xs bg-green-700 hover:bg-green-600 rounded"
        >
          클릭
        </button>
        <p className="text-xs text-gray-400">
          clicks: <span className="text-white">{clickCount}</span>
        </p>
        <p className="text-xs text-gray-400">
          10s: <span className="text-white">{resultRef.current[10000]}</span>
        </p>
        <p className="text-xs text-gray-400">
          30s: <span className="text-white">{resultRef.current[30000]}</span>
        </p>
        <p className="text-xs text-gray-400">
          60s: <span className="text-white">{resultRef.current[60000]}</span>
        </p>
      </div>
      {quoteOutput?.formatted.map((item, index) => (
        <QuoteRow key={index} item={item} />
      ))}
    </div>
  );
}
