import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./auth/useLocalStorage";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import Logo from './logo.png'

const theme = createTheme();

export default function Admin() {
  // eslint-disable-next-line no-unused-vars
  const [admin, setAdmin] = useLocalStorage(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if(data.get('password') === process.env.REACT_APP_ADMIN_PASSWORD) {
      setAdmin(process.env.REACT_APP_ADMIN_TOKEN);
      navigate(0);
    } else {
      setError(true)
    }
  };

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
                Acesso à area de administração
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                {error ? (
                  <Alert severity="error">
                    <AlertTitle>Erro</AlertTitle>
                    Senha incorreta, por favor tente novamente!
                  </Alert>
                ) : null}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Senha de acesso"
                  name="password"
                  type="password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Acessar
                </Button>
              </Box>
          </Box>
      </Container>
    </ThemeProvider>
  );
}