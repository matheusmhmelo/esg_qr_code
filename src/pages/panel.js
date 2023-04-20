import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import Certificate from "./certificate"
import Logo from '../logo.png'

const theme = createTheme();

export default function Panel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

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
              <Typography component="p" style={{ marginBottom: '20px', marginTop: '20px' }}>
                Área de administração
              </Typography>
              { loading ? <CircularProgress /> : (
                <Box sx={{ mt: 1 }}>
                  {error ? (
                    <Alert severity="error">
                      <AlertTitle>Erro</AlertTitle>
                      {error}
                    </Alert>
                  ) : null}
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={() => navigate("/scan")}
                  >
                    Scanear QR Code
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mb: 2 }}
                    onClick={() => navigate("/cadastros")}
                  >
                    Cadastros
                  </Button>
                  <Certificate setLoading={setLoading} setError={setError} />
                </Box>
              )}
          </Box>
      </Container>
    </ThemeProvider>
  );
}