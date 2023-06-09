import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
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

const BirthMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="00/00/0000"
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

BirthMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function SignIn() {
  const printRef = React.useRef();
  const navigate = useNavigate();

  const [qrCode, setQrCode] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [instOrigem, setInstOrigem] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [birth, setBirth] = useState('');
  const [share, setShare] = useState(false);
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
        share: share,  
        birth: data.get("birth") 
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
                <Typography component="p" style={{ marginBottom: '20px', textAlign: 'justify' }}>
                  O “Por dentro da ESG” é um evento voltado às empresas, microempresas e alunos de graduação que tem como intuito o aprofundamento e conscientização do universo ESG. São 3 dias de palestras, workshop e muito mais que trarão todo o suporte para imersão no tema. 
                  <br />
                  Serão disponibilizados certificados às pessoas que fizerem o cadastro. Apresente o QR code gerado, no dia do evento. 
                  <br />
                  O Evento é totalmente gratuito promovido pelos alunos da disciplina de “Gestão Ambiental e Normatização” do Bacharel em Química da Unesp Bauru.
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
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Endereço de e-mail"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                  label="Instituição/Empresa de Origem"
                  name="inst_origem"
                  value={instOrigem}
                  onChange={(event) => setInstOrigem(event.target.value)}
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
                <TextField
                  margin="normal"
                  fullWidth
                  id="birth"
                  label="Data de Nascimento"
                  helperText="DD/MM/YYYY"
                  name="birth"
                  required
                  InputProps={{
                    inputComponent: BirthMaskCustom,
                  }}
                  value={birth}
                  onChange={(event) => setBirth(event.target.value)}
                />
                <FormGroup sx={{ mt: 3 }}>
                  <FormControlLabel control={
                    <Checkbox checked={share} onChange={(event) => setShare(event.target.checked)} />
                  }
                  label={
                    <Typography component="p" style={{ textAlign: 'justify' }}>
                      Eu autorizo a comissão organizadora a 
                      compartilhar meus dados de inscrição com o Sebrae unicamente 
                      para emissão de certificado.
                    </Typography>
                  } />
                </FormGroup>
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