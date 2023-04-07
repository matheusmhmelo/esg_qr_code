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

import Logo from '../logo.png'

const theme = createTheme();

const columns = [
  { id: 'name', label: 'Nome', minWidth: 170 },
  { id: 'email', label: 'E-mail', minWidth: 170 },
  { id: 'inst_origem', label: 'Instituição de Origem', minWidth: 100 },
  { id: 'cpf', label: 'CPF', minWidth: 100 },
  { id: 'phone', label: 'Telefone', minWidth: 100 },
  { id: 'qr_id', label: 'QR Code', minWidth: 170 },
];

function createData(name, email, inst_origem, cpf, phone, qr_id) {
  return { name, email, inst_origem, cpf, phone, qr_id };
}

export default function Cadastros() {
  const cadastrosRef = useRef(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("name");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
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
      if (search !== "" && filter !== "" && !cad.get(filter).includes(search)) {
        return;
      }
      storedData.push(createData(
        cad.get("name"),
        cad.get("email"),
        cad.get("inst_origem"),
        cad.get("cpf"),
        cad.get("phone"),
        cad.get("qr_id"),
      ))
    })
    setRows(storedData)
  }, [data, search, filter])

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
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}