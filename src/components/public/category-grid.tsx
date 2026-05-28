import { COMPLAINT_CATEGORIES } from "@/lib/constants";
import { HighwayCategoryCard } from "@/components/highway/highway-category-card";

export function CategoryGrid({ poleCode }: { poleCode: string }) {
  return (
    <div>
      <p className="label-micro mb-3">Report Maintenance Issue</p>
      <div className="grid grid-cols-2 gap-2.5">
        {COMPLAINT_CATEGORIES.map((cat, i) => (
          <HighwayCategoryCard
            key={cat.id}
            href={`/p/${poleCode}/report?category=${cat.id}`}
            label={cat.label}
            categoryId={cat.id}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
