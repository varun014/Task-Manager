const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-teal-100 border-t-sea" />
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
};

export default Loader;
