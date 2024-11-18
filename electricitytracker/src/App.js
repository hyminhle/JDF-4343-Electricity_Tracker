import React from 'react';
import LineGraph from './components/LineGraph';
import FileUpload from './components/FileUpload';
import "./App.css"; 

function App() {
  return (
    <div>
      <h1>Line Graph</h1>
      <FileUpload />  {/* Add the FileUpload component */}
      <LineGraph />
    </div>
  );
}

export default App;