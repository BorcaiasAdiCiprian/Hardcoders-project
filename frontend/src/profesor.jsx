const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '24px',
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    maxWidth: {
        maxWidth: '1000px',
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
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    subtitle: {
        color: '#667eea',
        fontSize: '15px',
        margin: 0,
        fontWeight: '600'
    },
    buttonContainer: {
        display: 'flex',
        gap: '12px',
        marginTop: '16px'
    },
    createButton: {
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        border: 'none',
        borderRadius: '999px',
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
    },
    mainGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
    },
    mainSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '16px',
        marginBottom: '24px',
        borderBottom: '2px solid rgba(102, 126, 234, 0.3)'
    },
    sectionTitle: {
        fontSize: '22px',
        fontWeight: '800',
        color: '#ffffff',
        margin: 0,
        whiteSpace: 'nowrap'
    },
    toggleButton: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '20%',
        justifyContent: 'center'
    },
    toggleButtonActive: {
        background: 'rgba(17, 206, 3, 0.59)',
        color: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    toggleButtonInactive: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
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
        marginBottom: '6px'
    },
    cerereEmail: {
        fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: '12px'
    },
    badge: {
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        background: 'rgba(102, 126, 234, 0.2)',
        color: '#93c5fd',
        border: '1px solid rgba(102, 126, 234, 0.3)'
    },
    actionsContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap'
    },
    button: {
        padding: '10px 18px',
        border: 'none',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        // whiteSpace: 'nowrap'
    },
    buttonSecondary: {
        background: 'rgba(100, 116, 139, 0.3)',
        color: '#cbd5e1',
        border: '1px solid rgba(148, 163, 184, 0.3)'
    },
    buttonSuccess: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
    },
    buttonDanger: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
    },
    uploadContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(102, 126, 234, 0.1)',
        padding: '10px',
        borderRadius: '10px',
        border: '2px dashed rgba(102, 126, 234, 0.3)'
    },
    fileInput: {
        fontSize: '12px',
        color: '#ffffff',
        width: '250px',
        flex: 1
    },
    emptyState: {
        padding: '48px',
        textAlign: 'center',
        background: 'rgba(30, 30, 46, 0.5)',
        borderRadius: '16px',
        border: '2px dashed rgba(255, 255, 255, 0.1)'
    },
    emptyText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontStyle: 'italic',
        fontSize: '14px'
    },
    sesiuniSection: {
        marginTop: '24px'
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
        marginBottom: '16px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    deleteButton: {
        background: 'rgba(239, 68, 68, 0.2)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#fca5a5',
        fontSize: '11px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        padding: '4px 8px',
        borderRadius: '6px',
        // whiteSpace: 'nowrap'
        width: '20%'
    },
    progressBar: {
        width: '100%',
        height: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '999px',
        overflow: 'hidden',
        marginTop: '12px'
    },
    progressFill: {
        height: '100%',
        transition: 'all 0.5s ease',
        borderRadius: '999px'
    },
    progressInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '10px',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginTop: '6px'
    },
    progressLabel: {
        color: 'rgba(255, 255, 255, 0.5)'
    },
    footerContainer: {
        marginTop: '48px',
        paddingTop: '24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'center'
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
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 9999
    },
    modalCard: {
        background: 'rgba(30, 30, 46, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '32px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        maxWidth: '480px',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderTop: '4px solid #667eea'
    },
    modalTitle: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: '24px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '12px',
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.6)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '1px'
    },
    input: {
        width: '100%',
        padding: '14px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        outline: 'none',
        color: '#ffffff',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box'
    },
    inputFocused: {
        background: 'rgba(255, 255, 255, 0.08)',
        border: '2px solid #667eea'
    },
    dateGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
    },
    modalButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '24px',
        gap: '12px'
    }
};

export default styles;
