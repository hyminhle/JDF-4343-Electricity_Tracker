import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [juneFile, setJuneFile] = useState(null);
  const [julyFile, setJulyFile] = useState(null);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  
  const handleJuneFileChange = (event) => {
    setJuneFile(event.target.files[0]);
    setError('');
    setUploadSuccess('');
  };
  
  const handleJulyFileChange = (event) => {
    setJulyFile(event.target.files[0]);
    setError('');
    setUploadSuccess('');
  };
  
  const handleJuneFileUpload = async () => {
    if (!juneFile) {
      setError("Please select a June file to upload");
      return;
    }
    
    const formData = new FormData();
    formData.append('file', juneFile);

    try {
      const response = await axios.post('http://localhost:5000/upload_june', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadSuccess('June data uploaded successfully!');
      console.log(response.data);
    } catch (err) {
      setError('Error uploading June file');
      console.error(err);
    }
  };

  const handleJulyFileUpload = async () => {
    if (!julyFile) {
      setError("Please select a July file to upload");
      return;
    }
    
    const formData = new FormData();
    formData.append('file', julyFile);

    try {
      const response = await axios.post('http://localhost:5000/upload_july', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadSuccess('July data uploaded successfully!');
      console.log(response.data);
    } catch (err) {
      setError('Error uploading July file');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Upload June Data</h2>
      <input type="file" onChange={handleJuneFileChange} />
      <button onClick={handleJuneFileUpload}>Upload June CSV</button>

      <h2>Upload July Data</h2>
      <input type="file" onChange={handleJulyFileChange} />
      <button onClick={handleJulyFileUpload}>Upload July CSV</button>
      
      {uploadSuccess && <div style={{ color: 'green' }}>{uploadSuccess}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default FileUpload;
