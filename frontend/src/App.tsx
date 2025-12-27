import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Watch } from './pages/Watch';
import { History } from './pages/History';
import { Browse } from './pages/Browse';
import { MyList } from './pages/MyList';
import { Account } from './pages/Account';
import { BottomNav } from './components/BottomNav';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/mylist" element={<MyList />} />
        <Route path="/history" element={<History />} />
        <Route path="/account" element={<Account />} />
        <Route path="/watch/:id" element={<Watch />} />
      </Routes>
      
      {/* Automatically appears on mobile, hidden on desktop */}
      <BottomNav />
    </>
  );
}

export default App;