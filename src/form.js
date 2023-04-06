import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';

import Logo from './logo.png'

const theme = createTheme();

export default function SignIn() {
  const printRef = React.useRef();
  const [qrCode, setQrCode] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data)
    setQrCode(
      <QRCodeCanvas
        id="qrCode"
        value={data.get('email')}
        size={300}
        level={"H"}
      />
    )
  };

  const downloadPng = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = data;
      link.download = 'esg_qr_code.jpg';

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
              <img src={Logo} alt="logo" style={{ height: '35%', width: '35%'}}/>
              <Typography component="h1" variant="h5">
                Por dentro da ESG
              </Typography>
            {qrCode ? (
              <Box component="form" onSubmit={handleSubmit}>
                <div>
                  <Typography component="p" style={{ marginBottom: '10px', marginTop: '10px', textAlign: 'center' }}>
                    Muito obrigado por se cadastrar! 
                    Por favor utilize o QR Code abaixo para acessar o evento.
                  </Typography>
                  <Typography component="p" style={{ textAlign: 'center' }}>
                    Data: 14, 15 e 16 de Junho
                  </Typography>
                  <Typography component="p" style={{ marginBottom: '20px', marginTop: '10px', textAlign: 'center' }}>
                    Local: Anfiteatro Guilhermão
                  </Typography>
                  <div style={{marginLeft: '60px'}}>
                    {qrCode}
                  </div>
                </div>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <Typography component="p" style={{ marginBottom: '20px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel dui dui. 
            Nulla ornare nec lacus eget tempus. Pellentesque nec quam venenatis, bibendum arcu eget, 
            tincidunt turpis. Etiam vitae ultricies risus.
            </Typography>
            
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="name"
                  label="Nome Completo"
                  id="name"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Endereço de e-mail"
                  name="email"
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="inst_origem"
                  label="Instituição de Origem"
                  name="inst_origem"
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="cpf"
                  label="CPF"
                  name="cpf"
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="phone"
                  label="Telefone"
                  name="phone"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Cadastrar
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href="#" variant="body2">
                      Mais informações
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </div>
        {qrCode ? (
          <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={downloadPng}
        >
          Salvar QR Code
        </Button>
        ) : null }
      </Container>
    </ThemeProvider>
  );
}