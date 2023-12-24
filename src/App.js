import './App.css';
import EnhancedTable from './components/EnhancedTable';
import { sampleData } from './common/sampleData'
import { fields } from './common/sampleData'

function App() {
  return (
    <div className="App">
      <EnhancedTable data={sampleData} fields={fields} />
    </div>
  );
}

export default App;
