import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import PageLoader from "./common/PageLoader";

export default function Layout({ children, loading = false }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar at top of main */}
        <Navbar />

        {/* Page content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {loading ? <PageLoader /> : children}
        </main>
      </div>
    </div>
  );
}
