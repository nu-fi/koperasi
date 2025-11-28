import { Outlet } from 'react-router-dom';
import CollapsibleSidebar from '../components/CollapsibleSidebar'; // Adjust path to where you saved the sidebar

const DashboardLayout = () => {
  return (
    // 'flex' makes the children (Sidebar + Content) sit side-by-side
    <div className="flex min-h-screen bg-gray-50">
      
      {/* 1. The Sidebar (Fixed on the left) */}
      <CollapsibleSidebar />

      {/* 2. The Content Area (Takes remaining space) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* You can add a top header here if you want */}
        
        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> 
        </main>
      </div>
      
    </div>
  );
};

export default DashboardLayout;