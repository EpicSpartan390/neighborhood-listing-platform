interface HouseSponsorFallbackProps {
  placementLabel?: string;
}

export default function HouseSponsorFallback({
  placementLabel = "this property",
}: HouseSponsorFallbackProps) {
  return (
    <aside
      aria-label="Community message"
      className="rounded-2xl border border-dashed border-slate-600 bg-slate-900 p-6 text-slate-100"
    >
      <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">
        Community Message
      </p>

      <h3 className="mt-2 text-xl font-bold">
        No local sponsor is available
      </h3>

      <p className="mt-2 leading-7 text-slate-300">
        Continue exploring {placementLabel}. This is a house
        message from the neighborhood listing platform, not a
        paid or sponsored placement.
      </p>
    </aside>
  );
}