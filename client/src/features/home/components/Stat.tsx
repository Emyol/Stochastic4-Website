export default function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 transition-colors hover:border-[#2c8fd5]/60">
      <p className="font-display text-3xl text-[#16224a] leading-none">{value}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </div>
  );
}
