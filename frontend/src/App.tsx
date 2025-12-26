import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [status, setStatus] = useState<string>('Connecting...');

  useEffect(() => {
    // This asks the backend (port 3000) for data
    axios.get('http://localhost:3000')
      .then((response) => {
        setStatus(response.data);
      })
      .catch((error) => {
        setStatus('Error connecting to backend');
        console.error(error);
      });
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-orange-500 mb-4">
          My Anime App
        </h1>
        <p className="text-xl text-gray-300">
          Backend Status: <span className="font-mono text-green-400">{status}</span>
        </p>
      </div>
    </div>
  );
}

export default App;