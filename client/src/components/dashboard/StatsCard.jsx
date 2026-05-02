const StatsCard = ({ label, value, accent = 'from-teal-500 to-cyan-400' }) => {
  return (
    <article className="rounded-2xl border border-teal-100 bg-white p-5 shadow-card">
      <div className={`mb-3 h-2 w-20 rounded-full bg-gradient-to-r ${accent}`} />
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className="mt-1 text-3xl font-bold text-ink">{value}</h3>
    </article>
  );
};

export default StatsCard;
