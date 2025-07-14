import React, { useRef, useState, useEffect } from 'react';
import { Button } from './button';
import { DialogTitle, DialogDescription } from './dialog';

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
    setError(null);
    let localStream: MediaStream | null = null;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Seu navegador não suporta acesso à câmera.');
      setLoading(false);
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((mediaStream) => {
        localStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          console.log('stream atribuído ao vídeo');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Não foi possível acessar a câmera, tente outro navegador/dispositivo.');
        setLoading(false);
        console.error('Erro ao acessar a câmera:', err);
      });
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
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
      console.log('Foto capturada');
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

  return (
    <div className="flex flex-col items-center gap-4 p-2" aria-describedby="camera-modal-desc">
      <DialogTitle>Capturar Imagem da Câmera</DialogTitle>
      <DialogDescription id="camera-modal-desc">
        Permita o acesso à câmera para tirar uma foto e enviar no chat.
      </DialogDescription>
      {error ? (
        <div className="flex flex-col items-center justify-center p-4">
          <p className="text-red-500 mb-2">{error}</p>
          <Button onClick={onCancel}>Fechar</Button>
        </div>
      ) : loading ? (
        <div className="p-4 text-center">Carregando câmera...</div>
      ) : !captured ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded border w-full max-w-xs"
            style={{ width: '320px', height: '240px', background: '#000' }}
            onCanPlay={() => console.log('vídeo pronto')}
          />
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