import React from "react";

export const DetailsTable = ({ details }) => {
  return (
    <div>
      <h3>Details Table</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Element Type</th>
            <th>Total Length</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{item.totalLength}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
