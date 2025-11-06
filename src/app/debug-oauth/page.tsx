"use client";
import { useState } from "react";

export default function DebugOAuthPage() {
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[OAuth Debug] ${message}`);
  };

  const testOAuthUrl = () => {
    const CLIENT_ID = "1589";
    const REDIRECT_URI = "http://localhost:3000/";
    const state = Math.random().toString(36).substring(2, 15);
    
    const oauthUrl = `https://basalam.com/accounts/sso?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
    
    addLog(`Generated OAuth URL: ${oauthUrl}`);
    addLog(`Client ID: ${CLIENT_ID}`);
    addLog(`Redirect URI: ${REDIRECT_URI}`);
    addLog(`Scope: none (removed)`);
    addLog(`State: ${state}`);
    
    // Open in new tab to see what happens
    window.open(oauthUrl, '_blank');
  };

  const testDifferentRedirect = () => {
    const CLIENT_ID = "1589";
    const REDIRECT_URI = "http://localhost:3000/callback-test";
    const state = Math.random().toString(36).substring(2, 15);
    
    const oauthUrl = `https://basalam.com/accounts/sso?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
    
    addLog(`Testing different redirect: ${oauthUrl}`);
    window.open(oauthUrl, '_blank');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">OAuth Debug Tool</h1>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Controls</h2>
            
            <div className="space-y-4">
              <button
                onClick={testOAuthUrl}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Test OAuth URL (New Tab)
              </button>
              
              <button
                onClick={testDifferentRedirect}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Test with /callback-test redirect
              </button>
              
              <button
                onClick={clearLogs}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Clear Logs
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Debug Instructions:</h3>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. Open browser DevTools (F12)</li>
                <li>2. Go to Network tab</li>
                <li>3. Click "Test OAuth URL"</li>
                <li>4. Watch network requests in DevTools</li>
                <li>5. Try to grant access and see what happens</li>
                <li>6. Check if any redirect requests appear</li>
              </ol>
            </div>
          </div>
          
          {/* Logs */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500">No logs yet. Click a test button to start debugging.</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-medium text-red-800 mb-2">Common Issues to Check:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• <strong>Redirect URI Mismatch:</strong> The redirect URI in Basalam console must exactly match what we're sending</li>
            <li>• <strong>Client ID Issues:</strong> Make sure the client ID is correct</li>
            <li>• <strong>HTTPS Requirements:</strong> Some OAuth providers require HTTPS (but localhost usually works)</li>
            <li>• <strong>Browser Blocking:</strong> Check if browser is blocking the redirect</li>
            <li>• <strong>Network Issues:</strong> Check Network tab for failed requests</li>
          </ul>
        </div>
        
        <div className="mt-6">
          <a 
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}