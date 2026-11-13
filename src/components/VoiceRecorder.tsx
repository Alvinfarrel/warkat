"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Play, Pause, Upload, Check } from "lucide-react";

interface VoiceRecorderProps {
  onAudioChange: (file: File | null, duration?: number) => void;
}

export default function VoiceRecorder({ onAudioChange }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg("Peramban Anda belum mendukung perekaman mikrofon langsung.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, {
          type: audioBlob.type,
        });
        onAudioChange(audioFile, recordingSeconds);

        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            // Auto stop at 60 seconds
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: unknown) {
      console.error("Mic access error:", err);
      setErrorMsg("Izin mikrofon ditolak atau tidak tersedia pada perangkat Anda.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingSeconds(0);
    onAudioChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const togglePlayAudio = () => {
    if (!audioPlayerRef.current || !audioUrl) return;

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Ukuran file audio maksimal 10 MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    onAudioChange(file);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-xl border border-[#D8C7AA] bg-[#F7F2E8]/80 p-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-[#4A3B32] flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-[#9B2C2C]" />
          <span>Pesan Suara (Opsional)</span>
        </label>
        <span className="text-[11px] text-[#7A6E65]">Maksimal 60 detik / 10MB</span>
      </div>

      {errorMsg && (
        <div className="text-xs text-[#9B2C2C] bg-[#FDE8E8] border border-[#F8B4B4] rounded-lg p-2.5 mb-3">
          {errorMsg}
        </div>
      )}

      {audioUrl ? (
        <div className="flex items-center justify-between gap-3 bg-[#EFE5D3] p-3 rounded-lg border border-[#D3C1A5]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlayAudio}
              className="w-10 h-10 rounded-full bg-[#9B2C2C] text-white flex items-center justify-center hover:bg-[#822121] transition-transform active:scale-95 shadow-sm"
              aria-label={isPlaying ? "Jeda pemutaran" : "Putar rekaman"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div>
              <p className="text-xs font-semibold text-[#2D231C] flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Pesan suara siap dikirim
              </p>
              <p className="text-[11px] text-[#695C52]">
                {recordingSeconds > 0 ? formatTime(recordingSeconds) : "File audio terpilih"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={deleteRecording}
            className="p-2 text-[#7A6E65] hover:text-[#9B2C2C] hover:bg-[#E4D7C2] rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Hapus rekaman"
            aria-label="Hapus rekaman suara"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <audio
            ref={audioPlayerRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>
      ) : isRecording ? (
        <div className="flex items-center justify-between bg-[#FDEAEA] border border-[#F5C2C2] p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 animate-ping" />
            <div>
              <p className="text-xs font-semibold text-[#8B2222]">
                Sedang merekam suara...
              </p>
              <p className="text-xs font-mono text-[#8B2222]">
                {formatTime(recordingSeconds)} / 01:00
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#9B2C2C] text-white text-xs font-medium rounded-lg hover:bg-[#822121] shadow-sm min-h-[44px]"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Selesai</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#2D231C] bg-[#EDE0CA] hover:bg-[#E2D2B8] border border-[#CBB89A] rounded-lg transition-colors min-h-[44px]"
          >
            <Mic className="w-4 h-4 text-[#9B2C2C]" />
            <span>Rekam Suara</span>
          </button>

          <span className="text-xs text-[#8A7E75]">atau</span>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#5A4D43] bg-transparent hover:bg-[#EDE0CA] border border-dashed border-[#B8A68A] rounded-lg transition-colors min-h-[44px]"
          >
            <Upload className="w-3.5 h-3.5 text-[#5A4D43]" />
            <span>Unggah Audio (MP3/WAV/M4A)</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
