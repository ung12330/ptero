import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = ({ eggs, onLogout }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    egg: eggs[0]?.id || '',
    memory: 2048,
    disk: 10000,
    cpu: 100,
    ports: '25565'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/servers/create', formData);
      toast.success('Server berhasil dibuat! 🎉');
      setFormData({ name: '', description: '', egg: eggs[0]?.id || '', memory: 2048, disk: 10000, cpu: 100, ports: '25565' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Gagal membuat server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              <i className="fas fa-server mr-4"></i>
              Pterodactyl Creator
            </h1>
            <p className="text-xl text-white/80 mt-2">Buat server game dengan mudah</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={onLogout}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
          </div>
        </div>

        {/* Create Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Server Info */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 col-span-2">📝 Informasi Server</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white/90 font-semibold mb-3 text-lg">
                    <i className="fas fa-tag mr-2"></i>Nama Server
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-5 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 text-lg"
                    placeholder="My Awesome Minecraft Server"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/90 font-semibold mb-3 text-lg">
                    <i className="fas fa-gamepad mr-2"></i>Tipe Game
                  </label>
                  <select
                    value={formData.egg}
                    onChange={(e) => setFormData({...formData, egg: e.target.value})}
                    className="w-full p-5 bg-white/20 border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 text-lg"
                  >
                    {eggs.map((egg) => (
                      <option key={egg.id} value={egg.id}>{egg.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 font-semibold mb-3 text-lg">
                    <i className="fas fa-align-left mr-2"></i>Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-5 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 resize-vertical min-h-[120px] text-lg"
                    placeholder="Server Minecraft 1.20 dengan plugin custom..."
                  />
                </div>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 col-span-2">⚙️ Resource Allocation</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white/90 font-semibold mb-4 text-lg flex items-center">
                    <i className="fas fa-memory mr-2 w-6"></i>RAM
                  </label>
                  <input
                    type="range"
                    min="512"
                    max="16384"
                    value={formData.memory}
                    onChange={(e) => setFormData({...formData, memory: e.target.value})}
                    className="w-full h-3 bg-white/30 rounded-lg appearance-none cursor-pointer accent-purple-400 hover:accent-purple-300"
                  />
                  <div className="text-2xl font-bold text-white mt-3">{formData.memory} MB</div>
                </div>

                <div>
                  <label className="block text-white/90 font-semibold mb-4 text-lg flex items-center">
                    <i className="fas fa-hdd mr-2 w-6"></i>Disk Space
                  </label>
                  <input
                    type="range"
                    min="1024"
                    max="50000"
                    value={formData.disk}
                    onChange={(e) => setFormData({...formData, disk: e.target.value})}
                    className="w-full h-3 bg-white/30 rounded-lg appearance-none cursor-pointer accent-purple-400 hover:accent-purple-300"
                  />
                  <div className="text-2xl font-bold text-white mt-3">
                    {Math.round(formData.disk/1024)} GB
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 font-semibold mb-4 text-lg flex items-center">
                    <i className="fas fa-microchip mr-2 w-6"></i>CPU (%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={formData.cpu}
                    onChange={(e) => setFormData({...formData, cpu: e.target.value})}
                    className="w-full h-3 bg-white/30 rounded-lg appearance-none cursor-pointer accent-purple-400 hover:accent-purple-300"
                  />
                  <div className="text-2xl font-bold text-white mt-3">{formData.cpu}%</div>
                </div>

                <div>
                  <label className="block text-white/90 font-semibold mb-3 text-lg">
                    <i className="fas fa-network-wired mr-2"></i>Port
                  </label>
                  <input
                    type="text"
                    value={formData.ports}
                    onChange={(e) => setFormData({...formData
