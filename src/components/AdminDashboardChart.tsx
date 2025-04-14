'use client';

import { useEffect, useRef } from 'react';

export default function AdminDashboardChart() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-medium text-slate-700">Comparativo de Vendas</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-sky-400" />
            <span className="text-lg text-slate-500">2024</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-indigo-300" />
            <span className="text-lg text-slate-500">2023</span>
          </div>
        </div>
      </div>

      <div className="relative h-[350px] mt-6">
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-6 gap-px">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-r border-slate-50" />
          ))}
        </div>
        
        {/* Months */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 py-4 border-t border-slate-100">
          {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map((month) => (
            <span key={month} className="text-lg font-medium text-slate-400">{month}</span>
          ))}
        </div>

        {/* Values */}
        <div className="absolute top-0 bottom-16 left-0 w-12 flex flex-col justify-between">
          {[80, 60, 40, 20, 0].map((value) => (
            <div key={value} className="flex items-center gap-2">
              <span className="text-lg text-slate-400">{value}</span>
              <div className="flex-1 border-b border-slate-100 w-[calc(100vw-3rem)]" />
            </div>
          ))}
        </div>

        {/* Chart Lines */}
        <div className="relative h-full">
          {/* Area under 2024 Line */}
          <svg className="absolute inset-0" style={{ height: 'calc(100% - 4rem)' }}>
            <defs>
              <linearGradient id="gradient2024" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(56, 189, 248, 0.2)" />
                <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
              </linearGradient>
            </defs>
            <path
              d="M40 280 L120 200 L200 160 L280 180 L360 120 L440 100 L440 320 L40 320 Z"
              fill="url(#gradient2024)"
              stroke="none"
            />
          </svg>

          {/* Area under 2023 Line */}
          <svg className="absolute inset-0" style={{ height: 'calc(100% - 4rem)' }}>
            <defs>
              <linearGradient id="gradient2023" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(165, 180, 252, 0.2)" />
                <stop offset="100%" stopColor="rgba(165, 180, 252, 0)" />
              </linearGradient>
            </defs>
            <path
              d="M40 300 L120 240 L200 220 L280 190 L360 170 L440 140 L440 320 L40 320 Z"
              fill="url(#gradient2023)"
              stroke="none"
            />
          </svg>

          {/* 2024 Line */}
          <svg className="absolute inset-0" style={{ height: 'calc(100% - 4rem)' }}>
            <path
              d="M40 280 L120 200 L200 160 L280 180 L360 120 L440 100"
              fill="none"
              stroke="rgb(56, 189, 248)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* 2023 Line */}
          <svg className="absolute inset-0" style={{ height: 'calc(100% - 4rem)' }}>
            <path
              d="M40 300 L120 240 L200 220 L280 190 L360 170 L440 140"
              fill="none"
              stroke="rgb(165, 180, 252)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Data Points 2024 */}
          <div className="absolute inset-0" style={{ height: 'calc(100% - 4rem)' }}>
            {[280, 200, 160, 180, 120, 100].map((y, i) => (
              <div
                key={`2024-${i}`}
                className="absolute w-3 h-3 bg-white border-2 border-sky-400 rounded-full transform -translate-x-1.5 -translate-y-1.5 shadow-sm"
                style={{
                  left: `${40 + i * 80}px`,
                  top: `${y}px`,
                }}
              />
            ))}
          </div>

          {/* Data Points 2023 */}
          <div className="absolute inset-0" style={{ height: 'calc(100% - 4rem)' }}>
            {[300, 240, 220, 190, 170, 140].map((y, i) => (
              <div
                key={`2023-${i}`}
                className="absolute w-3 h-3 bg-white border-2 border-indigo-300 rounded-full transform -translate-x-1.5 -translate-y-1.5 shadow-sm"
                style={{
                  left: `${40 + i * 80}px`,
                  top: `${y}px`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 