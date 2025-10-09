export default function LoadingSkeleton({ type = "list" }) {
  if (type === "list") {
    return (
      <div className="animate-pulse bg-white p-4 rounded-lg shadow min-w-[250px]">
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse bg-gray-100 p-3 rounded shadow-sm h-8"></div>
  );
}
