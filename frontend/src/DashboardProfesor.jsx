import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import profesorStyles from './profesor';

const DashboardProfesor = () => {
  const navigate = useNavigate();
  const numeProfesor = localStorage.getItem('nume') || 'Profesor';

  const [cereri, setCereri] = useState([]);
  const [sesiuni, setSesiuni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const [newSesiune, setNewSesiune] = useState({
    titlu: '',
    data_start: '',
    data_stop: '',
    numar_locuri_max: 10
  });

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
      const data = err.response?.data;
      if (data) {
        if (data.errors && Array.isArray(data.errors)) {
          alert(data.errors.join('\n'));
        } else if (data.message) {
          alert(data.message);
        } else if (typeof data === 'string') {
          alert(data);
        } else {
          alert("Eroare la creare");
        }
      } else {
        alert("Eroare la creare");
      }
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
      const msg = err.response?.data?.message || "Nu se poate șterge o sesiune cu cereri active.";
      alert(msg);
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
      //extensie docx sau pdf
      const contentType = res.headers['content-type'] || '';
      let extension = 'pdf';
      if (contentType.includes('wordprocessingml') || contentType.includes('msword')) {
        extension = 'docx';
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document_${tip}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert("Fișier negăsit.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const cereriAfisate = !showHistory
    ? cereri.filter(c => ['trimisa', 'preliminar_aprobata', 'fisier_incarcat', 'fisier_respins'].includes(c.status))
    : cereri.filter(c => ['final_aprobata', 'respinsa'].includes(c.status));

  const styles = profesorStyles;


  if (isCreating) {
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalCard}>
          <h2 style={styles.modalTitle}>Sesiune Nouă</h2>
          <form onSubmit={handleCreateSesiune} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Titlu Proiect</label>
              <input
                required
                style={styles.input}
                type="text"
                placeholder="Introduceți titlul proiectului"
                value={newSesiune.titlu}
                onChange={e => setNewSesiune({ ...newSesiune, titlu: e.target.value })}
              />
            </div>

            <div style={styles.dateGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Data Start</label>
                <input
                  required
                  style={styles.input}
                  type="date"
                  value={newSesiune.data_start}
                  onChange={e => setNewSesiune({ ...newSesiune, data_start: e.target.value })}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Data Stop</label>
                <input
                  required
                  style={styles.input}
                  type="date"
                  value={newSesiune.data_stop}
                  onChange={e => setNewSesiune({ ...newSesiune, data_stop: e.target.value })}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Capacitate Studenți</label>
              <input
                required
                style={styles.input}
                type="number"
                min="1"
                value={newSesiune.numar_locuri_max}
                onChange={e => setNewSesiune({ ...newSesiune, numar_locuri_max: e.target.value })}
              />
            </div>

            <div style={styles.modalButtons}>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                style={{ ...styles.button, ...styles.buttonDanger, minWidth: '120px' }}
              >
                Anulează
              </button>

              <button
                type="submit"
                disabled={actionLoading}
                style={{
                  ...styles.button,
                  ...styles.buttonSuccess,
                  minWidth: '120px',
                  ...(actionLoading && { opacity: 0.5, cursor: 'not-allowed' })
                }}
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
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <div style={styles.headerInfo}>
            <h1 style={styles.title}>Panou Profesor</h1>
            <p style={styles.subtitle}>Profesor {numeProfesor}</p>
          </div>
          <div style={styles.buttonContainer}>
            <button
              onClick={() => setIsCreating(true)}
              style={styles.createButton}
            >
              + Sesiune Nouă
            </button>
          </div>
        </div>

        <div style={styles.mainGrid}>
          <section style={styles.mainSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                {showHistory ? "Istoric Cereri" : "Cereri în Curs"}
              </h2>

              <button
                onClick={() => setShowHistory(!showHistory)}
                style={{
                  ...styles.toggleButton,
                  ...(showHistory ? styles.toggleButtonActive : styles.toggleButtonInactive)
                }}
              >
                {showHistory ? "Vezi Active" : "Vezi Istoric"}
              </button>
            </div>

            <div style={styles.cereriContainer}>
              {cereriAfisate.length > 0 ? (
                cereriAfisate.map(c => (
                  <div key={c.id} style={styles.cerereCard}>
                    <div style={styles.cerereInfo}>
                      <h3 style={styles.cerereTitle}>
                        {c.student?.nume} {c.student?.prenume}
                      </h3>
                      <p style={styles.cerereEmail}>{c.student?.email}</p>
                      <span style={styles.badge}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={styles.actionsContainer}>
                      {c.fisier_student_path && (
                        <button
                          onClick={() => handleDownload(c.id, 'student')}
                          style={{ ...styles.button, ...styles.buttonSecondary }}
                        >
                          Cerere Student
                        </button>
                      )}

                      {c.status === 'trimisa' && (
                        <>
                          <button
                            onClick={() => handleActiuneCerere(c.id, 'aproba')}
                            style={{ ...styles.button, ...styles.buttonSuccess }}
                          >
                            Aprobă
                          </button>
                          <button
                            onClick={() => handleActiuneCerere(c.id, 'respinge')}
                            style={{ ...styles.button, ...styles.buttonDanger }}
                          >
                            Respinge
                          </button>
                        </>
                      )}

                      {['preliminar_aprobata', 'fisier_incarcat', 'fisier_respins'].includes(c.status) && (
                        <div style={styles.uploadContainer}>
                          <input
                            type="file"
                            onChange={(e) => setSelectedFiles({ ...selectedFiles, [c.id]: e.target.files[0] })}
                            style={styles.fileInput}
                          />
                          <button
                            onClick={() => handleUploadFinal(c.id)}
                            style={{ ...styles.button, ...styles.buttonSuccess }}
                          >
                            Finalizează
                          </button>
                        </div>
                      )}

                      {c.status === 'final_aprobata' && (
                        <button
                          onClick={() => handleDownload(c.id, 'profesor')}
                          style={{ ...styles.button, ...styles.buttonSuccess }}
                        >
                          DOC FINAL
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  <p style={styles.emptyText}>Nu există cereri de afișat în această secțiune.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div style={styles.sesiuniSection}>
          <h2 style={styles.sectionTitle}>Sesiunile Mele</h2>

          <div style={styles.sesiuniGrid}>
            {sesiuni.map((s) => (
              <div
                key={s.id}
                style={styles.sesiuneCard}
              >
                <div style={styles.sesiuneGradient}></div>
                <div style={styles.sesiuneContent}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <h3 style={styles.sesiuneTitle}>{s.titlu}</h3>
                    <button
                      onClick={() => handleDeleteSesiune(s.id)}
                      disabled={s.locuri_ocupate > 0}
                      style={{
                        ...styles.deleteButton,
                        ...(s.locuri_ocupate > 0 && {
                          opacity: 0.5,
                          cursor: 'not-allowed',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        })
                      }}
                      title={s.locuri_ocupate > 0 ? "Această sesiune are cereri aprobate și nu poate fi ștearsă" : "Șterge sesiunea"}
                    >
                      Șterge
                    </button>
                  </div>

                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${(s.locuri_ocupate / s.numar_locuri_max) * 100}%`,
                        background: s.locuri_ramase <= 0
                          ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                          : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                      }}
                    />
                  </div>

                  <div style={styles.progressInfo}>
                    <span style={styles.progressLabel}>
                      {s.locuri_ocupate} / {s.numar_locuri_max} Locuri
                    </span>
                    <span style={{
                      color: s.locuri_ramase <= 0 ? '#ef4444' : '#10b981',
                      fontWeight: '700'
                    }}>
                      {s.locuri_ramase} libere
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div style={styles.footerContainer}>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Deconectare
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfesor;