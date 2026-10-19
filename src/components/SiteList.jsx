// src/components/SitesList.jsx
import React, { useState, useEffect } from 'react';
import { siteService } from '../services/siteService';

export const SitesList = ({ onSelectSite }) => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      setLoading(true);
      const data = await siteService.getSites();
      setSites(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      console.error('Error al cargar los centros:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado local por nombre/código y zona
  const filteredSites = sites.filter((site) => {
    const matchesSearch = 
      site.name?.toLowerCase().includes(search.toLowerCase()) ||
      site.code?.toLowerCase().includes(search.toLowerCase());
    const matchesZone = zoneFilter ? site.zone === zoneFilter : true;
    return matchesSearch && matchesZone;
  });

  // Paginación
  const totalPages = Math.ceil(filteredSites.length / pageSize);
  const paginatedSites = filteredSites.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <div className="p-6 text-center">Cargando centros de cultivo...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Centros de Cultivo</h2>

      {/* Controles de Buscador y Filtro */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="p-2 border rounded-md flex-1"
        />
        <input
          type="text"
          placeholder="Filtrar por zona..."
          value={zoneFilter}
          onChange={(e) => { setZoneFilter(e.target.value); setPage(1); }}
          className="p-2 border rounded-md md:w-64"
        />
      </div>

      {/* Tarjetas Responsivas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedSites.map((site) => (
          <div key={site._id || site.id} className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-600">{site.name}</h3>
            <p className="text-sm text-gray-500 mb-2">Código: {site.code}</p>
            <p className="text-sm text-gray-700 mb-4">Zona: {site.zone || 'No especificada'}</p>
            <button
              onClick={() => onSelectSite(site._id || site.id)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Ver Detalle
            </button>
          </div>
        ))}
      </div>

      {/* Controles de Paginación */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm">Página {page} de {totalPages || 1}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};