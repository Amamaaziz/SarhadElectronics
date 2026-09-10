import React from 'react';
import { Award, Users, Headphones, Sparkles } from 'lucide-react';

export const TrustMetrics: React.FC = () => {
  const metrics = [
    {
      icon: Award,
      value: '50k+',
      label: 'Products Sold',
      description: 'Tested industrial & home components',
    },
    {
      icon: Users,
      value: '4.9/5',
      label: 'User Rating',
      description: 'Over 12,000 verified buyer reviews',
    },
    {
      icon: Headphones,
      value: '24/7',
      label: 'Tech Support',
      description: 'Direct engineer customer assistance',
    },
    {
      icon: Sparkles,
      value: '100%',
      label: 'Genuine Quality',
      description: 'Original brand warranties included',
    },
  ];

  return (
    <div className="py-12 border-y border-surface-border bg-navy-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-surface/40 border border-surface-border flex items-start gap-4 hover:border-cyan-neon/30 transition-colors"
              >
                <div className="p-3 rounded-xl bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                    {m.value}
                  </div>
                  <div className="text-xs font-semibold text-cyan-neon uppercase tracking-wider">
                    {m.label}
                  </div>
                  <div className="text-xs text-textMuted mt-0.5">
                    {m.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

