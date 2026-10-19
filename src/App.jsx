// src/App.jsx
import { useState } from 'react';
import './App.css';
import { SitesList } from './components/SiteList';
import { SiteDetail } from './components/SiteDetails';

function App() {
  const [currentView, setCurrentView] = useState('list'); // 'list' o 'detail'
  const [selectedSiteId, setSelectedSiteId] = useState(null);

  // Ir al detalle de un centro específico
  const handleSelectSite = (siteId) => {
    if (!siteId) return;

    setSelectedSiteId(siteId);
    setCurrentView('detail');
  };

  // Volver al listado principal
  const handleBackToList = () => {
    setSelectedSiteId(null);
    setCurrentView('list');
  };

  // Acción provisional para cuando selecciones un sensor
  const handleSelectSensor = (sensorId) => {
    if (!sensorId) return;
    alert(`Aquí navegarás al detalle/gráfico del sensor con ID: ${sensorId}`);
  };

  const isDetailView = currentView === 'detail' && selectedSiteId !== null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Cabecera de la aplicación */}
      <header className="bg-white border-b shadow-sm py-4 px-6 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 cursor-pointer" onClick={handleBackToList}>
          Monitoreo de Centros de Cultivo
        </h1>
        {isDetailView && (
          <button
            type="button"
            onClick={handleBackToList}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded transition"
          >
            ← Volver a Centros
          </button>
        )}
      </header>

      {/* Contenido principal según la vista activa */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {currentView === 'list' && (
          <SitesList onSelectSite={handleSelectSite} />
        )}

        {isDetailView && (
          <SiteDetail
            siteId={selectedSiteId}
            onBack={handleBackToList}
            onSelectSensor={handleSelectSensor}
          />
        )}
      </main>
    </div>
  );
}

export default App;