import React, { useState, useEffect } from "react";

const EnhancedTable = ({ data, columns }) => {
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredData, setFilteredData] = useState(data);
  const [filters, setFilters] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const storedColumns = localStorage.getItem("visibleColumns");
      return storedColumns
        ? JSON.parse(storedColumns)
        : columns?.map((col) => col.id);
    } catch (error) {
      console.error("Error parsing visibleColumns from localStorage", error);
      return columns?.map((col) => col.id);
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust the number of items per page as needed

  useEffect(() => {
    // Apply sorting
    if (sortedColumn) {
      const orderMultiplier = sortOrder === "asc" ? 1 : -1;
      const sortedData = [...data].sort((a, b) =>
        a[sortedColumn] > b[sortedColumn] ? orderMultiplier : -orderMultiplier
      );
      setFilteredData(sortedData);
    } else {
      setFilteredData(data);
    }
  }, [data, sortedColumn, sortOrder]);

  useEffect(() => {
    // Apply filters
    const filtered = data?.filter((item) =>
      Object.keys(filters).every((key) => {
        const value = filters[key];
        return (
          value === "" ||
          String(item[key]).toLowerCase().includes(value.toLowerCase())
        );
      })
    );
    setFilteredData(filtered);
  }, [data, filters]);

  useEffect(() => {
    // Persist visible columns
    localStorage.setItem("visibleColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const handleSort = (column) => {
    if (sortedColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(column);
      setSortOrder("asc");
    }
  };

  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleToggleColumnVisibility = (column) => {
    setVisibleColumns((prevVisibleColumns) =>
      prevVisibleColumns.includes(column)
        ? prevVisibleColumns?.filter((col) => col !== column)
        : [...prevVisibleColumns, column]
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Column Visibility Modal */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => {console.log("Column Visibility");setModalShow(true)}}>
          Column Visibility
        </button>
        {modalShow && <div>
          <ul style={{ listStyle: "none", padding: "0", marginTop: "5px" }}>
          {columns?.map((column) => (
            <li key={column.id}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(column.id)}
                  onChange={() => handleToggleColumnVisibility(column.id)}
                />
                {column.label}
              </label>
            </li>
          ))}
        </ul>
        <button onClick={() => {console.log("Column Visibility");setModalShow(false)}}>
          Close
        </button>
        </div>}
      </div>
      
      {/* Filter Clear Button */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>

      {/* Table Header */}
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Actions
            </th>
            {columns?.map((column) => (
              <th
                key={column.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                {column.label}
                <button onClick={() => handleSort(column.id)}>
                  {sortedColumn === column.id && sortOrder === "asc"
                    ? "▲"
                    : "▼"}
                </button>
                <input
                  type="text"
                  value={filters[column.id] || ""}
                  onChange={(e) =>
                    handleFilterChange(column.id, e.target.value)
                  }
                  style={{ marginLeft: "5px" }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((row) => (
            <tr key={row.id}>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                <button onClick={() => console.log("Row actions", row)}>
                  Action
                </button>
              </td>
              {columns
                ?.filter((column) => visibleColumns.includes(column.id))
                ?.map((column) => (
                  <td
                    key={column.id}
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {row[column.id]}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "10px" }}>
        <button
          style={{ marginRight: "5px" }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${Math.ceil(
          filteredData?.length / itemsPerPage
        )}`}</span>
        
        {/* Pagination */}
        <button
          style={{ marginLeft: "5px" }}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredData?.length / itemsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EnhancedTable;
