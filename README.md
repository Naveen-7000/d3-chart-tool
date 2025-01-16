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

import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

const EditableTable = ({ initialData = [] }) => {
  // Enhanced utility function to detect value type
  const detectValueType = (value) => {
    if (value === null || value === undefined) return 'text';
    
    switch (typeof value) {
      case 'number':
        return 'number';
      case 'boolean':
        return 'checkbox';
      case 'object':
        if (value instanceof Date) return 'date';
        if (Array.isArray(value)) return 'text'; // Convert arrays to string
        return 'text'; // Convert objects to string
      default:
        return 'text';
    }
  };

  // Format value for display
  const formatValue = (value, type) => {
    if (value === null || value === undefined) return '';
    
    switch (type) {
      case 'date':
        return value instanceof Date ? value.toISOString().split('T')[0] : value;
      case 'object':
      case 'array':
        return JSON.stringify(value);
      default:
        return String(value);
    }
  };

  // Enhanced utility function to generate columns from data
  const generateColumnsFromData = (data) => {
    // Handle empty or invalid data
    if (!Array.isArray(data) || data.length === 0) {
      return [{
        id: 'empty',
        label: 'Empty',
        type: 'text'
      }];
    }

    // Collect all possible keys and their types from all objects
    const keyTypes = new Map();
    
    data.forEach(item => {
      // Handle non-object items
      if (typeof item !== 'object' || item === null) {
        keyTypes.set('value', detectValueType(item));
        return;
      }

      // Process object items
      Object.entries(item).forEach(([key, value]) => {
        if (key === 'id') return; // Skip id field
        
        const currentType = keyTypes.get(key);
        const newType = detectValueType(value);
        
        // If types conflict, default to text
        if (currentType && currentType !== newType) {
          keyTypes.set(key, 'text');
        } else if (!currentType) {
          keyTypes.set(key, newType);
        }
      });
    });

    // Convert collected keys and types to column objects
    return Array.from(keyTypes.entries()).map(([key, type]) => ({
      id: key,
      label: key.split(/(?=[A-Z])|_/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' '),
      type: type
    }));
  };

  // Normalize data to ensure consistent structure
  const normalizeData = (rawData) => {
    if (!Array.isArray(rawData)) {
      rawData = [rawData];
    }

    return rawData.map((item, index) => {
      // Handle primitive values
      if (typeof item !== 'object' || item === null) {
        return {
          id: index + 1,
          value: item
        };
      }

      // Handle objects without id
      return {
        id: item.id || index + 1,
        ...item
      };
    });
  };

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [editCell, setEditCell] = useState({ rowId: null, column: null });
  const [newColumnName, setNewColumnName] = useState('');
  const [showAddColumn, setShowAddColumn] = useState(false);

  // Initialize data and columns
  useEffect(() => {
    const normalizedData = normalizeData(initialData);
    setData(normalizedData);
    const generatedColumns = generateColumnsFromData(normalizedData);
    setColumns(generatedColumns);
  }, [initialData]);

  // Generate unique ID for new rows
  const generateId = () => Math.max(...data.map(row => row.id), 0) + 1;

  // Add new row with current column structure
  const addRow = () => {
    const newRow = {
      id: generateId(),
      ...Object.fromEntries(columns.map(col => [col.id, '']))
    };
    setData([...data, newRow]);
  };

  // Handle cell value change with type conversion
  const handleCellChange = (e, rowId, columnId) => {
    const column = columns.find(col => col.id === columnId);
    let value = e.target.value;
    
    // Convert value based on column type
    switch (column.type) {
      case 'number':
        value = value === '' ? '' : Number(value);
        break;
      case 'checkbox':
        value = e.target.checked;
        break;
      case 'date':
        value = value === '' ? '' : new Date(value);
        break;
      default:
        break;
    }

    const newData = data.map(row => {
      if (row.id === rowId) {
        return { ...row, [columnId]: value };
      }
      return row;
    });
    setData(newData);
  };

  // Add new column with type inference
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

  // Update table with new data
  const updateTableData = (newData) => {
    const normalizedData = normalizeData(newData);
    setData(normalizedData);
    const newColumns = generateColumnsFromData(normalizedData);
    setColumns(newColumns);
  };

  // Rest of the component remains the same...
  return (
    <div className="p-4">
      {/* ... existing JSX code ... */}
    </div>
  );
};

export default EditableTable;
