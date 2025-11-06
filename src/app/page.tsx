"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [vendorId, setVendorId] = useState<number | null>(null);
  const [authStatus, setAuthStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  async function handleOAuthCallback() {
    // Get URL parameters directly from window.location
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");
    
    // Debug: log what we received
    console.log("OAuth callback - URL:", window.location.href);
    console.log("OAuth callback - Code:", code);
    console.log("OAuth callback - Error:", error);
    
    if (error) {
      setAuthStatus("error");
      setAuthMessage(`Authentication failed: ${error}`);
      return;
    }
    
    if (code) {
      setAuthStatus("processing");
      setAuthMessage("Processing authentication...");
      
      try {
        const response = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            code, 
            state: urlParams.get("state") 
          }),
        });

        if (response.ok) {
          setAuthStatus("success");
          setAuthMessage("Authentication successful!");
          // Clear URL parameters
          window.history.replaceState({}, document.title, "/");
          // Refresh auth status
          setTimeout(() => {
            checkAuthStatus();
            setAuthStatus("idle");
            setAuthMessage("");
          }, 2000);
        } else {
          const errorData = await response.json();
          setAuthStatus("error");
          setAuthMessage(`Authentication failed: ${errorData.error || "Unknown error"}`);
        }
      } catch (error) {
        setAuthStatus("error");
        setAuthMessage("Network error during authentication");
      }
    } else {
      checkAuthStatus();
    }
  }

  async function checkAuthStatus() {
    try {
      const res = await fetch("/api/auth/status");
      const data = await res.json();
      setConnected(!!data.connected);
      setVendorId(data.user?.vendor_id ?? null);
    } catch (error) {
      setConnected(false);
    }
  }

  async function loginWithBasalam() {
    window.location.href = "/api/auth/login";
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Basalam Image Editor</h1>
          <p className="text-lg text-gray-600">AI-powered mannequin replacement for your product photos</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="space-y-4">
            {authStatus !== "idle" && (
              <div className={`p-4 rounded-lg ${
                authStatus === "processing" ? "bg-blue-50 border border-blue-200" :
                authStatus === "success" ? "bg-green-50 border border-green-200" :
                "bg-red-50 border border-red-200"
              }`}>
                <div className="flex items-center">
                  {authStatus === "processing" && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  )}
                  {authStatus === "success" && (
                    <div className="text-green-600 text-xl mr-3">✓</div>
                  )}
                  {authStatus === "error" && (
                    <div className="text-red-600 text-xl mr-3">✗</div>
                  )}
                  <p className={`font-medium ${
                    authStatus === "processing" ? "text-blue-800" :
                    authStatus === "success" ? "text-green-800" :
                    "text-red-800"
                  }`}>
                    {authMessage}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Account Status</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {connected === null ? "Checking connection..." : 
                   connected ? `✅ Connected ${vendorId ? `(Vendor ${vendorId})` : ""}` : 
                   "❌ Not connected"}
                </p>
              </div>
              <div className="flex gap-2">
                {connected && (
                  <button 
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                )}
                {!connected && connected !== null && (
                  <button 
                    onClick={loginWithBasalam}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Login with Basalam
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {connected && (
          <div className="grid gap-6 md:grid-cols-2">
            <a 
              href="/images" 
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow group"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                🎨 Mannequin Replacement
              </h3>
              <p className="text-gray-600">Replace models in your product photos with AI-generated mannequins</p>
            </a>
            
            <a 
              href="/products" 
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow group"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                📦 Product Management
              </h3>
              <p className="text-gray-600">View and manage your Basalam product catalog</p>
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

