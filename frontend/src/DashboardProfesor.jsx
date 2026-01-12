import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const DashboardProfesor = () => {
  const navigate = useNavigate();
  const numeProfesor = localStorage.getItem('nume') || 'Profesor';
  
  //  STATE 
  const [cereri, setCereri] = useState([]);
  const [sesiuni, setSesiuni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false); // Toggle: false = Active, true = Istoric
  const [selectedFiles, setSelectedFiles] = useState({}); 
  const [actionLoading, setActionLoading] = useState(false);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newSesiune, setNewSesiune] = useState({
    titlu: '',
    data_start: '',
    data_stop: '',
    numar_locuri_max: 10
  });

  //  FETCH DATA 
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSesiuni, resCereri] = await Promise.all([
        api.get('/sesiuni/personale').catch(e => ({ data: [] })),
        api.get('/cereri/profesor').catch(e => ({ data: [] }))
      ]);

      const sesiuniProcesate = resSesiuni.data.map(s => {
        const max = s.numar_locuri_max || s.numarLocuriMax || s.nr_locuri || 0;
        const ocupate = s.locuri_ocupate || s.locuriOcupate || 0;
        return {
          ...s,
          id: s.id || s.ID,
          titlu: s.titlu || `Sesiune #${s.id}`,
          numar_locuri_max: max,
          locuri_ocupate: ocupate,
          locuri_ramase: max - ocupate
        };
      });

      setSesiuni(sesiuniProcesate);
      setCereri(Array.isArray(resCereri.data) ? resCereri.data : []);
    } catch (err) {
      console.error("Eroare la încărcare:", err);
    } finally {
      setLoading(false);
    }
  };    

  useEffect(() => {
    fetchData();
  }, []);

  //HANDLERS 
  const handleCreateSesiune = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post('/sesiuni', newSesiune);
      alert("Sesiune creată!");
      setIsCreating(false);
      setNewSesiune({ titlu: '', data_start: '', data_stop: '', numar_locuri_max: 10 });
      fetchData();
    } catch (err) {
      alert("Eroare la creare");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSesiune = async (id) => {
    if (!window.confirm("Ștergi această sesiune?")) return;
    try {
      await api.delete(`/sesiuni/${id}`);
      fetchData();
    } catch (err) {
      alert("Nu se poate șterge o sesiune cu cereri active.");
    }
  };

  const handleActiuneCerere = async (cerereId, tipActiune) => {
    let justificare = null;
    if (tipActiune === 'respinge') {
      justificare = prompt("Motivul respingerii:");
      if (justificare === null) return;
    }
    try {
      await api.put(`/cereri/${cerereId}/actiune-preliminara`, { actiune: tipActiune, justificare });
      fetchData();
    } catch (err) {
      alert("Eroare la procesare");
    }
  };

  const handleUploadFinal = async (cerereId) => {
    const file = selectedFiles[cerereId];
    if (!file) return alert("Selectează fișierul!");
    const formData = new FormData();
    formData.append('fisier', file);
    formData.append('actiune', 'aproba_final');
    setActionLoading(true);
    try {
      await api.post(`/cereri/${cerereId}/raspuns-profesor`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Finalizat!");
      fetchData();
    } catch (err) {
      alert("Eroare la încărcare");
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
      alert("Fișier negăsit.");
    }
  };

  //  LOGICA FILTRARE
  const cereriAfisate = !showHistory 
    ? cereri.filter(c => ['trimisa', 'preliminar_aprobata', 'fisier_incarcat', 'fisier_respins'].includes(c.status))
    : cereri.filter(c => ['final_aprobata', 'respinsa'].includes(c.status));

  // MODAL CREARE
if (isCreating) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full border-t-4 border-indigo-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Sesiune Nouă</h2>
        <form onSubmit={handleCreateSesiune} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Titlu Proiect</label>
            <input required className="w-full border p-2 rounded" type="text"
              value={newSesiune.titlu} onChange={e => setNewSesiune({...newSesiune, titlu: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input required className="border p-2 rounded" type="date"
              value={newSesiune.data_start} onChange={e => setNewSesiune({...newSesiune, data_start: e.target.value})} />
            <input required className="border p-2 rounded" type="date"
              value={newSesiune.data_stop} onChange={e => setNewSesiune({...newSesiune, data_stop: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium">Capacitate Studenți</label>
            <input required className="w-full border p-2 rounded mt-1" type="number"
                value={newSesiune.numar_locuri_max} onChange={e => setNewSesiune({...newSesiune, numar_locuri_max: e.target.value})} />
          </div>

          <div className="flex justify-between items-center pt-6">
            <button 
              type="button" 
              onClick={() => setIsCreating(false)} 
              className="btn-small btn-danger"
              style={{ minWidth: '100px' }}
            >
              Anulează
            </button>
            
            <button 
              type="submit" 
              disabled={actionLoading}
              className="btn-small btn-success"
              style={{ minWidth: '100px' }}
            >
              {actionLoading ? "Se salvează..." : "Creează"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm mb-8 border-b-2 border-indigo-500">
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase">Panou Profesor</h1>
            <p className="text-indigo-600 font-medium">Profesor {numeProfesor}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setIsCreating(true)} className="btn-small btn-success" style={{borderRadius: '999px', padding: '10px 20px'}}>
              + Sesiune Nouă
            </button>
            <button onClick={() => { localStorage.clear(); navigate('/'); }} className="btn-small btn-danger">
              Deconectare
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <section className="lg:col-span-3 space-y-6">
            
            
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-xl font-bold text-blue-900">
                {showHistory ? "📜 Istoric Cereri" : "⚡ Cereri în Curs"}
              </h2>

              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`btn-small flex items-center gap-2 transition-all duration-300 ${
                  showHistory ? "bg-indigo-600 text-white shadow-inner" : "bg-gray-200 text-gray-700"
                }`}
                style={{ borderRadius: '8px', minWidth: '180px' }}
              >
                {showHistory ? "⬅️ Vezi Active" : "📜 Vezi Istoric"}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {cereriAfisate.length > 0 ? (
                cereriAfisate.map(c => (
                  <div key={c.id} className="card card-row">
                    <div style={{ minWidth: 'fit-content' }}>
                      <h3 className="font-bold text-gray-800 text-lg">{c.student?.nume} {c.student?.prenume}</h3>
                      <p className="text-sm text-gray-500">{c.student?.email}</p>
                      <span className="badge bg-indigo-50 text-indigo-700 mt-2 inline-block border border-indigo-100">
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="actions-container">
                      {c.fisier_student_path && (
                        <button onClick={() => handleDownload(c.id, 'student')} className="btn-small btn-secondary">
                          📄 Cerere Student
                        </button>
                      )}
                      
                      {c.status === 'trimisa' && (
                        <>
                          <button onClick={() => handleActiuneCerere(c.id, 'aproba')} className="btn-small btn-success">Aprobă</button>
                          <button onClick={() => handleActiuneCerere(c.id, 'respinge')} className="btn-small btn-danger">Respinge</button>
                        </>
                      )}

                      {['preliminar_aprobata', 'fisier_incarcat', 'fisier_respins'].includes(c.status) && (
                        <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg border border-dashed border-indigo-200">
                          <input type="file" onChange={(e) => setSelectedFiles({...selectedFiles, [c.id]: e.target.files[0]})} className="text-[10px] w-32" />
                          <button onClick={() => handleUploadFinal(c.id)} className="btn-small btn-success">Finalizează</button>
                        </div>
                      )}

                      {c.status === 'final_aprobata' && (
                        <button onClick={() => handleDownload(c.id, 'profesor')} className="btn-small btn-success">
                          ✅ DOC FINAL
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center bg-white rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-400 italic">Nu există cereri de afișat în această secțiune.</p>
                </div>
              )}
            </div>
          </section>

          {/*de verificat aici de ce nu afiseaza sesiunile profesorului*/}
          <aside className="lg:col-span-1">
            <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-indigo-500 sticky top-6">
              <h2 className="font-black text-gray-800 mb-6 uppercase text-sm">Sesiunile Mele</h2>
              <div className="space-y-6">
                {sesiuni.map(s => (
                  <div key={s.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800 text-sm leading-tight">{s.titlu}</h4>
                      <button onClick={() => handleDeleteSesiune(s.id)} className="text-gray-300 hover:text-red-500">✕</button>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${s.locuri_ramase <= 0 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                        style={{ width: `${(s.locuri_ocupate / s.numar_locuri_max) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] mt-1 font-bold text-gray-500 uppercase">
                      <span>{s.locuri_ocupate} / {s.numar_locuri_max} Locuri</span>
                      <span className={s.locuri_ramase <= 0 ? 'text-red-500' : 'text-green-600'}>
                        {s.locuri_ramase} libere
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default DashboardProfesor;