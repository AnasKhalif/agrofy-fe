function App() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto py-8">
        <div className="text-center space-y-6">
          <h1 className="text-hero-h1 text-primary">Agrofy Frontend</h1>
          <p className="text-body-l text-muted max-w-2xl mx-auto">
            Modern React + TypeScript + Vite starter with Tailwind CSS, TanStack
            Query, React Router, and Radix UI components.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-white rounded-md hover:opacity-90 transition-opacity">
              Get Started
            </button>
            <button className="px-6 py-3 border border-border rounded-md hover:bg-lighthover transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
