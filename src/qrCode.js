import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QRCodeCanvas } from 'qrcode.react';

const theme = createTheme();

export default function QRCode({ value }) {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" style={{ marginBottom: '30px' }}>
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
          <div style={{marginLeft: '30px'}}>
            <QRCodeCanvas
              id="qrCode"
              value={value}
              size={300}
              level={"H"}
            />
          </div>
          <Typography component="p" style={{ textAlign: 'center' }}>
            {value}
          </Typography>
        </div>
      </Container>
    </ThemeProvider>
  );
}