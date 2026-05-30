'use client';

import { OriginalQuoteList } from "./OriginalQuoteList";
import { OptimizedQuoteList } from "./OptimizedQuoteList";
import { MOCK_QUOTE_COUNT } from "./mock";
import { useState } from "react";

export default function RealtimeQuotePage() {
  const [optimized, setOptimized] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-xl font-bold">실시간 시세 최적화 스터디</h1>
        <button
          onClick={() => setOptimized((o) => !o)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded"
        >
          {optimized ? "원본 보기" : "최적화 보기"}
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-8">
        Web Worker + requestAnimationFrame 렌더 최적화
      </p>
      <div className="grid grid-cols-1 gap-8">
        {!optimized ? (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="font-bold mb-1">Original</h2>
            <p className="text-xs text-gray-400 mb-4">
              Worker 메시지 → 직접 setState (렌더 횟수 = 메시지 수) | 실시간 데이터 갯수: {MOCK_QUOTE_COUNT}
            </p>
            <OriginalQuoteList />
          </div>
        ) : (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="font-bold mb-1">Optimized (rAF)</h2>
          <p className="text-xs text-gray-400 mb-4">
            Worker 메시지 → ref 버퍼 → rAF에서만 setState (최대 ~60fps) | 실시간 데이터 갯수: {MOCK_QUOTE_COUNT}
          </p>
          <OptimizedQuoteList />
        </div>
        )}
      </div>
    </div>
  );
}
