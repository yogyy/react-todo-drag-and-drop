import './App.css';
import Column from '@/components/layout/column';

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="flex items-center justify-center w-full h-20 mb-12 bg-secondary">
        <h1 className="text-3xl font-semibold">To DOoooooooooooo</h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full md:flex-row md:items-start">
        <Column variant="planned" state="PLANNED" />
        <Column variant="ongoing" state="ONGOING" />
        <Column variant="done" state="DONE" />
      </div>
    </div>
  );
}

export default App;
