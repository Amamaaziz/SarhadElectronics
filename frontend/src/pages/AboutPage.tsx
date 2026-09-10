import React from 'react';
import { Award, Users, Globe2, Cpu, Wrench, Zap } from 'lucide-react';
import { TrustMetrics } from '../components/TrustMetrics';

export const AboutPage: React.FC = () => {
  const metrics = [
    { label: 'Happy Clients', value: '10,000+', icon: Users },
    { label: 'Global Tech Partners', value: '15+', icon: Globe2 },
    { label: 'Components Tested', value: '75,000+', icon: Cpu },
    { label: 'Industrial Projects', value: '1,200+', icon: Wrench },
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          Our Heritage & Engineering Creed
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold font-['Space_Grotesk'] text-white max-w-4xl mx-auto leading-tight">
          Innovation In{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon to-magenta-purple">
            Every Component
          </span>
        </h1>

        <p className="text-base sm:text-lg text-textMuted max-w-2xl mx-auto leading-relaxed">
          Founded in Peshawar, Sarhad Electrics bridges the gap between everyday smart home automation
          and rigorous industrial-grade electrical engineering. We supply hardware that stands up to the most demanding environments.
        </p>
      </section>

      {/* Business Metrics Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-surface/40 border border-surface-border text-center space-y-2 hover:border-cyan-neon/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-neon/10 text-cyan-neon mx-auto flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black font-['Space_Grotesk'] text-white">
                  {m.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-neon">
                  {m.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visual Collage of Workspace & Engineering Lab */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
            Inside Sarhad Engineering & Showroom
          </h2>
          <p className="text-sm text-textMuted max-w-xl mx-auto">
            From our primary showroom at Raheem Plaza, Peshawar to our testing benches, precision is our standard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl overflow-hidden border border-surface-border bg-surface relative aspect-4/3 group">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
              alt="Electrical Testing Lab"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent p-4 flex items-end">
              <span className="text-xs font-semibold text-white">Quality Diagnostics & Calibration Lab</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-surface-border bg-surface relative aspect-4/3 group">
            <img
              src="https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80"
              alt="Smart Gadgets R&D"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent p-4 flex items-end">
              <span className="text-xs font-semibold text-white">Smart Architecture & IoT Testing</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-surface-border bg-surface relative aspect-4/3 group">
            <img
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80"
              alt="Industrial Tool Assembly"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent p-4 flex items-end">
              <span className="text-xs font-semibold text-white">Heavy-Duty Hardware Inspection</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-surface/30 border border-surface-border space-y-3">
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
              <span className="text-cyan-neon">01.</span> Zero Compromise on Grade
            </h3>
            <p className="text-xs text-textMuted leading-relaxed">
              Every switch, multimeter, cordless tool, and smart hub is authenticated directly from verified manufacturers. No counterfeit parts, ever.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface/30 border border-surface-border space-y-3">
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
              <span className="text-cyan-neon">02.</span> Local Support, Global Standards
            </h3>
            <p className="text-xs text-textMuted leading-relaxed">
              Based in the heart of Khyber Pakhtunkhwa on University Road, Peshawar, providing personalized support, rapid dispatch, and local warranties.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface/30 border border-surface-border space-y-3">
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
              <span className="text-cyan-neon">03.</span> Future-Proof Technologies
            </h3>
            <p className="text-xs text-textMuted leading-relaxed">
              We continually update our catalog to introduce cutting-edge Matter-compatible IoT devices, spatial audio, and brushless motor tools.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

