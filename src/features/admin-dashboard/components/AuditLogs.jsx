import React from 'react';

const AuditLogs = ({ data, loading, error }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div
      className="shadow-md rounded-lg overflow-hidden"
      style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
    >
      <table className="min-w-full divide-y divide-border">
        <thead style={{ backgroundColor: 'hsl(var(--muted))' }}>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }} className="divide-y divide-border">
          {data && data.map((log) => (
            <tr key={log.id}>
              <td className="px-6 py-4 whitespace-nowrap">{log.timestamp}</td>
              <td className="px-6 py-4 whitespace-nowrap">{log.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;
