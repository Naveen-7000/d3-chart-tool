# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
<img width="959" alt="image" src="https://github.com/user-attachments/assets/ded64a01-e57b-4f77-8acd-a78b9cad91fc">

110%

<img width="959" alt="image" src="https://github.com/user-attachments/assets/9dde165b-ce8b-4608-9b1a-7e833f7f70b1">

100%

<img width="959" alt="image" src="https://github.com/user-attachments/assets/e3c3decb-ea99-403e-9bc8-a36476614d72">

75%
<img width="959" alt="image" src="https://github.com/user-attachments/assets/92590fbc-1788-4fe8-9a85-18eb23678f9d">
50%


// Replace the className assignments in your React component with these:

return (
  <div className="table-container">
    <div className="button-group">
      <button onClick={addRow} className="btn btn-success">
        <Plus className="icon" /> Add Row
      </button>
      <button onClick={() => setShowAddColumn(true)} className="btn btn-primary">
        <Plus className="icon" /> Add Column
      </button>
    </div>

    {showAddColumn && (
      <div className="add-column-form fade-in">
        <input
          type="text"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="Enter column name"
        />
        <button onClick={addColumn} className="btn btn-success">
          Add
        </button>
        <button onClick={() => setShowAddColumn(false)} className="btn btn-gray">
          Cancel
        </button>
      </div>
    )}

    <div className="table-wrapper">
      <table className="editable-table">
        <thead>
          <tr>
            <th className="excel-header"></th>
            {columns.map((_, index) => (
              <th key={`col-${index}`} className="excel-header">
                {getColumnLabel(index)}
              </th>
            ))}
            <th className="excel-header"></th>
          </tr>
          <tr>
            <th className="column-header"></th>
            {columns.map((column) => (
              <th key={column.id} className="column-header">
                <div className="column-header-content">
                  {column.label}
                  {columns.length > 1 && (
                    <button 
                      onClick={() => deleteColumn(column.id)}
                      className="action-btn"
                    >
                      <Minus className="icon" />
                    </button>
                  )}
                </div>
              </th>
            ))}
            <th className="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id}>
              <td className="row-number">
                {rowIndex + 1}
              </td>
              {columns.map((column) => (
                <td 
                  key={`${row.id}-${column.id}`}
                  className="editable-cell"
                  onClick={() => handleCellClick(row.id, column.id)}
                >
                  {editCell.rowId === row.id && editCell.column === column.id ? (
                    <input
                      type={column.type}
                      value={row[column.id] || ''}
                      onChange={(e) => handleCellChange(e, row.id, column.id)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleBlur}
                      className="cell-input"
                      autoFocus
                    />
                  ) : (
                    row[column.id]
                  )}
                </td>
              ))}
              <td className="actions-cell">
                <button 
                  onClick={() => deleteRow(row.id)}
                  className="action-btn"
                >
                  <Trash2 className="icon" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* Container styles */
.table-container {
  padding: 1rem;
}

.table-container .button-group {
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
}

/* Button styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-success {
  background-color: #22c55e;
  color: white;
}

.btn-success:hover {
  background-color: #16a34a;
}

.btn-gray {
  background-color: #6b7280;
  color: white;
}

.btn-gray:hover {
  background-color: #4b5563;
}

/* Add column form styles */
.add-column-form {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.add-column-form input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

/* Table wrapper */
.table-wrapper {
  overflow-x: auto;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* Table styles */
.editable-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

/* Header styles */
.editable-table th {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  text-align: left;
  font-weight: 600;
}

.editable-table th.column-header {
  background-color: #f9fafb;
}

.editable-table th.excel-header {
  background-color: #f3f4f6;
  text-align: center;
  width: 3rem;
}

.editable-table th.actions-header {
  width: 4rem;
  background-color: #f9fafb;
}

/* Column header content */
.column-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

/* Cell styles */
.editable-table td {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
}

.editable-table td.row-number {
  background-color: #f3f4f6;
  text-align: center;
  font-weight: 500;
}

.editable-table td.editable-cell {
  cursor: pointer;
}

.editable-table td.actions-cell {
  text-align: center;
}

/* Input styles */
.cell-input {
  width: 100%;
  padding: 0.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.cell-input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}

/* Action button styles */
.action-btn {
  padding: 0.25rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #ef4444;
  transition: color 0.2s;
}

.action-btn:hover {
  color: #dc2626;
}

/* Icons */
.icon {
  width: 1rem;
  height: 1rem;
  display: inline-block;
}

/* Hover effects */
.editable-table tbody tr:hover {
  background-color: #f9fafb;
}

/* Empty state */
.empty-state {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .table-wrapper {
    margin: 0 -1rem;
    border-radius: 0;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .add-column-form {
    flex-direction: column;
  }
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.2s ease-in;
}
import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

const EditableTable = () => {
  // Utility function to convert number to Excel-like column labels
  const getColumnLabel = (num) => {
    let label = '';
    while (num >= 0) {
      label = String.fromCharCode(65 + (num % 26)) + label;
      num = Math.floor(num / 26) - 1;
    }
    return label;
  };

  // Utility function to generate columns from data
  const generateColumnsFromData = (data) => {
    if (!data || data.length === 0) return [];
    
    // Get all unique keys from all objects in data array
    const keys = [...new Set(data.reduce((acc, obj) => {
      return [...acc, ...Object.keys(obj)];
    }, []))];

    // Filter out 'id' field and create column objects
    return keys
      .filter(key => key !== 'id')
      .map(key => ({
        id: key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), // Convert snake_case to Title Case
        type: typeof data[0][key] === 'number' ? 'number' : 'text'
      }));
  };

  // Initial data structure
  const initialData = [
    { id: 1, date: 'Jan 25', item: 'TV', value: 14 },
    { id: 2, date: 'Jan 25', item: 'Washing Machine', value: 7 },
    { id: 3, date: 'Jan 25', item: 'Mobile', value: 11 }
  ];

  const [data, setData] = useState(initialData);
  const [columns, setColumns] = useState([]);
  const [editCell, setEditCell] = useState({ rowId: null, column: null });
  const [newColumnName, setNewColumnName] = useState('');
  const [showAddColumn, setShowAddColumn] = useState(false);

  // Initialize columns from data on component mount
  useEffect(() => {
    const generatedColumns = generateColumnsFromData(data);
    setColumns(generatedColumns);
  }, []);

  // Generate unique ID for new rows
  const generateId = () => Math.max(...data.map(row => row.id), 0) + 1;

  // Handle cell click to enter edit mode
  const handleCellClick = (rowId, column) => {
    setEditCell({ rowId, column });
  };

  // Handle cell value change
  const handleCellChange = (e, rowId, columnId) => {
    const newData = data.map(row => {
      if (row.id === rowId) {
        return { ...row, [columnId]: e.target.value };
      }
      return row;
    });
    setData(newData);
  };

  // Handle key press events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setEditCell({ rowId: null, column: null });
    }
  };

  // Handle click outside to exit edit mode
  const handleBlur = () => {
    setEditCell({ rowId: null, column: null });
  };

  // Add new row
  const addRow = () => {
    const newRow = {
      id: generateId(),
      ...Object.fromEntries(columns.map(col => [col.id, '']))
    };
    setData([...data, newRow]);
  };

  // Delete row
  const deleteRow = (rowId) => {
    setData(data.filter(row => row.id !== rowId));
  };

  // Add new column
  const addColumn = () => {
    if (newColumnName.trim()) {
      const newColumnId = newColumnName.toLowerCase().replace(/\s+/g, '_');
      setColumns([...columns, { 
        id: newColumnId, 
        label: newColumnName,
        type: 'text'
      }]);
      
      const updatedData = data.map(row => ({
        ...row,
        [newColumnId]: ''
      }));
      setData(updatedData);
      
      setNewColumnName('');
      setShowAddColumn(false);
    }
  };

  // Delete column
  const deleteColumn = (columnId) => {
    if (columns.length > 1) {
      setColumns(columns.filter(col => col.id !== columnId));
      
      const updatedData = data.map(row => {
        const newRow = { ...row };
        delete newRow[columnId];
        return newRow;
      });
      setData(updatedData);
    }
  };

  // Update data and columns with new data
  const updateTableData = (newData) => {
    setData(newData);
    const newColumns = generateColumnsFromData(newData);
    setColumns(newColumns);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
        <button 
          onClick={addRow}
          className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <Plus size={16} /> Add Row
        </button>
        <button 
          onClick={() => setShowAddColumn(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus size={16} /> Add Column
        </button>
      </div>

      {showAddColumn && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Enter column name"
            className="px-3 py-2 border rounded"
          />
          <button 
            onClick={addColumn}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add
          </button>
          <button 
            onClick={() => setShowAddColumn(false)}
            className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-200 w-12"></th>
              {columns.map((_, index) => (
                <th key={`col-${index}`} className="border border-gray-300 p-2 bg-gray-200 text-center">
                  {getColumnLabel(index)}
                </th>
              ))}
              <th className="border border-gray-300 p-2 bg-gray-200 w-16"></th>
            </tr>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-100 w-12"></th>
              {columns.map((column) => (
                <th key={column.id} className="border border-gray-300 p-2 bg-gray-100">
                  <div className="flex items-center justify-between gap-2">
                    {column.label}
                    {columns.length > 1 && (
                      <button 
                        onClick={() => deleteColumn(column.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Minus size={16} />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="border border-gray-300 p-2 bg-gray-100 w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={row.id}>
                <td className="border border-gray-300 p-2 bg-gray-200 text-center font-medium">
                  {rowIndex + 1}
                </td>
                {columns.map((column) => (
                  <td 
                    key={`${row.id}-${column.id}`}
                    className="border border-gray-300 p-2"
                    onClick={() => handleCellClick(row.id, column.id)}
                  >
                    {editCell.rowId === row.id && editCell.column === column.id ? (
                      <input
                        type={column.type}
                        value={row[column.id] || ''}
                        onChange={(e) => handleCellChange(e, row.id, column.id)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        className="w-full p-1 border rounded"
                        autoFocus
                      />
                    ) : (
                      row[column.id]
                    )}
                  </td>
                ))}
                <td className="border border-gray-300 p-2">
                  <button 
                    onClick={() => deleteRow(row.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditableTable;
