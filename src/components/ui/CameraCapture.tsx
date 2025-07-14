import React, { useRef, useState, useEffect } from 'react';
import { Button } from './button';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Seu navegador não suporta acesso à câmera.');
      setLoading(false);
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Não foi possível acessar a câmera. Permissão negada ou indisponível.');
        setLoading(false);
      });
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCaptured(dataUrl);
    }
  };

  const handleConfirm = () => {
    if (!captured) return;
    fetch(captured)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `captura-${Date.now()}.png`, { type: 'image/png' });
        onCapture(file);
      });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-2">{error}</p>
        <Button onClick={onCancel}>Fechar</Button>
      </div>
    );
  }

  if (loading) {
    return <div className="p-4 text-center">Carregando câmera...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      {!captured ? (
        <>
          <video ref={videoRef} autoPlay playsInline className="rounded border w-full max-w-xs" />
          <div className="flex gap-2">
            <Button onClick={handleCapture}>Tirar Foto</Button>
            <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          </div>
        </>
      ) : (
        <>
          <img src={captured} alt="Preview" className="rounded border w-full max-w-xs" />
          <div className="flex gap-2">
            <Button onClick={handleConfirm}>Enviar</Button>
            <Button variant="ghost" onClick={() => setCaptured(null)}>Refazer</Button>
            <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}; 