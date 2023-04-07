import * as React from 'react';
import { useState, useEffect, useRef } from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { collection, query, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import { CSVLink } from "react-csv";

import Logo from '../logo.png'

const theme = createTheme();

const columns = [
  { id: 'name', label: 'Nome', minWidth: 170 },
  { id: 'email', label: 'E-mail', minWidth: 170 },
  { id: 'inst_origem', label: 'Instituição de Origem', minWidth: 170 },
  { id: 'cpf', label: 'CPF', minWidth: 170 },
  { id: 'phone', label: 'Telefone', minWidth: 170 },
  { id: 'qr_id', label: 'QR Code', minWidth: 170 },
  { id: 'access', label: 'Acessos', minWidth: 170 },
];

const csvHeaders = [
  { key: 'name', label: 'Nome' },
  { key: 'email', label: 'E-mail' },
  { key: 'inst_origem', label: 'Instituição de Origem' },
  { key: 'cpf', label: 'CPF' },
  { key: 'phone', label: 'Telefone' },
  { key: 'qr_id', label: 'QR Code' },
  { key: 'access', label: 'Acessos' },
];

function createData(name, email, inst_origem, cpf, phone, qr_id, access) {
  return { name, email, inst_origem, cpf, phone, qr_id, access };
}

export default function Cadastros() {
  const cadastrosRef = useRef(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("name");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [dataConfirmed, setDataConfirmed] = useState({});
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getData = async () => {
    setLoading(true)

    const q = query(
      collection(db, "cadastros"),
    );
    
    const files = await getDocs(q);
    if (files?.docs?.length === 0) {
      setError("Nenhum cadastro encontrado");
      setLoading(false);
      return;
    }
    setData(files.docs)

    const qc = query(
      collection(db, "confirmados"),
    );
    
    let confirmed = {}
    const filesConf = await getDocs(qc);
    if (filesConf?.docs?.length > 0) {
      filesConf.docs.forEach((conf) => {
        if (confirmed[conf.get('qr_id')]) {
          confirmed[conf.get('qr_id')].push(conf.get('date'))
        } else {
          confirmed[conf.get('qr_id')] = [conf.get('date')]
        }
      })

      setDataConfirmed(confirmed);
    }

    setLoading(false)
  }

  useEffect(() => {
    if (cadastrosRef.current) return;
    cadastrosRef.current = true;
    getData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let storedData = []
    data.forEach((cad) => {
      if (
        search !== "" && 
        filter !== "" && 
        filter !== "confirmed" && 
        !cad.get(filter).includes(search)
      ) {
        return;
      }

      const confirmed = 
        dataConfirmed[cad.get("qr_id")]
        ? dataConfirmed[cad.get("qr_id")].join(", ")
        : "";

      if (
        search !== "" && 
        filter === "confirmed" && 
        !confirmed.includes(search)
      ) {
        return;
      } 

      storedData.push(createData(
        cad.get("name"),
        cad.get("email"),
        cad.get("inst_origem"),
        cad.get("cpf"),
        cad.get("phone"),
        cad.get("qr_id"),
        confirmed
      ))
    })
    setRows(storedData)
  }, [data, dataConfirmed, search, filter])

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <FormControl fullWidth>
              <TextField
                margin="normal"
                fullWidth
                name="filter"
                label="Buscar cadastro"
                id="filter"
                onChange={(e) => setSearch(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Filtrar</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter}
                label="Filtrar"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value={'name'} selected>Nome</MenuItem>
                <MenuItem value={'email'}>E-mail</MenuItem>
                <MenuItem value={'inst_origem'}>Instituição de Origem</MenuItem>
                <MenuItem value={'cpf'}>CPF</MenuItem>
                <MenuItem value={'phone'}>Telefone</MenuItem>
                <MenuItem value={'confirmed'}>Data de Acesso</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Container>
      <Container component="main" maxWidth="s" style={{ marginBottom: '30px' }}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {loading ? (
            <CircularProgress sx={{ mt: 10 }} />
          ) : (
            <>
              {error ? (
                <Alert severity="error">
                  <AlertTitle>Erro</AlertTitle>
                  {error}
                </Alert>
              ) : null}
              <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: "20px" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    {column.format && typeof value === 'number'
                                      ? column.format(value)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
              <Grid container sx={{ mt: 3 }}>
                <Grid item>
                  <CSVLink 
                    data={rows} 
                    headers={csvHeaders}
                    filename={
                      search !== "" ? 
                      "cadastros-"+search+".csv" : 
                      "cadastros.csv"
                    }
                  >
                    Exportar dados (.csv)
                  </CSVLink>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}