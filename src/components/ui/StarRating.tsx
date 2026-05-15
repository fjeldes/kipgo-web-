import { Star } from "lucide-react";

export function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} className={s <= rating ? 'fill-current' : ''} style={{ color: s <= rating ? '#9f4200' : '#e2e2e2' }} />
      ))}
    </div>
  );
}
