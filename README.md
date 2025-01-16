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
