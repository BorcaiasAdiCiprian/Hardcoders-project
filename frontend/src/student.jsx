const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '24px',
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    maxWidth: {
        maxWidth: '1200px',
        margin: '0 auto'
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '32px',
        background: 'rgba(30, 30, 46, 0.85)',
        backdropFilter: 'blur(20px)',
        padding: '20px 28px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderLeft: '4px solid #667eea'
    },
    headerInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#ffffff',
        margin: 0,
        whiteSpace: 'nowrap'
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '15px',
        margin: 0
    },
    logoutButton: {
        padding: '10px 20px',
        background: '#dc2626',
        border: 'none',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
    },
    errorBox: {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderLeft: '4px solid #ef4444',
        color: '#fca5a5',
        padding: '14px 16px',
        borderRadius: '12px',
        marginBottom: '24px',
        fontSize: '14px',
        fontWeight: '500'
    },
    section: {
        marginBottom: '40px'
    },
    sectionTitle: {
        fontSize: '22px',
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '2px solid rgba(102, 126, 234, 0.3)'
    },
    cereriContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    cerereCard: {
        background: 'rgba(30, 30, 46, 0.85)',
        backdropFilter: 'blur(20px)',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
    },
    cerereInfo: {
        flex: 1,
        minWidth: '250px'
    },
    cerereTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: '8px'
    },
    cerereProfesor: {
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: '12px'
    },
    badge: {
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase'
    },
    badgeSuccess: {
        background: 'rgba(34, 197, 94, 0.2)',
        color: '#86efac'
    },
    badgeDanger: {
        background: 'rgba(239, 68, 68, 0.2)',
        color: '#fca5a5'
    },
    badgeInfo: {
        background: 'rgba(59, 130, 246, 0.2)',
        color: '#93c5fd'
    },
    actionsContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    buttonSuccess: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
    },
    buttonPrimary: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
    },
    buttonSecondary: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        cursor: 'not-allowed'
    },
    uploadContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '12px',
        borderRadius: '12px',
        border: '2px dashed rgba(255, 255, 255, 0.2)'
    },
    fileInput: {
        fontSize: '12px',
        color: '#ffffff',
        width: 'auto'
    },
    sesiuniGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px'
    },
    sesiuneCard: {
        background: 'rgba(30, 30, 46, 0.85)',
        backdropFilter: 'blur(20px)',
        padding: '28px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
    },
    sesiuneGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
    },
    sesiuneContent: {
        flex: 1
    },
    sesiuneTitle: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#667eea',
        marginBottom: '12px'
    },
    sesiuneCoordinator: {
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    sesiuneLabel: {
        fontSize: '11px',
        textTransform: 'uppercase',
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.5)',
        marginRight: '6px'
    },
    sesiuneDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '16px'
    },
    sesiuneDetail: {
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)'
    },
    sesiuneLocuri: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px'
    },
    locuriValue: {
        background: 'rgba(34, 197, 94, 0.2)',
        color: '#86efac',
        padding: '4px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '700'
    },
    sesiuneFooter: {
        marginTop: 'auto',
        paddingTop: '16px',
        display: 'flex',
        justifyContent: 'center'
    },
    footerContainer: {
        marginTop: '48px',
        paddingTop: '24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'center'
    }
};

export default styles;
