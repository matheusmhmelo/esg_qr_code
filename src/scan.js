import * as React from 'react';
import { useNavigate } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {QrReader} from 'react-qr-reader';
import Logo from './logo.png'

const theme = createTheme();

export default function Scan() {
  const navigate = useNavigate();

	const saveValue = async (value) => {
    navigate("/confirm/"+value)
  }

	const previewStyle = {
		height: 240,
		width: 320,
	}

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
            <div style={{width: '100%', height: '100%'}}>
              <QrReader
                constraints={{ facingMode: 'environment' }}
                delay={1000}
                style={previewStyle}
                onResult={(res, error)=>{
                  if(!!res) {
                    saveValue(res.text)
                  }
                }}
              />
            </div>
        </Box>
      </Container>
    </ThemeProvider>
  );
}