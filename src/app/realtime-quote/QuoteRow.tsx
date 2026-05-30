import type { WorkerOutput } from "./worker";

type Props = {
  item: WorkerOutput["formatted"][number];
};

export function QuoteRow({ item }: Props) {
  const isPositive = item.changeRate.startsWith("+");
  return (
    <div className="flex gap-4 text-sm font-mono">
      <span className="w-20 text-right">{item.price}</span>
      <span className="w-24 text-right text-gray-400">{item.volume}</span>
      <span className={isPositive ? "text-red-400" : "text-blue-400"}>
        {item.changeRate}
      </span>
    </div>
  );
}
