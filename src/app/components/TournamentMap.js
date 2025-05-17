"use client";

import { useEffect, useRef } from "react";

export default function TournamentMap({
  tournaments,
  center = [20, 0],
  zoom = 2,
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    // only run in browser
    if (!mapRef.current || typeof window === "undefined") return;

    let map;

    // dynamically load Leaflet
    import("leaflet").then((L) => {
      // configure default icon URLs (you'll need to copy these into /public/leaflet/)
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });

      // init map
      map = L.map(mapRef.current).setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // add markers + popups
      tournaments.forEach((t) => {
        const { lat, lng } = t.coords;
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`
          <div style="min-width:200px;">
            <h3 style="margin:0 0 .5rem;">${t.name}</h3>
            <p style="margin:0 0 .5rem;">${t.location}</p>
            <a href="/tournaments/${t.id}"
               style="display:inline-block;padding:.25rem .5rem;
                      background:#4A9EFF;color:#fff;border-radius:4px;
                      text-decoration:none;font-size:.875rem;">
              View &amp; Register
            </a>
          </div>
        `);
      });
    });

    // clean up on unmount
    return () => {
      if (map) map.remove();
    };
  }, [tournaments, center, zoom]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "0.5rem",
        marginBottom: "2rem",
      }}
    />
  );
}
