// src/components/SiteDetail.jsx
import React, { useState, useEffect } from 'react';
import { siteService } from '../services/siteService';

export const SiteDetail = ({ siteId, onBack, onSelectSensor }) => {
  const [site, setSite] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        setLoading(true);
        const [siteData, sensorsData] = await Promise.all([
          siteService.getSiteById(siteId),
          siteService.getSensorsBySite(siteId)
        ]);
        setSite(siteData);
        setSensors(Array.isArray(sensorsData) ? sensorsData : sensorsData.items || []);
      } catch (error) {
        console.error('Error al cargar el detalle del centro:', error);
      } finally {
        setLoading(false);
      }
    };

    if (siteId) fetchDetailData();
  }, [siteId]);

  if (loading) return <div className="p-6 text-center">Cargando detalles del centro...</div>;
  if (!site) return <div className="p-6 text-center">No se encontró el centro.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-1"
      >
        ← Volver al listado
      </button>

      {/* Información General del Centro */}
      <div className="bg-white border rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{site.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
          <div><strong>Código:</strong> {site.code}</div>
          <div><strong>Zona:</strong> {site.zone || 'N/A'}</div>
          <div><strong>Ubicación:</strong> {site.location || 'N/A'}</div>
        </div>
      </div>

      {/* Lista Preliminar de Sensores */}
      <h3 className="text-xl font-semibold mb-4">Sensores Asociados</h3>
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-sm font-medium text-gray-600">Nombre / ID</th>
              <th className="p-3 text-sm font-medium text-gray-600">Tipo</th>
              <th className="p-3 text-sm font-medium text-gray-600">Estado</th>
              <th className="p-3 text-sm font-medium text-gray-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sensors.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">No hay sensores asociados a este centro.</td>
              </tr>
            ) : (
              sensors.map((sensor) => (
                <tr key={sensor._id || sensor.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{sensor.name || sensor.code}</td>
                  <td className="p-3 text-gray-600">{sensor.type || 'Sensor'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      sensor.status === 'ok' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {sensor.status || 'Desconocido'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectSensor(sensor._id || sensor.id)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      Ver Gráfico
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};