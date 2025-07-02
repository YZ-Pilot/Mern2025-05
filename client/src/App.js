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
    <div style={{ padding: '2rem' }}>
      <h2>Upload File to S3</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      <h3>Uploaded Files</h3>
      <ul>
        {files.map((f) => (
          <li key={f._id}>
            {f.originalName} ({f.key})
            <button onClick={() => handleDelete(f._id)} style={{ marginLeft: '1rem' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
