"use client";

import dynamic from "next/dynamic";

export const ActivityChart = dynamic(() => import("./activity-chart"), {
  ssr: false,
  loading: () => (
    <div className="glass rounded-2xl p-5 shadow-soft h-[300px] animate-pulse" />
  ),
});
