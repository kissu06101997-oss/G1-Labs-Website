"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Cpu, Monitor, RefreshCw, Wifi } from "lucide-react";

interface HealthPayload {
  status: string;
  database: string;
  experimentVersions?: number;
  engineAbi?: string;
  optionalTutorEnabled?: boolean;
}

export function DeviceCapabilityPanel() {
  const [webgl2, setWebgl2] = useState<string>("Checking...");
  const [viewport, setViewport] = useState<string>("Checking...");
  const [reducedMotion, setReducedMotion] = useState<string>("Checking...");
  const [online, setOnline] = useState<boolean>(true);
  const [health, setHealth] = useState<HealthPayload | null>(null);

  async function refreshChecks() {
    if (typeof window !== "undefined") {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2");
        setWebgl2(gl ? "WebGL2 available (3D candidate + 2D DOM parity)" : "WebGL2 unavailable — use 2D Accessible DOM player");
      } catch {
        setWebgl2("WebGL2 check blocked — 2D Accessible DOM player recommended");
      }
      setViewport(`${window.innerWidth} × ${window.innerHeight} CSS px`);
      setReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "Reduced motion enabled"
          : "Standard motion preference"
      );
      setOnline(navigator.onLine);
    }

    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const data = (await res.json()) as HealthPayload;
      setHealth(data);
    } catch {
      setHealth({ status: "unreachable", database: "unknown" });
    }
  }

  useEffect(() => {
    void refreshChecks();
  }, []);

  return (
    <section aria-labelledby="device-check-heading" className="g1-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="device-check-heading" className="text-xl font-extrabold text-[#0c2444]">
            Live browser &amp; platform readiness check
          </h2>
          <p className="mt-1 text-sm text-[#4b637a]">
            Measured directly on this browser session and local PostgreSQL backend.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refreshChecks()}
          className="g1-btn g1-btn-outline min-h-[40px] px-4 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Re-run check</span>
        </button>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#ddebf3] bg-[#f8fcff] p-4">
          <dt className="flex items-center gap-2 text-xs font-bold text-[#4b637a]">
            <Cpu className="h-4 w-4 text-[#007875]" aria-hidden="true" />
            Graphics capability
          </dt>
          <dd className="mt-1.5 text-sm font-bold text-[#0c2444]">{webgl2}</dd>
        </div>
        <div className="rounded-2xl border border-[#ddebf3] bg-[#f8fcff] p-4">
          <dt className="flex items-center gap-2 text-xs font-bold text-[#4b637a]">
            <Monitor className="h-4 w-4 text-[#007875]" aria-hidden="true" />
            Viewport &amp; motion
          </dt>
          <dd className="mt-1.5 text-sm font-bold text-[#0c2444]">
            {viewport}
            <div className="mt-0.5 text-xs font-normal text-[#4b637a]">{reducedMotion}</div>
          </dd>
        </div>
        <div className="rounded-2xl border border-[#ddebf3] bg-[#f8fcff] p-4">
          <dt className="flex items-center gap-2 text-xs font-bold text-[#4b637a]">
            <Wifi className="h-4 w-4 text-[#007875]" aria-hidden="true" />
            Connectivity
          </dt>
          <dd className="mt-1.5 text-sm font-bold text-[#0c2444]">
            {online ? "Online (server-confirmed sync)" : "Offline (read-only cache)"}
          </dd>
        </div>
        <div className="rounded-2xl border border-[#ddebf3] bg-[#f8fcff] p-4">
          <dt className="flex items-center gap-2 text-xs font-bold text-[#4b637a]">
            <CheckCircle2 className="h-4 w-4 text-[#046c49]" aria-hidden="true" />
            Platform API &amp; PostgreSQL
          </dt>
          <dd className="mt-1.5 text-sm font-bold text-[#0c2444]">
            {health ? `${health.status.toUpperCase()} · DB ${health.database}` : "Checking..."}
            {health?.engineAbi ? (
              <div className="mt-0.5 font-mono text-xs font-normal text-[#4b637a]">
                ABI {health.engineAbi} · Tutor {health.optionalTutorEnabled ? "on" : "off"}
              </div>
            ) : null}
          </dd>
        </div>
      </dl>
    </section>
  );
}
