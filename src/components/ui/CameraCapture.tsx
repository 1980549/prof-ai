import React, { useRef, useState, useEffect } from 'react';
import { Button } from './button';
import { DialogTitle, DialogDescription } from './dialog';
import { Spinner } from './Spinner';

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
  const [videoReady, setVideoReady] = useState(false);
  const [videoTimeout, setVideoTimeout] = useState<NodeJS.Timeout | null>(null);
  const [videoHasFrame, setVideoHasFrame] = useState(false);

  // Inicia a câmera ao abrir o modal
  useEffect(() => {
    setLoading(true);
    setError(null);
    setVideoReady(false);
    setVideoHasFrame(false);
    let localStream: MediaStream | null = null;
    let timeout: NodeJS.Timeout;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Seu navegador não suporta acesso à câmera.');
      setLoading(false);
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((mediaStream) => {
        localStream = mediaStream;
        setStream(mediaStream);
        // Retry de atribuição se ref ainda não existir
        const assignStream = () => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            console.log('stream atribuído ao vídeo');
          } else {
            setTimeout(assignStream, 100);
          }
        };
        assignStream();
        setLoading(false);
        // Fallback visual se vídeo não carregar em 5s
        timeout = setTimeout(() => {
          if (!videoReady) {
            setError('Não foi possível carregar o vídeo da câmera. Tente recarregar ou usar outro navegador/dispositivo.');
            console.error('Timeout: vídeo não carregou em 5s');
          }
        }, 5000);
        setVideoTimeout(timeout);
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
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  // Limpa timeout se vídeo ficar pronto
  useEffect(() => {
    if (videoReady && videoTimeout) {
      clearTimeout(videoTimeout);
    }
  }, [videoReady, videoTimeout]);

  const handleCanPlay = () => {
    setVideoReady(true);
    if (videoRef.current) {
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      setVideoHasFrame(w > 0 && h > 0);
      console.log('vídeo pronto', { width: w, height: h });
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    // Checa se vídeo tem frame válido
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError('A câmera ainda não está pronta. Aguarde o vídeo aparecer antes de capturar.');
      console.error('Tentativa de capturar sem frame válido', { width: video.videoWidth, height: video.videoHeight });
      return;
    }
    // Usa dimensões reais do vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/png');
      setCaptured(dataUrl);
      console.log('Foto capturada', { width: video.videoWidth, height: video.videoHeight });
    } else {
      setError('Erro ao tentar capturar a imagem.');
      console.error('Erro ao tentar capturar a imagem: contexto do canvas nulo');
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
        <div className="flex flex-col items-center justify-center p-4 gap-3">
          <Spinner />
          <span className="text-muted-foreground">Aguardando a câmera...</span>
        </div>
      ) : !captured ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded border w-full max-w-xs"
            style={{ width: '320px', height: '240px', background: '#000' }}
            onCanPlay={handleCanPlay}
          />
          <div className="flex gap-2">
            <Button onClick={handleCapture} disabled={!videoReady || !videoHasFrame}>Tirar Foto</Button>
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