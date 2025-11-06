"use client";
import { useEffect, useState } from "react";

export default function CallbackTestPage() {
  const [urlInfo, setUrlInfo] = useState<any>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const info = {
      fullUrl: window.location.href,
      search: window.location.search,
      code: urlParams.get("code"),
      state: urlParams.get("state"),
      error: urlParams.get("error"),
      allParams: Object.fromEntries(urlParams.entries())
    };
    setUrlInfo(info);
    console.log("Callback test - URL info:", info);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">OAuth Callback Test</h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">URL Information</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(urlInfo, null, 2)}
          </pre>
        </div>
        
        <div className="mt-6">
          <a 
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}