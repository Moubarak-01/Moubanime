import { Navbar } from '../components/Navbar';

export const Account = () => {
  const clearData = (key: string) => {
    if (confirm('Are you sure you want to clear this?')) {
      localStorage.removeItem(key);
      alert('Data cleared!');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Account Settings</h1>
        
        <div className="bg-[#1a1c21] rounded-xl p-6 space-y-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Clear History</h3>
              <p className="text-gray-400 text-sm">Remove all watched episodes progress.</p>
            </div>
            <button 
              onClick={() => clearData('watch-history')}
              className="bg-red-900/30 text-red-500 border border-red-900 px-4 py-2 rounded hover:bg-red-900/50 transition"
            >
              Clear
            </button>
          </div>

          <div className="w-full h-px bg-gray-700"></div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Clear My List</h3>
              <p className="text-gray-400 text-sm">Remove all saved anime from your list.</p>
            </div>
            <button 
              onClick={() => clearData('my-list')}
              className="bg-red-900/30 text-red-500 border border-red-900 px-4 py-2 rounded hover:bg-red-900/50 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};