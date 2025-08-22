import Box from '@mui/material/Box';

interface BoxComponentProps {
  children?: React.ReactNode;
}

const BoxComponent: React.FC<BoxComponentProps> = ({
  children,
}) => {
  return (
    <Box 
      component="span" 
      sx={{ 
        width: '100%',
        height: '100%',
        margin: '20px',
        border: '1px solid gray',
        borderRadius: '5px',
        padding: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      }}>
      {children}
    </Box>
  );
}

export default BoxComponent;