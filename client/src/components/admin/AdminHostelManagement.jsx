import React, { useState, useEffect } from 'react';
import {
  Building2,
  BedDouble,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Layers,
  Users,
  ShieldCheck,
  DoorOpen,
  DollarSign
} from 'lucide-react';
import api from '../../services/api';

export default function AdminHostelManagement({ onHostelsUpdated }) {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [hostelModalOpen, setHostelModalOpen] = useState(false);
  const [hostelForm, setHostelForm] = useState({
    name: '',
    code: '',
    gender: 'boys',
    capacity: 100,
    totalRooms: 40,
    address: 'Campus North Complex',
    status: 'active',
  });

  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({
    hostel: '',
    roomNumber: '',
    floor: 1,
    capacity: 2,
    type: 'AC',
    rentPerMonth: 6500,
    status: 'available',
  });

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadHostelsAndRooms = async () => {
    setLoading(true);
    try {
      const [hostelsRes, roomsRes] = await Promise.allSettled([
        api.getHostels(),
        api.getRooms(),
      ]);

      if (hostelsRes.status === 'fulfilled' && hostelsRes.value.data) {
        setHostels(hostelsRes.value.data);
        if (hostelsRes.value.data.length > 0 && !selectedHostel) {
          setSelectedHostel(hostelsRes.value.data[0]._id);
        }
      }
      if (roomsRes.status === 'fulfilled' && roomsRes.value.data) {
        setRooms(roomsRes.value.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load hostels', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostelsAndRooms();
  }, []);

  const handleCreateHostel = async (e) => {
    e.preventDefault();
    try {
      await api.createHostel(hostelForm);
      showToast('Hostel complex created successfully!');
      setHostelModalOpen(false);
      setHostelForm({ name: '', code: '', gender: 'boys', capacity: 100, totalRooms: 40, address: '', status: 'active' });
      loadHostelsAndRooms();
      if (onHostelsUpdated) onHostelsUpdated();
    } catch (err) {
      showToast(err.message || 'Failed to create hostel', 'error');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await api.createRoom({
        ...roomForm,
        hostel: roomForm.hostel || selectedHostel,
      });
      showToast('Room created and beds provisioned!');
      setRoomModalOpen(false);
      setRoomForm({ hostel: '', roomNumber: '', floor: 1, capacity: 2, type: 'AC', rentPerMonth: 6500, status: 'available' });
      loadHostelsAndRooms();
      if (onHostelsUpdated) onHostelsUpdated();
    } catch (err) {
      showToast(err.message || 'Failed to create room', 'error');
    }
  };

  const filteredRooms = rooms.filter((r) => {
    if (!selectedHostel) return true;
    return r.hostel?._id?.toString() === selectedHostel.toString() || r.hostel?.toString() === selectedHostel.toString();
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium border animate-slide-up ${
          toast.type === 'error' ? 'bg-rose-950/95 text-rose-200 border-rose-700/60' : 'bg-emerald-950/95 text-emerald-200 border-emerald-700/60'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/70 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            Hostel, Block & Room Infrastructure
          </h2>
          <p className="text-xs text-slate-400">Configure residential blocks, assign wardens, manage capacity, and track room statuses.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHostelModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create Hostel</span>
          </button>
          <button
            onClick={() => {
              setRoomForm((prev) => ({ ...prev, hostel: selectedHostel }));
              setRoomModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-600/30"
          >
            <DoorOpen className="w-4 h-4" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* Hostel Selection Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {hostels.map((h) => (
          <button
            key={h._id}
            onClick={() => setSelectedHostel(h._id)}
            className={`p-4 rounded-2xl border text-left min-w-[220px] transition-all cursor-pointer ${
              selectedHostel === h._id
                ? 'bg-indigo-950/60 border-indigo-500 shadow-xl shadow-indigo-950/50'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">{h.code}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold uppercase">{h.status || 'Active'}</span>
            </div>
            <div className="text-sm font-bold text-white mt-1">{h.name}</div>
            <div className="text-[11px] text-slate-400 mt-1">Capacity: {h.capacity || 80} Beds · {h.gender === 'girls' ? 'Girls' : 'Boys'}</div>
          </button>
        ))}
      </div>

      {/* Visual Room Grid for Selected Hostel */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-purple-400" />
              Room Grid & Bed Allocations ({filteredRooms.length} Rooms)
            </h3>
            <p className="text-xs text-slate-400">Live residential units for currently selected hostel complex.</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Available</span>
            <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400" /> Partial</span>
            <span className="flex items-center gap-1.5 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-400" /> Occupied</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((r) => (
              <div
                key={r._id}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">#{r.roomNumber}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    r.type === 'AC' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {r.type}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  Floor {r.floor} · {r.capacity} Beds
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-emerald-400 font-bold">₹{r.rentPerMonth?.toLocaleString('en-IN')}/mo</span>
                  <span className="text-slate-400 font-medium">✓ Provisioned</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-8 text-center text-xs text-slate-500">
              No rooms added to this hostel yet. Click "Add Room" to create units.
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL: CREATE HOSTEL ── */}
      {hostelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0f1b2d] border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Create Hostel Complex
              </h3>
              <button onClick={() => setHostelModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateHostel} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Hostel Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahyadri Boys Hostel"
                    value={hostelForm.name}
                    onChange={(e) => setHostelForm({ ...hostelForm, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Block Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SAY-A"
                    value={hostelForm.code}
                    onChange={(e) => setHostelForm({ ...hostelForm, code: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Gender *</label>
                  <select
                    value={hostelForm.gender}
                    onChange={(e) => setHostelForm({ ...hostelForm, gender: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="boys">Boys Hostel</option>
                    <option value="girls">Girls Hostel</option>
                    <option value="co-ed">Co-Ed Complex</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Total Capacity (Beds) *</label>
                  <input
                    type="number"
                    required
                    value={hostelForm.capacity}
                    onChange={(e) => setHostelForm({ ...hostelForm, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setHostelModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Create Complex
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE ROOM ── */}
      {roomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0f1b2d] border border-sky-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-sky-400" />
                Add Residential Room
              </h3>
              <button onClick={() => setRoomModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 201"
                    value={roomForm.roomNumber}
                    onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Floor *</label>
                  <input
                    type="number"
                    required
                    value={roomForm.floor}
                    onChange={(e) => setRoomForm({ ...roomForm, floor: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Room Type</label>
                  <select
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="AC">AC Room</option>
                    <option value="Non-AC">Non-AC Standard</option>
                    <option value="Deluxe">Deluxe Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={roomForm.rentPerMonth}
                    onChange={(e) => setRoomForm({ ...roomForm, rentPerMonth: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRoomModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg shadow-sky-600/30"
                >
                  Provision Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
