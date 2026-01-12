import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api'; 

const DashboardStudent = () => {
  const navigate = useNavigate();
  const numeStudent = localStorage.getItem('nume');
  
  const [sesiuni, setSesiuni] = useState([]);
  const [cereri, setCereri] = useState([]); 
  const [selectedFiles, setSelectedFiles] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSesiuni, resCereri] = await Promise.all([
        api.get('/sesiuni'),
        api.get('/cereri/student')
      ]);
      setSesiuni(resSesiuni.data);
      setCereri(resCereri.data);
      setError(''); 
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        navigate('/');
      } else {
        setError("Nu s-au putut încărca datele.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const areCerereActiva = cereri.some(c => 
    ['trimisa', 'preliminar_aprobata', 'fisier_incarcat', 'fisier_respins', 'final_aprobata'].includes(c.status)
  );

  const handleInscriere = async (sesiuneId) => {
    if (!window.confirm("Confirmi că vrei să aplici?")) return;
    setActionLoading(true);
    try {
      await api.post('/cereri', { sesiuneId });
      alert("Cerere trimisă!");
      fetchData(); 
    } catch (err) {
      alert("Eroare: " + (err.response?.data?.message || "Eroare server"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileChange = (cerereId, event) => {
    setSelectedFiles(prev => ({ ...prev, [cerereId]: event.target.files[0] }));
  };

  const handleUpload = async (cerereId) => {
    const file = selectedFiles[cerereId];
    if (!file) { alert("Selectează un fișier!"); return; }
    const formData = new FormData();
    formData.append('fisier', file);
    setActionLoading(true);
    try {
      await api.post(`/cereri/${cerereId}/upload-student`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert("Fișier încărcat!");
      fetchData();
    } catch (err) {
      alert("Eroare upload.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = async (cerereId, tip) => {
    try {
        const res = await api.get(`/fisiere/${cerereId}/${tip}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `document_${tip}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (e) {
        alert("Fișierul nu este disponibil.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
      
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow border-l-4 border-green-600">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Panou Student</h1>
            <p className="text-gray-600">Salut, {numeStudent}!</p>
          </div>
          <button onClick={handleLogout} className="btn-small btn-danger">
            Deconectare
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-blue-900 border-b pb-2">Dosarele Mele</h2>
          <div className="flex flex-col gap-4">
            {cereri.map((cerere) => (
              <div key={cerere.id} className="card card-row">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {cerere.sesiune?.titlu || "Titlu indisponibil"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Profesor: {cerere.sesiune?.profesor?.nume} {cerere.sesiune?.profesor?.prenume}
                  </p>
                  <span className={`badge ${
                    cerere.status === 'final_aprobata' ? 'bg-green-100 text-green-700' : 
                    cerere.status === 'respinsa' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {cerere.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="actions-container">
                  {cerere.fisier_profesor_path && (
                    <button 
                      onClick={() => handleDownload(cerere.id, 'profesor')}
                      className="btn-small btn-success"
                    >
                      📥 Descarcă
                    </button>
                  )}

                  {(cerere.status === 'preliminar_aprobata' || cerere.status === 'fisier_respins') && (
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-dashed">
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={(e) => handleFileChange(cerere.id, e)}
                        style={{ width: 'auto', fontSize: '12px' }}
                      />
                      <button
                        onClick={() => handleUpload(cerere.id)}
                        disabled={actionLoading}
                        className="btn-small"
                        style={{ minWidth: '80px' }}
                      >
                        Upload
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 text-blue-900 border-b pb-2">Sesiuni Disponibile pentru Înscriere</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sesiuni.map((sesiune) => {
            const aplicatLaAceasta = cereri.some(c => c.sesiuneId === sesiune.id && c.status !== 'respinsa');
            
            return (
              <div key={sesiune.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900 mb-1">{sesiune.titlu}</h3>
                  <div className="text-sm text-gray-700 mb-3 pb-2 border-b border-gray-100">
                    <span className="text-gray-500 text-xs uppercase font-bold mr-1">Coordonator:</span> 
                    <span className="font-semibold text-gray-800">
                      {sesiune.profesor ? `${sesiune.profesor.nume} ${sesiune.profesor.prenume}` : "Profesor Necunoscut"}
                    </span>
                  </div>
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-gray-600"><span className="font-semibold">Start:</span> {new Date(sesiune.data_start).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Stop:</span> {new Date(sesiune.data_stop).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase">Locuri:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-bold">{sesiune.numar_locuri_max}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex justify-center">
                  {aplicatLaAceasta ? (
                      <button disabled className="btn-small btn-secondary cursor-not-allowed">
                          ✅ Aplicat
                      </button>
                  ) : areCerereActiva ? (
                      <button disabled className="btn-small btn-secondary opacity-50 cursor-not-allowed">
                          🚫 Cerere activă
                      </button>
                  ) : (
                      <button 
                        onClick={() => handleInscriere(sesiune.id)}
                        disabled={actionLoading}
                        className="btn-small btn-success shadow-md"
                      >
                        Aplică acum
                      </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardStudent;