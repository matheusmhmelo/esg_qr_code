import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Logo from './logo.png'

const theme = createTheme();
const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

export default function Confirm() {
  const navigate = useNavigate();
  const { value } = useParams()
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function successFunction() {
    await delay(1000);
    setLoading(false)
    setSuccess(true)
  }

  useEffect(() => {
    setLoading(true)
    successFunction()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="m" style={{ marginBottom: '30px' }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={Logo} alt="logo" style={{ height: '35%', width: '35%', borderRadius: '50%'}}/>
          <Typography component="h1" variant="h5">
            Por dentro da ESG
          </Typography>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {loading ? <CircularProgress /> : (
              <>
                {success ? (
                  <Alert severity="success">
                    <AlertTitle>Sucesso</AlertTitle>
                    QR Code registrado com sucesso -- <b>{value}</b>
                  </Alert>
                ) : null}
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => {
                    navigate("/scan")
                  }}
                >
                  Escanear novamente
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}