import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { IMaskInput } from 'react-imask';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import { format } from 'date-fns'

import Logo from '../logo.png'

const theme = createTheme();

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

export default function Confirm() {
  const confirmRef = useRef(false);
  const navigate = useNavigate();
  const { value } = useParams()
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [fileID, setFileID] = useState("");
  const [missingBirth, setMissingBirth] = useState(false);
  const [birth, setBirth] = useState("");
  const [missingShare, setMissingShare] = useState(false);
  const [share, setShare] = useState(false);

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

    await completeMissingData(value)
    setLoading(false)
  }

  async function completeMissingData(value) {
    const q = query(
      collection(db, "cadastros"),
      where("qr_id", "==", value)
    );
    
    const files = await getDocs(q);
    if (files?.docs?.length === 0) {
      return;
    }
    setFileID(files.docs[0].id)

    if (!files.docs[0].get('birth')) {
      setMissingBirth(true)
    }
    if (!files.docs[0].get('share')) {
      setMissingShare(true)
    }
    return
  }

  useEffect(() => {
    if (confirmRef.current) return;
    confirmRef.current = true;
    if (value) {
      confirmQRCode(value)
      completeMissingData(value)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    updateInfo(data)
  };

  const updateInfo = async (data) => {
    setLoading(true)
    console.log(fileID)
    const docRef = doc(db, "cadastros", fileID);
    let updatedData = {}
    if (birth !== "") {
      updatedData.birth = birth
    }
    if (share) {
      updatedData.share = true
    }
    
    await updateDoc(docRef, updatedData)
    setMissingBirth(false)
    setMissingShare(false)
    setLoading(false)
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
                {missingBirth || missingShare ? (
                  <Box
                  sx={{
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  component="form" onSubmit={handleSubmit}
                >
                  {missingBirth ? (
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
                  ) : null}
                  {missingShare ? (
                    <>
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
                    </>
                  ) : null}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Atualizar cadastro
                  </Button>
                </Box>
                ) : null}
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