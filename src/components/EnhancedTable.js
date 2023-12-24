import React, { useState, useEffect } from "react";
import '../styles/EnhancedTable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const EnhancedTable = ({ data, fields }) => {
  const [sortedField, setSortedField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredData, setFilteredData] = useState(data);
  const [filters, setFilters] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [visibleFields, setVisibleFields] = useState(() => {
    try {
      const storedFields = localStorage.getItem("visibleFields");
      return storedFields
        ? JSON.parse(storedFields)
        : fields?.map((col) => col.id);
    } catch (error) {
      console.error("Error parsing visibleFields from localStorage", error);
      return fields?.map((col) => col.id);
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust the number of items per page as needed


  useEffect(() => {
    // Apply sorting
    if (sortedField) {
      const orderMultiplier = sortOrder === "asc" ? 1 : -1;
      const sortedData = [...filteredData].sort((a, b) =>
        a[sortedField] > b[sortedField] ? orderMultiplier : -orderMultiplier
      );
      setFilteredData(sortedData);
    } else {
      setFilteredData(data);
    }
  }, [data, sortedField, sortOrder]);


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
    // Persist visible fields
    localStorage.setItem("visibleFields", JSON.stringify(visibleFields));
  }, [visibleFields]);



  const handleSort = (field) => {
    if (sortedField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortedField(field);
      setSortOrder("asc");
    }
  };


  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  };


  const handleClearFilters = () => {
    setFilters({});
  };


  const handleToggleFieldVisibility = (field) => {
    setVisibleFields((prevVisibleFields) =>
      prevVisibleFields.includes(field)
        ? prevVisibleFields?.filter((col) => col !== field)
        : [...prevVisibleFields, field]
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
    <div style={{ backgroundColor: "#fff8dc", height: "100vh" }}>
      <div className="header">
        {/* Field Visibility Modal */}
        <div style={{ margin: "15px" }}>
          <button
            className="button"
            style={{
              width: "150px",
              height: "40px",
              backgroundColor: "#0d6efd",
              cursor: "pointer",
            }}
            onClick={() => {
              console.log("Field Visibility");
              setModalShow(true);
            }}
          >
            Field Visibility
          </button>
          {modalShow && (
            <div className="modal">
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  width: "400px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h2 style={{}}>Field Visibility</h2>
                  <button
                    style={{
                      width: "40px",
                      height: "40px",
                      marginLeft: "10px",
                      backgroundColor: "#dc3545",
                      padding: "10px",
                      alignSelf: "center",
                      justifySelf: "flex-end",
                      cursor: "pointer",
                    }}
                    className="button"
                    onClick={() => {
                      setModalShow(false);
                    }}
                  >
                    X
                  </button>
                </div>
                <hr />
                <ul
                  style={{
                    listStyle: "none",
                    padding: "0",
                    marginTop: "5px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  {fields?.map((field) => (
                    <li key={field.id}>
                      <h3
                        style={{
                          margin: "0px",
                          marginTop: "10px",
                          fontWeight: "normal",
                        }}
                      >
                        <label style={{ display: "flex", marginBottom: "5px" }}>
                          <input
                            type="checkbox"
                            checked={visibleFields.includes(field.id)}
                            onChange={() =>
                              handleToggleFieldVisibility(field.id)
                            }
                            style={{
                              marginLeft: "25px",
                              marginRight: "20px",
                              width: "20px",
                              height: "20px",
                              borderRadius: "10px",
                            }}
                          />

                          {field.label}
                        </label>
                      </h3>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Filter Clear Button */}
        <div style={{ margin: "15px" }}>
          <button
            className="button"
            style={{
              width: "150px",
              height: "40px",
              backgroundColor: "#dc3545",
              cursor: "pointer",
            }}
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table Header */}
      {/* <div
        style={{
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      > */}
      <div style={{ overflow: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {/* <th
              className="table-cell"
              style={{backgroundColor: "#ffe4e1"}}
            >
              Actions
            </th> */}
              {fields
                ?.filter((field) => visibleFields.includes(field.id))
                ?.map((field) => (
                  <th
                    key={field.id}
                    className="table-cell"
                    style={{
                      backgroundColor: "#ffe4e1",
                      height: "60px",
                      textAlign: "center",
                    }}
                  >
                    {field.label}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "5px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        {/* <FontAwesomeIcon icon="fa-brands fa-twitter" size="sm" /> */}
                        <input
                          type="text"
                          value={filters[field.id] || ""}
                          onChange={(e) =>
                            handleFilterChange(field.id, e.target.value)
                          }
                          style={{ width: "90%", height: "20px" }}
                        />
                      </div>
                      <button
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSort(field.id)}
                      >
                        {sortedField === field.id && sortOrder === "asc"
                          ? "▲"
                          : "▼"}
                      </button>
                    </div>
                  </th>
                ))}
            </tr>
          </thead>

          <tbody style={{}}>
            {paginatedData?.map((row) => (
              <tr key={row.EEID}>
                {/* <td
                className="table-cell"
                style={{backgroundColor: "#f8f8ff"}}
              >
                <button onClick={() => console.log("Row actions", row)}>
                  Action
                </button>
              </td> */}
                {fields
                  ?.filter((field) => visibleFields.includes(field.id))
                  ?.map((field) => (
                    <td
                      key={field.id}
                      className="table-cell"
                      style={{ backgroundColor: "#f8f8ff" }}
                    >
                      {row[field.id]}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* </div> */}

      {/* Pagination */}
      <div style={{ marginTop: "20px" }}>
        <button
          style={{ marginRight: "5px", cursor: "pointer" }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>{`Page ${currentPage} of ${Math.ceil(
          filteredData?.length / itemsPerPage
        )}`}</span>

        <button
          style={{ marginLeft: "5px", cursor: "pointer" }}
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
