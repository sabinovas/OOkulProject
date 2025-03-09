import React from "react";

export const SummaryTable = ({ summary }) => {
  return (
    <div>
      <h3>Summary Table</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Element Type</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary).map(([type, count]) => (
            <tr key={type}>
              <td>{type}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
