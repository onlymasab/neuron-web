'use client';

export default async function convertToBrainSignals(src: string, onComplete: () => void) {

  try {
    if (!src) {
      console.error('No source provided');
      onComplete();
      return;
    }
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error('Failed to fetch the file:');
    }

    const blob = await response.blob();
    const extension = src.split('.').pop()?.toLowerCase() || 'jpg';
    const file = new File([blob], `converted.${extension}`, { type: blob.type });

    const fileType = detectFileType(file);
    if (fileType === 'unknown') {
      console.error('Invalid file type');
      onComplete();
      return;
    }
    console.log("converting to brain signals from:", fileType);
    const brainSignals = await brainSignalsConverter(file, fileType);
    console.log("Conversion complete!");
    console.log("Brain Signal: ", brainSignals);
    onComplete();
  } catch (error) {
    console.error("Error during brain signals conversion:", error);
    onComplete();
  }
};

enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  PDF = 'pdf',
  UNKNOWN = 'unknown'
}

function detectFileType(file: File): FileType {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext) return FileType.UNKNOWN;

  if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) return FileType.IMAGE;
  if (['mp4', 'avi', 'mov', 'mkv'].includes(ext)) return FileType.VIDEO;
  if (['mp3', 'wav', 'ogg'].includes(ext)) return FileType.AUDIO;
  if (['pdf'].includes(ext)) return FileType.PDF;

  return FileType.UNKNOWN;
}

async function brainSignalsConverter(file: File, fileType: FileType): Promise<string> {
  let result: any;

  switch (fileType) {
    case FileType.IMAGE:
      result = await processImage(file);
      break;
    case FileType.VIDEO:
      result = await processVideo(file);
      break;
    case FileType.AUDIO:
      result = await processAudio(file);
      break;
    case FileType.PDF:
      result = await processPDF(file);
      break;
    default:
      throw new Error('Unsupported file type');
  }
  
  await new Promise(resolve => setTimeout(resolve, 5000));

  const brainSignalResult = {
    originalFile: {
      name: file.name,
      size: file.size,
      type: file.type,
    },
    signalType: "Simulated EEG",
    timestamp: new Date().toISOString(),
    fileType,
    signalData: {
      encodedSignal: btoa(JSON.stringify(result).slice(0, 500)), // First 500 chars encoded
    },
    meta: {
      origin: "Synthetic Brain Signal Generator",
      confidence: Math.floor(Math.random() * 20) + 80 + "%", // 80–99%
    }
  };

  return JSON.stringify(brainSignalResult, null, 2); // formatted for readability

}

async function processImage(file: File): Promise<any> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          const imageData = ctx?.getImageData(0, 0, img.width, img.height);
          resolve({
            originalFile: file,
            signalData: imageData,
          });
        }
        img.src = reader.result as string;
    }
    reader.readAsDataURL(file);
  });
}

async function processVideo(file: File): Promise<any> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      video.currentTime = 0;
      video.onseeked = () => {
        ctx?.drawImage(video, 0, 0);
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      }
    };
    video.src = URL.createObjectURL(file);
  });
}

async function processAudio(file: File): Promise<any> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContext.decodeAudioData(reader.result as ArrayBuffer, (buffer) => {
        resolve(buffer);
      });
    };
    reader.readAsArrayBuffer(file);
  });
}

async function processPDF(file: File): Promise<any> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const pdfData = new Uint8Array(reader.result as ArrayBuffer);
      resolve(pdfData);
    };
    reader.readAsArrayBuffer(file);
  });
}