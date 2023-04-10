import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import html2canvas from 'html2canvas';
import { IMaskInput } from 'react-imask';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import QRCode from './qrCode'
import Logo from '../logo.png'

const theme = createTheme();

const PhoneMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(00) 00000-0000"
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

PhoneMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const CPFMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="000.000.000-00"
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

CPFMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function SignIn() {
  const printRef = React.useRef();
  const navigate = useNavigate();

  const [qrCode, setQrCode] = useState(null);
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const qr_id = uuidv4()

    storeInfo(data, qr_id)
  };

  const storeInfo = async (data, qr_id) => {
    setLoading(true)

    const q = query(
      collection(db, "cadastros"),
      where("email", "==", data.get("email"))
    );
    
    const files = await getDocs(q);
    if (files?.docs?.length > 0) {
      setError("E-mail já cadastrado, por favor tente novamente ou recupere seu QR Code no botão abaixo!");
      setLoading(false);
      return;
    }
    
    try {
      await addDoc(collection(db, "cadastros"), {
        qr_id: qr_id,
        name: data.get("name"),    
        email: data.get("email"),    
        inst_origem: data.get("inst_origem"),    
        cpf: data.get("cpf"),    
        phone: data.get("phone"),    
      });
      setQrCode(qr_id)
    } catch (e) {
      setError("Ocorreu um erro ao salvar seu cadastro, por favor tente novamente!")
    }
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
                  type="email"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="cpf"
                  label="CPF"
                  name="cpf"
                  InputProps={{
                    inputComponent: CPFMaskCustom,
                  }}
                  value={cpf}
                  onChange={(event) => setCpf(event.target.value)}
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
                  id="phone"
                  label="Telefone"
                  name="phone"
                  InputProps={{
                    inputComponent: PhoneMaskCustom,
                  }}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Cadastrar
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                  href="/recover"
                >
                  Recuperar QR Code
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href="https://www.instagram.com/esg.unespbauru/" variant="body2">
                      Mais informações
                    </Link>
                  </Grid>
                </Grid>
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
              onClick={() => navigate(0)}
            >
              Novo cadastro
            </Button>
        </>
        ) : null }
      </Container>
    </ThemeProvider>
  );
}