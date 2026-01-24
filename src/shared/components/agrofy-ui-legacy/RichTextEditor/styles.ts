export const editorStyles = {
  '& .ProseMirror': {
    outline: 'none',
    minHeight: '320px',
    padding: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#374151',
    
    '& p': {
      margin: '0 0 12px 0',
    },
    
    '& h1': {
      fontSize: '2em',
      fontWeight: 700,
      margin: '16px 0 12px 0',
      lineHeight: 1.3,
    },
    
    '& h2': {
      fontSize: '1.5em',
      fontWeight: 700,
      margin: '14px 0 10px 0',
      lineHeight: 1.3,
    },
    
    '& h3': {
      fontSize: '1.25em',
      fontWeight: 600,
      margin: '12px 0 8px 0',
      lineHeight: 1.3,
    },
    
    '& ul, & ol': {
      paddingLeft: '24px',
      margin: '0 0 12px 0',
    },
    
    '& li': {
      marginBottom: '4px',
    },
    
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '8px',
      display: 'block',
      margin: '12px 0',
      cursor: 'pointer',
      
      '&.ProseMirror-selectednode': {
        outline: '2px solid #2563EB',
      },
    },
    
    '& strong': {
      fontWeight: 700,
    },
    
    '& em': {
      fontStyle: 'italic',
    },
    
    '& u': {
      textDecoration: 'underline',
    },
    
    '& s': {
      textDecoration: 'line-through',
    },
    
    '& code': {
      backgroundColor: '#F3F4F6',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '0.9em',
      fontFamily: 'monospace',
    },
    
    '& pre': {
      backgroundColor: '#1F2937',
      color: '#F9FAFB',
      padding: '12px',
      borderRadius: '8px',
      overflow: 'auto',
      margin: '0 0 12px 0',
      
      '& code': {
        backgroundColor: 'transparent',
        padding: 0,
        color: 'inherit',
      },
    },
    
    '& blockquote': {
      borderLeft: '4px solid #E5E7EB',
      paddingLeft: '16px',
      margin: '0 0 12px 0',
      color: '#6B7280',
      fontStyle: 'italic',
    },
    
    '& hr': {
      border: 'none',
      borderTop: '2px solid #E5E7EB',
      margin: '20px 0',
    },
    
    '& p.is-editor-empty:first-child::before': {
      content: 'attr(data-placeholder)',
      float: 'left',
      color: '#9CA3AF',
      pointerEvents: 'none',
      height: 0,
    },
  },
};

export const toolbarStyles = {
  display: 'flex',
  gap: 1,
  flexWrap: 'wrap',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid #E5E7EB',
  marginBottom: '16px',
};

export const toolbarButtonStyles = {
  minWidth: '32px',
  height: '32px',
  padding: '6px',
  border: '1px solid #E5E7EB',
  borderRadius: '6px',
  backgroundColor: 'white',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  color: '#374151',
  
  '&:hover': {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  
  '&.is-active': {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
    color: '#2563EB',
  },
  
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

export const dividerStyles = {
  width: '1px',
  height: '24px',
  backgroundColor: '#E5E7EB',
  margin: '0 4px',
};
