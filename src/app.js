import React, { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  Wind, 
  CloudRain, 
  Sun, 
  Cloud, 
  AlertTriangle,
  Activity,
  BrainCircuit,
  RefreshCw,
  Camera,
  Clock,
  Maximize2
} from 'lucide-react';

const fetchWeatherData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        temp: (20 + Math.random() * 10).toFixed(1),
        hum: Math.floor(40 + Math.random() * 20),
        pres: Math.floor(1005 + Math.random() * 15),
        wind: (5 + Math.random() * 15).toFixed(1),
        lastPhotoUrl: "https://images.unsplash.com/photo-1592210633469-a1d09276883c?auto=format&fit=crop&q=80&w=1000",
        lastPhotoTime: "Chiar acum",
        forecast: {
          status: Math.random() > 0.5 ? "Cer Senin" : "Parțial Noros",
          confidence: Math.floor(85 + Math.random() * 10),
          summary: "Analiza AI sugerează menținerea condițiilor actuale."
        }
      });
    }, 1000); // 1 second delay to simulate network latency
  });
};

// Componentă pentru Cardurile de Senzori
const SensorCard = ({ title, value, unit, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 transition-all hover:shadow-md">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">
        {value} <span className="text-lg font-normal text-slate-400">{unit}</span>
      </h3>
    </div>
  </div>
);

const App = () => {
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  
  // Date simulate primite de la ESP32, Camera și Modelul AI
  const [weatherData, setWeatherData] = useState({
    temp: 24.5,
    hum: 45,
    pres: 1012,
    wind: 12.4,
    lastPhotoUrl: "https://images.unsplash.com/photo-1592210633469-a1d09276883c?auto=format&fit=crop&q=80&w=1000",
    lastPhotoTime: "Acum 15 minute",
    forecast: {
      status: "Cer Senin",
      confidence: 92,
      trend: "stable",
      summary: "Condițiile sunt stabile. Nu se prevăd precipitații în următoarele 6 ore."
    }
  });

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setWeatherData(prev => ({
        ...prev,
        temp: +(prev.temp + (Math.random() - 0.5)).toFixed(1),
        pres: +(prev.pres + (Math.random() - 0.5)).toFixed(1),
      }));
      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Stație Meteo <span className="text-blue-600">AI</span> + Vision
          </h1>
          <p className="text-slate-500 mt-1">Sistem avansat de monitorizare vizuală și predictivă</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizează Sistemul
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coloana Stânga: Senzori și Grafic (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SensorCard title="Temperatură" value={weatherData.temp} unit="°C" icon={Thermometer} color="bg-orange-500" />
            <SensorCard title="Umiditate" value={weatherData.hum} unit="%" icon={Droplets} color="bg-blue-500" />
            <SensorCard title="Presiune" value={weatherData.pres} unit="hPa" icon={Gauge} color="bg-indigo-500" />
            <SensorCard title="Viteză Vânt" value={weatherData.wind} unit="km/h" icon={Wind} color="bg-slate-600" />
          </div>

          {/* Secțiunea Camera - Visual Feed */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-500" />
                Monitorizare Vizuală (ESP32-CAM)
              </h3>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                <Clock className="w-3 h-3" />
                Ultima poză: {weatherData.lastPhotoTime}
              </div>
            </div>
            
            <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video">
              <img 
                src={weatherData.lastPhotoUrl} 
                alt="Weather Station Location" 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <button className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-white/30 transition-all">
                  <Maximize2 className="w-3 h-3" /> Vizualizare Completă
                </button>
              </div>
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-mono tracking-widest uppercase">
                REC ● LIVE_FEED_CAM_01
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center italic">
              * Imaginile sunt salvate automat la interval de 60 de minute pentru analiză istorică.
            </p>
          </div>
        </div>

        {/* Coloana Dreapta: AI și Alerte (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
            <BrainCircuit className="absolute top-[-10px] right-[-10px] w-32 h-32 text-white/10 rotate-12" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                <BrainCircuit className="w-3 h-3" />
                PREDICȚIE AI + VISION
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Sun className="w-12 h-12 text-yellow-300" />
                <div>
                  <h2 className="text-3xl font-bold">{weatherData.forecast.status}</h2>
                  <p className="text-indigo-100 text-sm">Încredere: {weatherData.forecast.confidence}%</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 mb-4 text-sm leading-relaxed">
                {weatherData.forecast.summary} AI-ul a detectat și analizat gradul de acoperire al norilor din ultima imagine.
              </div>
              <div className="text-[10px] text-indigo-200 uppercase tracking-wider font-bold">
                Analiză completă la: {lastUpdate}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Status Hardware
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-500">ESP32-CORE</span>
                <span className="text-xs text-green-600 font-bold">CONECTAT</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-500">OV2640 CAMERA</span>
                <span className="text-xs text-green-600 font-bold">GATA</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-500">SD CARD (LOCAL)</span>
                <span className="text-xs text-amber-600 font-bold">LIPSĂ</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between text-slate-400 text-sm gap-4">
        <p>© 2024 Proiect Licență - Inteligență Artificială Aplicată în IoT</p>
        <div className="flex gap-6">
          <span className="flex items-center gap-1 font-medium"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Sistem Activ</span>
          <span className="text-slate-300">|</span>
          <span className="font-medium text-slate-500">Model: ResNet-18 Lite (Vision)</span>
        </div>
      </footer>
    </div>
  );
};

export default App;