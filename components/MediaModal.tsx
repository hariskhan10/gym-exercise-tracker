"use client";
import { useEffect } from "react";
import Image from "next/image";

type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  youtubeUrl: string | null;
  mediaUrl: string | null;
  notes: string | null;
};

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return match?.[1] ?? null;
}

export function MediaModal({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const youtubeId = exercise.youtubeUrl ? getYoutubeId(exercise.youtubeUrl) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-slate-900 rounded-t-2xl p-4 pb-8 space-y-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-2" />

        <div>
          <h2 className="text-white font-bold text-lg">{exercise.name}</h2>
          <p className="text-slate-400 text-sm">{exercise.muscleGroup} · {exercise.sets}×{exercise.reps}</p>
        </div>

        {youtubeId && (
          <div className="rounded-xl overflow-hidden aspect-video bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0`}
              title={exercise.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {exercise.mediaUrl && (
          <div className="rounded-xl overflow-hidden bg-slate-800">
            <Image
              src={exercise.mediaUrl}
              alt={exercise.name}
              width={640}
              height={360}
              className="w-full object-contain"
              unoptimized
            />
          </div>
        )}

        {!youtubeId && !exercise.mediaUrl && (
          <div className="bg-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-500 text-sm">No reference media available for this exercise.</p>
          </div>
        )}

        {exercise.notes && (
          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-slate-400 text-sm italic">{exercise.notes}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
