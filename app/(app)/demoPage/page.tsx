'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';
import { useState } from 'react';

export default function PhotoRestorer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">AI Photo Restorer</h1>
        <p className="text-gray-500">Restore and enhance your old, damaged, or blurry photos using AI.</p>
      </div>
      
      <Card className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
        <CardContent>
          <label className="block text-lg font-semibold mb-2">Upload Image</label>
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition">
            <UploadCloud className="w-8 h-8 text-gray-500" />
            <span className="text-sm text-gray-500">Upload files</span>
            <span className="text-sm text-blue-500 underline">Browse Files</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          
          {selectedFile && (
            <p className="text-sm text-center text-gray-600 mt-2">{selectedFile.name}</p>
          )}
          
          <Button className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white">
            Restore Photo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
