import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import html2canvas from 'html2canvas';
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import QRCode from './qrCode'
import Logo from '../logo.png'

const theme = createTheme();

export default function Recover() {
  const printRef = React.useRef();
  const navigate = useNavigate();

  const [qrCode, setQrCode] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    getInfo(data)
  };

  const getInfo = async (data) => {
    setLoading(true)

    const q = query(
      collection(db, "cadastros"),
      where("email", "==", data.get("email"))
    );
    
    const files = await getDocs(q);
    if (files?.docs?.length === 0) {
      setError("E-mail não cadastrado, por favor realize o cadastro para gerar um novo QR Code!");
      setLoading(false);
      return;
    }
    
    setQrCode(files.docs[0].get('qr_id'))
    setLoading(false)
  }

  const downloadPng = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = data;
      link.download = 'esg_qr_code';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" style={{ marginBottom: '30px' }}>
        <CssBaseline />
        <div ref={printRef}>
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
            {loading ? (
              <CircularProgress sx={{ mt: 10 }} />
            ) : qrCode ? (
              <QRCode value={qrCode} />
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <Typography component="p" style={{ marginBottom: '20px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel dui dui. 
            Nulla ornare nec lacus eget tempus. Pellentesque nec quam venenatis, bibendum arcu eget, 
            tincidunt turpis. Etiam vitae ultricies risus.
            </Typography>

                {error ? (
                  <Alert severity="error">
                    <AlertTitle>Erro</AlertTitle>
                    {error}
                  </Alert>
                ) : null}
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Endereço de e-mail"
                  name="email"
                  type="email"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Buscar QR Code
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                  href="/"
                >
                  Cadastrar
                </Button>
              </Box>
            )}
          </Box>
        </div>
        {qrCode ? (
          <>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={downloadPng}
            >
              Salvar QR Code
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              onClick={() => navigate("/")}
            >
              Novo cadastro
            </Button>
          </>
        ) : null }
      </Container>
    </ThemeProvider>
  );
}