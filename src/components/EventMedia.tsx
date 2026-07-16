"use client";

import { useState } from "react";

/** Photo gallery with lightbox for event media beyond the cover image. */
export function EventGallery({ urls, eventName }: { urls: string[]; eventName: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (urls.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="font-heading font-semibold text-sm text-foreground mb-3 uppercase tracking-wider">Photos</h3>
      <div className="grid grid-cols-3 gap-2">
        {urls.map((url, i) => (
          <button
            key={url}
            onClick={() => setLightboxIndex(i)}
            className="aspect-video rounded-xl overflow-hidden border border-border hover:border-drift-orange/50 transition-colors"
          >
            <img src={url} alt={`${eventName} photo ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <img src={urls[lightboxIndex]} alt={eventName} className="max-w-full max-h-full rounded-xl object-contain" />
          {urls.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + urls.length) % urls.length); }}
                className="absolute left-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % urls.length); }}
                className="absolute right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </>
          )}
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

/** Highlighted safety requirements block shown before the apply button. */
export function SafetyRequirements({ text }: { text?: string }) {
  if (!text?.trim()) return null;

  return (
    <div className="mb-6 rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-5">
      <div className="flex items-center gap-2 mb-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <h3 className="font-heading font-semibold text-sm text-yellow-500 uppercase tracking-wider">Safety Requirements</h3>
      </div>
      <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  );
}
