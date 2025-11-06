"use client";
import { useState } from "react";

export default function ImagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [prompt, setPrompt] = useState("Replace the model with a professional mannequin wearing the same clothing");
  const [mannequinType, setMannequinType] = useState("professional");

  const mannequinPrompts = {
    professional: "Replace the model with a professional white mannequin wearing the same clothing, studio lighting, clean background",
    casual: "Replace the model with a casual lifestyle mannequin wearing the same clothing, natural pose, modern setting",
    elegant: "Replace the model with an elegant fashion mannequin wearing the same clothing, sophisticated pose, luxury setting",
    sporty: "Replace the model with a sporty athletic mannequin wearing the same clothing, dynamic pose, fitness environment"
  };

  async function processImage() {
    if (!file) return;
    setProcessing(true);
    
    const fd = new FormData();
    fd.append("file", file);
    fd.append("prompt", mannequinPrompts[mannequinType as keyof typeof mannequinPrompts]);
    fd.append("operation", "mannequin_replacement");
    
    try {
      const res = await fetch("/api/images/process", {
        method: "POST",
        body: fd,
      });
      
      if (!res.ok) {
        throw new Error("Processing failed");
      }
      
      const blob = await res.blob();
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      alert("Processing failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">← Back to Home</a>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Mannequin Replacement</h1>
          <p className="text-gray-600">Upload a product photo and replace the model with an AI-generated mannequin</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Image</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product Image
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e=>setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mannequin Style
                </label>
                <select 
                  value={mannequinType} 
                  onChange={e=>setMannequinType(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="elegant">Elegant</option>
                  <option value="sporty">Sporty</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Prompt (Optional)
                </label>
                <textarea 
                  value={prompt}
                  onChange={e=>setPrompt(e.target.value)}
                  placeholder="Describe how you want the mannequin to look..."
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <button 
                onClick={processImage}
                disabled={!file || processing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {processing ? "Processing..." : "Generate Mannequin"}
              </button>
            </div>

            {file && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Original Image</h3>
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="Original" 
                  className="w-full rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Result</h2>
            
            {processing && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating mannequin replacement...</p>
                </div>
              </div>
            )}

            {resultUrl && !processing && (
              <div className="space-y-4">
                <img 
                  src={resultUrl} 
                  alt="Result" 
                  className="w-full rounded-lg border"
                />
                <div className="flex gap-2">
                  <a 
                    href={resultUrl} 
                    download="mannequin-result.png"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-center font-medium transition-colors"
                  >
                    Download Result
                  </a>
                  <button 
                    onClick={() => setResultUrl("")}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {!resultUrl && !processing && (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Processed image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

