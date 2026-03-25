"use client";

import React from "react";

function ShimmerBar({
  width,
  height
}: {
  width: string;
  height: string;
}) {
  return (
    <div className={`rounded bg-gray-200 ${width} ${height} animate-pulse`} />
  );
}

export function AutoBriefShimmer() {
  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 space-y-2">
        <ShimmerBar width="w-40" height="h-4" />
        <ShimmerBar width="w-64" height="h-3" />
      </div>

      <div className="mb-4">
        <ShimmerBar width="w-32" height="h-3" />
        <div className="mt-2 space-y-2">
          <ShimmerBar width="w-56" height="h-3" />
          <ShimmerBar width="w-48" height="h-3" />
          <ShimmerBar width="w-40" height="h-3" />
        </div>
      </div>

      <div className="mb-4">
        <ShimmerBar width="w-36" height="h-3" />
        <div className="mt-2 space-y-2">
          <ShimmerBar width="w-64" height="h-3" />
          <ShimmerBar width="w-52" height="h-3" />
          <ShimmerBar width="w-44" height="h-3" />
          <ShimmerBar width="w-40" height="h-3" />
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 space-y-2">
        <ShimmerBar width="w-24" height="h-3" />
        <ShimmerBar width="w-56" height="h-3" />
        <ShimmerBar width="w-48" height="h-3" />
      </div>
    </div>
  );
}
