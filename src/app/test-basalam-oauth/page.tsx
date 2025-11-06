"use client";

export default function TestBasalamOAuthPage() {
  const CLIENT_ID = "1589";
  const REDIRECT_URI = "http://localhost:3000/"; // This matches what's configured in Basalam
  
  const testConfigs = [
    {
      name: "No Scope (Working Before)",
      url: `https://basalam.com/accounts/sso?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=test1`,
      description: "The format that was working before"
    },
    {
      name: "With response_type=code",
      url: `https://basalam.com/accounts/sso?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=test2`,
      description: "Standard OAuth2 format"
    },
    {
      name: "Minimal Parameters",
      url: `https://basalam.com/accounts/sso?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
      description: "Just client_id and redirect_uri"
    },
    {
      name: "Different Parameter Order",
      url: `https://basalam.com/accounts/sso?redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_id=${CLIENT_ID}&state=test4`,
      description: "Different parameter order"
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Basalam OAuth Formats</h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-red-800 mb-2">Current Issue:</h3>
          <p className="text-red-700">Getting "خطا در دریافت اطلاعات" (Error in receiving information) again</p>
          <p className="text-sm text-red-600 mt-1">Let's test different OAuth URL formats to find what works</p>
        </div>
        
        <div className="space-y-4">
          {testConfigs.map((config, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{config.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                    {config.url}
                  </code>
                </div>
                <a
                  href={config.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Test
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Testing Instructions:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Click "Test" for each configuration</li>
            <li>2. If you see Basalam login page → Configuration works</li>
            <li>3. If you see "خطا در دریافت اطلاعات" → Configuration doesn't work</li>
            <li>4. Try to complete the OAuth flow with working configurations</li>
            <li>5. Check if you get redirected to /callback-test with a code parameter</li>
          </ol>
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