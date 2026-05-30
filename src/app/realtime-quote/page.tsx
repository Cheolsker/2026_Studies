import { OriginalQuoteList } from "./OriginalQuoteList";
import { OptimizedQuoteList } from "./OptimizedQuoteList";

export default function RealtimeQuotePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-xl font-bold mb-2">실시간 시세 최적화 스터디</h1>
      <p className="text-sm text-gray-400 mb-8">
        Web Worker + requestAnimationFrame 렌더 최적화
      </p>
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="font-bold mb-1">Original</h2>
          <p className="text-xs text-gray-400 mb-4">
            Worker 메시지 → 직접 setState (렌더 횟수 = 메시지 수)
          </p>
          <OriginalQuoteList />
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="font-bold mb-1">Optimized (rAF)</h2>
          <p className="text-xs text-gray-400 mb-4">
            Worker 메시지 → ref 버퍼 → rAF에서만 setState (최대 ~60fps)
          </p>
          <OptimizedQuoteList />
        </div>
      </div>
    </div>
  );
}
