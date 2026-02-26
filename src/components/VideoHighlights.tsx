"use client";

import { videoHighlights } from "@/data/events";

const gradients = [
  "from-red-600/40 via-orange-700/30 to-surface",
  "from-blue-600/30 via-indigo-900/20 to-surface",
  "from-drift-orange/40 via-yellow-700/20 to-surface",
  "from-green-600/30 via-teal-900/20 to-surface",
];

export default function VideoHighlights() {
  return (
    <section className="relative py-20 md:py-28">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">
            FROM THE TRACK
          </h2>
          <div className="tire-track w-20 mt-3" />
          <p className="text-muted mt-3 text-lg">Highlights from recent events around the world</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {videoHighlights.map((video, i) => (
            <div key={video.id} className="group relative rounded-2xl overflow-hidden cursor-pointer">
              {/* Thumbnail placeholder */}
              <div className={`relative aspect-video bg-gradient-to-br ${gradients[i]} overflow-hidden`}>
                <div className="absolute inset-0 carbon-bg opacity-20" />

                {/* Decorative elements */}
                <svg className="absolute bottom-4 right-4 w-24 h-24 text-white/5" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-drift-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <h3 className="font-heading font-semibold text-foreground text-lg leading-tight mb-1">
                  {video.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted">
                  <span>{video.event}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-dark" />
                  <span>{video.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
