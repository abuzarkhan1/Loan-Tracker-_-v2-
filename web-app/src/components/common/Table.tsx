import React from "react";
import { cn } from "../../lib/cn";
import LoadingState from "./LoadingState";

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyComponent?: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  className,
  isLoading = false,
  isEmpty = false,
  emptyComponent,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-appBorder bg-appCard shadow-level1">
      <table className={cn("w-full min-w-[600px] border-collapse text-left text-sm text-appText", className)}>
        <thead className="border-b border-appBorder bg-appSurface text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-appBorder">
          {isLoading && (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12">
                <LoadingState message="Loading records..." />
              </td>
            </tr>
          )}
          
          {!isLoading && isEmpty && (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center">
                {emptyComponent || (
                  <p className="text-sm font-medium text-appMuted">No records found.</p>
                )}
              </td>
            </tr>
          )}

          {!isLoading && !isEmpty && children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
