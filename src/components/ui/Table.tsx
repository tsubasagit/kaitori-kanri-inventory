type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  className?: string;
};

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "データがありません",
  className = "",
}: TableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-medium text-secondary ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-secondary"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 ${col.className ?? ""}`}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
