
import React from 'react';

const iconProps = {
  className: "w-5 h-5",
  strokeWidth: 2,
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "round" as "round",
  strokeLinejoin: "round" as "round",
};

export const PlayIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

export const PauseIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

export const RefreshIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <polyline points="23 4 23 10 17 10"></polyline>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
  </svg>
);

export const PlusIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const TrashIcon = () => (
  <svg className="w-4 h-4" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

export const SunIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z"></path>
    </svg>
);

export const MoonIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
    </svg>
);

export const SparklesIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path d="M12 2L9.8 8.6L2 9.4L8.6 14.2L6.4 21L12 17.6L17.6 21L15.4 14.2L22 9.4L14.2 8.6L12 2z" />
  </svg>
);

export const ChartBarIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path d="M3 3v18h18"></path>
    <path d="M7 12v5"></path>
    <path d="M12 7v10"></path>
    <path d="M17 4v13"></path>
  </svg>
);

export const DownloadIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);
