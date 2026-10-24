import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Coffee,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';

export default function AdminMessSection() {
  const [messSchedule, setMessSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMess = async () => {
      setLoading(true);
      try {
        const res = await api.getMess();
        setMessSchedule(res.data || []);
      } catch {
        // Handled
      } finally {
        setLoading(false);
      }
    };
    loadMess();
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [activeDay, setActiveDay] = useState('Monday');

  const defaultMeals = [
    { type: 'Breakfast', time: '07:30 AM - 09:30 AM', icon: <Coffee className="w-4 h-4 text-[#dfba73]" />, items: ['Poha & Sev', 'Idli Sambar', 'Boiled Eggs', 'Tea / Coffee / Milk'] },
    { type: 'Lunch', time: '12:30 PM - 02:30 PM', icon: <Sun className="w-4 h-4 text-[#dfba73]" />, items: ['Jeera Rice', 'Dal Tadka', 'Paneer Butter Masala', 'Chapati', 'Salad & Curd'] },
    { type: 'Evening Snacks', time: '05:00 PM - 06:15 PM', icon: <UtensilsCrossed className="w-4 h-4 text-[#dfba73]" />, items: ['Veg Sandwich / Samosa', 'Hot Masala Chai', 'Biscuits'] },
    { type: 'Dinner', time: '07:45 PM - 09:45 PM', icon: <Moon className="w-4 h-4 text-[#dfba73]" />, items: ['Veg Biryani / Steamed Rice', 'Chole Masala', 'Tawa Roti', 'Gulab Jamun Sweet'] },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-['Inter',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0e1219] border border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white font-['Playfair_Display',serif] flex items-center gap-2.5">
            <UtensilsCrossed className="w-5 h-5 text-[#dfba73]" />
            Central Mess & Dining Menu Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configure weekly four-course student dining schedules, dietary hygiene alerts, and meal timings.</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-[#c5a059]/15 text-[#dfba73] border border-[#c5a059]/30 font-semibold">
            ✓ ISO 22000 Food Safety Certified
          </span>
        </div>
      </div>

      {/* Days Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeDay === d
                ? 'bg-[#c5a059] text-[#090b10] font-bold shadow-sm'
                : 'bg-[#121620] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Daily Meals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {defaultMeals.map((m, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-[#0e1219] border border-white/10 space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white text-sm font-['Playfair_Display',serif]">
                  {m.icon}
                  <span>{m.type}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#dfba73]" />
                  {m.time}
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                {m.items.map((it, i) => (
                  <div key={i} className="p-2 rounded-xl bg-[#121620] border border-white/5 text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                    <span>{it}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#dfba73] text-center font-medium">
              Nutritious & Chef-approved
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
