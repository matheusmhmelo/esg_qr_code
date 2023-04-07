import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
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
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import { format } from 'date-fns'

import Logo from '../logo.png'

const theme = createTheme();

export default function Confirm() {
  const confirmRef = useRef(false);
  const navigate = useNavigate();
  const { value } = useParams()
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function confirmQRCode(value) {
    setLoading(true)
    const date = format(new Date(), 'dd/MM/yyyy')

    const q = query(
      collection(db, "confirmados"),
      where("qr_id", "==", value),
      where("date", "==", date)
    );
    
    const files = await getDocs(q);
    if (files?.docs?.length > 0) {
      setError("QR Code já registrado hoje, por favor tente novamente");
      setLoading(false);
      return;
    }
    
    try {
      await addDoc(collection(db, "confirmados"), {
        qr_id: value,
        date: date,    
      });
      setSuccess(true)
    } catch (e) {
      setError("Ocorreu um erro ao validar o QR Code, por favor tente novamente!")
    }
    setLoading(false)
  }

  useEffect(() => {
    if (confirmRef.current) return;
    confirmRef.current = true;
    if (value) {
      confirmQRCode(value)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" style={{ marginBottom: '30px' }}>
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
                ) : error ? (
                  <Alert severity="error">
                    <AlertTitle>Erro</AlertTitle>
                    {error}
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