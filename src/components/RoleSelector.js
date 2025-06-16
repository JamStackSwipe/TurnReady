import React from 'react';

const RoleSelector = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border rounded px-3 py-2"
  >
    <option value="client">Client</option>
    <option value="tech">Tech</option>
    <option value="admin">Admin</option>
  </select>
);

export default RoleSelector;
