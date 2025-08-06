"use client";
import React, { useState } from "react";
import { Upload } from "lucide-react";

const SimpleAdmin = () => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY;
      if (!adminKey) {
        throw new Error("Admin key not configured");
      }

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setMessage(`❌ Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Knowledge Base Admin</h1>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Upload Document</h3>
        <p className="text-gray-600 mb-4">TXT, JSON, and Markdown files only</p>
        <input
          type="file"
          accept=".txt,.json,.md" 
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading && (
          <div className="mt-4 text-blue-600">Uploading and processing...</div>
        )}
        {message && (
          <div className="mt-4 p-3 rounded-lg bg-gray-50 text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleAdmin;
