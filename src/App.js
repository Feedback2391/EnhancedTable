import './App.css';
import EnhancedTable from './EnhancedTable';
import { sampleData } from './common/sampleData'

function App() {
  /*const sampleData = [
    { id: 1, name: "John Doe", age: 25, city: "New York" },
    { id: 2, name: "Jane Smith", age: 30, city: "San Francisco" },
    // Add more rows as needed
  ];*/

  const columns = [
    { id: "eeid", label: "EEID" },
    { id: "fullName", label: "Full Name" },
    { id: "jobTitle", label: "Job Title" },
    { id: "department", label: "Department" },
    { id: "businessUnit", label: "Business Unit" },
    { id: "gender", label: "Gender" },
    { id: "ethnicity", label: "Ethnicity" },
    { id: "age", label: "Age" },
    { id: "hireDate", label: "Hire Date" },
    { id: "annualSalary", label: "Annual Salary" },
    { id: "bonus%", label: "Bonus %" },
    { id: "country", label: "Country" },
    { id: "city", label: "City" },
    { id: "exitDate", label: "Exit Date" },
  ];

  return (
    <div className="App">
      <EnhancedTable data={sampleData} columns={columns} />
    </div>
  );
}

export default App;
