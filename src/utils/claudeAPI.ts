import type { FormData } from '../types';

// Use local proxy server to avoid CORS issues
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const generateLeads = async (formData: FormData, apiKey: string): Promise<{ pdfBase64: string; summary?: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/generate-leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      formData,
      apiKey,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    pdfBase64: data.pdfBase64,
    summary: data.summary,
  };
};

export const downloadPDF = (pdfBase64: string, filename: string) => {
  const binaryString = atob(pdfBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
