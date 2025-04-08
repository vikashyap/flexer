import { Suspense } from "react";
import "./App.css";

function App() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Flexer
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Showcase your crypto portfolio on-chain
          </p>
        </header>

        <Suspense
          fallback={<div className="text-center">Loading...</div>}
        ></Suspense>
      </div>
    </main>
  );
}

export default App;
