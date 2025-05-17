// src/app/dashboard/components/tournamentMap.js
"use client";

import { useEffect, useRef } from "react";

export function TournamentMap({ tournaments, center = [0, 0], zoom = 2 }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;
    const L = require("leaflet");

    // fix default icon paths
    const iconRetina = require("leaflet/dist/images/marker-icon-2x.png");
    const iconDefault = require("leaflet/dist/images/marker-icon.png");
    const iconShadow = require("leaflet/dist/images/marker-shadow.png");
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconRetina,
      iconUrl: iconDefault,
      shadowUrl: iconShadow,
    });

    // init map with no labels
    const map = L.map(mapRef.current, { zoomControl: true }).setView(center, zoom);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; OpenStreetMap & CartoDB",
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // compute date bounds
    const times = tournaments.map((t) => new Date(t.date).getTime());
    const minT = Math.min(...times),
      maxT = Math.max(...times);

    // we'll map date→longitude across ±60° from center[1]
    const [minLng, maxLng] = [center[1] - 60, center[1] + 60];
    // latitude jitter between ±10°
    const [minLat, maxLat] = [center[0] - 10, center[0] + 10];

    const markerGroup = L.featureGroup().addTo(map);

    tournaments.forEach((t) => {
      const ts = new Date(t.date).getTime();
      const frac = maxT === minT ? 0.5 : (ts - minT) / (maxT - minT);
      const lng = minLng + frac * (maxLng - minLng);
      const lat = minLat + Math.random() * (maxLat - minLat);

      // pulsing dot marker
      const iconHtml = `
        <div style="
          width:18px;
          height:18px;
          background:#0088ff;
          border:3px solid #fff;
          border-radius:50%;
          box-shadow:0 2px 4px rgba(0,0,0,0.6);
          animation:pulse 2s ease-out infinite;
        "></div>
      `;
      const pulseIcon = L.divIcon({
        html: iconHtml,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const m = L.marker([lat, lng], { icon: pulseIcon }).addTo(markerGroup);
      m.bindPopup(`
        <div style="
          min-width:180px;
          background:rgba(0,0,0,0.8);
          color:#fff;
          padding:.5rem;
          border-radius:.5rem;
        ">
          <h3 style="margin:0;font-size:1rem;">${t.gameTitle || t.title}</h3>
          <p style="margin:.25rem 0 .5rem;font-size:.875rem;">
            ${new Date(t.date).toLocaleDateString()}
          </p>
          <a href="/tournaments/${t.id}" style="
            display:inline-block;
            padding:.4rem .8rem;
            background:#0088ff;
            color:#fff;
            border-radius:.25rem;
            text-decoration:none;
            font-size:.875rem;
          ">View & Register</a>
        </div>
      `);
    });

    if (markerGroup.getBounds().isValid()) {
      map.fitBounds(markerGroup.getBounds().pad(0.2), { maxZoom: 5 });
    }

    return () => map.remove();
  }, [tournaments, center, zoom]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "450px",
        borderRadius: "0.75rem",
        marginBottom: "2rem",
      }}
    />
  );
}
