import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import studentStyles from './student';

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
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        alert("Eroare: " + data.errors.join("\n"));
      } else {
        alert("Eroare: " + (data?.message || "Eroare server"));
      }
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
      alert("Fișierul nu este disponibil.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const styles = studentStyles;


  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <div style={styles.headerInfo}>
            <h1 style={styles.title}>Panou Student</h1>
            <p style={styles.subtitle}>Salut, {numeStudent}!</p>
          </div>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Dosarele Mele</h2>
          <div style={styles.cereriContainer}>
            {cereri.map((cerere) => (
              <div key={cerere.id} style={styles.cerereCard}>
                <div style={styles.cerereInfo}>
                  <h3 style={styles.cerereTitle}>
                    {cerere.sesiune?.titlu || "Titlu indisponibil"}
                  </h3>
                  <p style={styles.cerereProfesor}>
                    Profesor: {cerere.sesiune?.profesor?.nume} {cerere.sesiune?.profesor?.prenume}
                  </p>
                  <span style={{
                    ...styles.badge,
                    ...(cerere.status === 'final_aprobata' ? styles.badgeSuccess :
                      cerere.status === 'respinsa' ? styles.badgeDanger : styles.badgeInfo)
                  }}>
                    {cerere.status.replace('_', ' ')}
                  </span>
                </div>

                <div style={styles.actionsContainer}>
                  {cerere.fisier_profesor_path && (
                    <button
                      onClick={() => handleDownload(cerere.id, 'profesor')}
                      style={{ ...styles.button, ...styles.buttonSuccess }}
                    >
                      📥 Descarcă
                    </button>
                  )}

                  {(cerere.status === 'preliminar_aprobata' || cerere.status === 'fisier_respins') && (
                    <div style={styles.uploadContainer}>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(cerere.id, e)}
                        style={styles.fileInput}
                      />
                      <button
                        onClick={() => handleUpload(cerere.id)}
                        disabled={actionLoading}
                        style={{
                          ...styles.button,
                          ...styles.buttonPrimary,
                          minWidth: '80px',
                          ...(actionLoading && { opacity: 0.5, cursor: 'not-allowed' })
                        }}
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

        <h2 style={styles.sectionTitle}>Sesiuni Disponibile pentru Înscriere</h2>

        <div style={styles.sesiuniGrid}>
          {sesiuni.map((sesiune) => {
            const aplicatLaAceasta = cereri.some(c => c.sesiuneId === sesiune.id && c.status !== 'respinsa');

            return (
              <div
                key={sesiune.id}
                style={styles.sesiuneCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
                }}
              >
                <div style={styles.sesiuneGradient}></div>
                <div style={styles.sesiuneContent}>
                  <h3 style={styles.sesiuneTitle}>{sesiune.titlu}</h3>
                  <div style={styles.sesiuneCoordinator}>
                    <span style={styles.sesiuneLabel}>Coordonator:</span>
                    <span style={{ fontWeight: '600', color: '#ffffff' }}>
                      {sesiune.profesor ? `${sesiune.profesor.nume} ${sesiune.profesor.prenume}` : "Profesor Necunoscut"}
                    </span>
                  </div>
                  <div style={styles.sesiuneDetails}>
                    <p style={styles.sesiuneDetail}>
                      <span style={{ fontWeight: '600' }}>Start:</span> {new Date(sesiune.data_start).toLocaleDateString()}
                    </p>
                    <p style={styles.sesiuneDetail}>
                      <span style={{ fontWeight: '600' }}>Stop:</span> {new Date(sesiune.data_stop).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={styles.sesiuneLocuri}>
                    <span style={styles.sesiuneLabel}>Locuri:</span>
                    <span style={styles.locuriValue}>{sesiune.numar_locuri_max}</span>
                  </div>
                </div>

                <div style={styles.sesiuneFooter}>
                  {aplicatLaAceasta ? (
                    <button disabled style={{ ...styles.button, ...styles.buttonSecondary }}>
                      ✅ Aplicat
                    </button>
                  ) : areCerereActiva ? (
                    <button disabled style={{ ...styles.button, ...styles.buttonSecondary, opacity: 0.5 }}>
                      🚫 Cerere activă
                    </button>
                  ) : (
                    <button
                      onClick={() => handleInscriere(sesiune.id)}
                      disabled={actionLoading}
                      style={{
                        ...styles.button,
                        ...styles.buttonSuccess,
                        ...(actionLoading && { opacity: 0.5, cursor: 'not-allowed' })
                      }}
                    >
                      Aplică acum
                    </button>
                  )}
                </div>
              </div>
            )
          })}
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

export default DashboardStudent;