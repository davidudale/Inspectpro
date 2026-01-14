
import React from 'react';
import wind from '../../assets/wind.jpg';

const Sustainability = () => {
  return (
    <section id="sustainability" className="py-32 bg-slate-900 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[40%] h-full opacity-10">
        <img 
          src={wind} 
          alt="Wind turbines" 
          className="w-full h-full object-cover grayscale"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-orange-500 font-bold uppercase tracking-[0.3em] text-sm mb-4">ESG & Sustainability</h2>
            <h3 className="text-4xl md:text-5xl font-syncopate font-bold text-white mb-8 leading-tight">
              A LEGACY OF <br />
              <span className="text-orange-500">RESPONSIBILITY</span>
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed mb-10">
              At InspectPro Energy, we believe the energy transition is an opportunity for innovation. We are investing billions in Carbon Capture and Sequestration (CCS) and hydrogen production to ensure that as we meet today's energy needs, we don't compromise tomorrow.
            </p>
            
            <div className="space-y-6">
              {[
                '30% Reduction in Carbon Intensity by 2030',
                'Advanced Water Recycling Systems in all Facilities',
                'Global Net-Zero Operations Strategy by 2050',
                'Empowering Local Communities via Energy Education'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 border border-orange-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-500"></div>
                  </div>
                  <span className="text-slate-100 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <button className="mt-12 px-8 py-4 bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold uppercase tracking-widest transition-all">
              Read 2024 ESG Report
            </button>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-orange-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"></div>
            <div className="relative glass-effect p-2 rounded-sm transform hover:rotate-1 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1594818378824-766485bcd33b?q=80&w=2070&auto=format&fit=crop" 
                alt="Renewable Energy Facility" 
                className="w-full rounded-sm"
              />
              <div className="absolute -bottom-8 -left-8 bg-slate-950 p-6 border-l-4 border-orange-500 shadow-2xl max-w-xs">
                <p className="text-orange-500 font-syncopate font-bold text-xl mb-1">$4.2B</p>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Invested in Clean Tech Since 2021</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sustainability;
