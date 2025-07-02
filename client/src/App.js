import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await axios.get('/api/files');
      setFiles(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch files');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'test-user');

    try {
      await axios.post('/api/files', formData);
      setFile(null);
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/files/${id}`);
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>📁 Upload File to S3</h2>
      
      <form 
        onSubmit={handleUpload}
        style={{
          border: '1px solid #ddd',
          padding: '1.5rem',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          marginBottom: '2rem'
        }}
      >
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            display: 'block',
            marginBottom: '1rem'
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Upload
        </button>
      </form>

      <h3 style={{ marginBottom: '1rem' }}>🗂 Uploaded Files</h3>
      {files.length === 0 ? (
        <p style={{ color: '#888' }}>No files uploaded yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {files.map((f) => (
            <li
              key={f._id}
              style={{
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong>{f.originalName}</strong><br />
                <small style={{ color: '#666' }}>{f.key}</small>
              </div>
              <button
                onClick={() => handleDelete(f._id)}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
