import * as React from 'react';
import Button from '@mui/material/Button';
import { PDFDocument, StandardFonts, cmyk } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { collection, query, getDocs } from "firebase/firestore";
import { db } from '../firebase';

import Cert from './data/cert.pdf'
var JSZip = require("jszip");
let zip = new JSZip();

export default function Certificate({ setLoading, setError }) {
  async function createPdf(name) {
    const existingPdfBytes = await fetch(Cert).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    const { width, height } = firstPage.getSize()
    const fontSize = 30
    firstPage.drawText(name, {
      x: (width/2) - (name.length/2) * (fontSize/2 - 1),
      y: (height/2) + fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: cmyk(0.00, 0.14, 0.35, 0.74),
    })

    const pdfBytes = await pdfDoc.save()
    return new Blob([pdfBytes], { type: "application/pdf" });
  }

  const prepareCertificates = async () => {
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
    const data = {}
    files.docs.forEach((cad) => {
      data[cad.get('qr_id')] = {name: cad.get('name'), cpf: cad.get('cpf')}
    })

    const qc = query(
      collection(db, "confirmados"),
    );
    
    let events = {}
    const filesConf = await getDocs(qc);
    if (filesConf?.docs?.length > 0) {
      filesConf.docs.forEach((conf) => {
        const date = conf.get('date').split("/").join("_")
        if (events[date]) {
          events[date].push(data[conf.get('qr_id')])
        } else {
          events[date] = [data[conf.get('qr_id')]]
        }
      })
    }
    
    Object.keys(events).forEach(async (ev) => {
      let folderZip = zip.folder(ev)
      events[ev].forEach(async (user) => {
        let blob = await createPdf(user.name, ev)
        folderZip.file(user.name+'.pdf', blob)
      })
    })

    setTimeout(() => {
      zip.generateAsync({type:"blob"})
      .then(function(content) {
        saveAs(content, 'certificates.zip')
      });
      setLoading(false)
    }, 5000);
  }

  return (
    <Button
      fullWidth
      variant="outlined"
      sx={{ mt: 3, mb: 2 }}
      onClick={() => prepareCertificates()}
    >
      Gerar certificados
    </Button>
  );
}