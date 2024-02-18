"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import pdfMake from 'pdfmake/build/pdfmake';
import { StyleDictionary } from "pdfmake/interfaces";
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { Link } from 'react-router-dom'; 
const fontURL = '/Roboto-Medium.ttf';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// pdfMake.vfs[fontURL] = fetch('/Roboto-Medium.ttf').then(response => response.arrayBuffer());
// Tambahkan definisi font
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Medium.ttf', // Sesuaikan dengan path yang benar
    bold: 'Roboto-Medium.ttf',   // Juga sesuaikan dengan path yang benar
  },
};

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import moment from 'moment'

interface UserData {
  id: number;
  jenis_pinjaman: string;
  jumlah_pinjaman: string;
  bunga: string;
  nama: string;
  email: string;
  tanggal_pencairan: string;
  tanggal_pengajuan: string;
  status: string;
}
const withAuth = (WrappedComponent: React.ComponentType) => {
  // const router = useRouter();
  return (props: any) => {
    // Memeriksa apakah ada token dalam local storage
    const router = useRouter();


    useEffect(() => {
      const token = localStorage.getItem('token');
      const token2 = localStorage.getItem('role');
      console.log("token" + token);
      if (!token) {
        router.replace('/auth/login'); // Ganti dengan halaman login
      }
      if (token2 == "User") {
        router.replace('/client/history_simpan');
      }
    }, []);

    // Jika token ada, render komponen halaman terproteksi
    return <WrappedComponent {...props} />;
  };
};
function formatDate(dateString: string | number | Date) {
  const dateObject = new Date(dateString);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const PageComponent = () => {
  const [data, setData] = useState<UserData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/report/report_pinjaman');
      // console.log(response.data)
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchAndGeneratePDF = async () => {
    try {
      // Fetch data from the API
      await fetchData();

      // Define the PDF document content using the fetched data
      const documentDefinition: any = {
        pageSize: 'A3',
        content: [
          {
            text: 'Laporan Pembayaran',
            style: 'header',
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*', '*', '*', '*', '*', '*'],
              body: [
                ['ID Transaksi', 'Jenis Pinjaman', 'Total Pinjaman', 'Bunga', 'Nama Peminjam', 'Tanggal Pencairan', 'Status'], // Table header
                ...data.map(item => [item.id, item.jenis_pinjaman, item.jumlah_pinjaman, item.bunga, item.nama,  moment(item.tanggal_pencairan).format('DD/MM/YYYY'), item.status]), // Table data
              ],
            },
          },
        ],
        styles: {
          header: {
            fontSize: 12,
            font: 'Roboto',
            alignment: 'center',
            margin: [0, 0, 0, 20],
          },
        } as StyleDictionary,
        pageOrientation: 'landscape',  // Add "as StyleDictionary" here
      };



      // Create the PDF
      const pdfDoc = pdfMake.createPdf(documentDefinition);

      // Download the PDF
      pdfDoc.download('Report Pinjaman.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const dateBodyTemplate = (rowData: any) => {
    return moment(rowData.tanggal_pencairan).format('DD/MM/YYYY')
  };

  return (
    <div className="p-grid p-dir-col">

      <div className="p-col-12">
        <div className="card p-4">
          <h5 className="text-xl font-semibold mb-4">Report Pinjaman</h5>
          <Button
            label={"Cetak Data"}
            className="w-11rem mb-3"
            onClick={fetchAndGeneratePDF}
          />
          <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}">
            <Column field="id" header="ID Transaksi" style={{ width: '25%' }}></Column>
            <Column field="jenis_pinjaman" header="Jenis Pinjaman" style={{ width: '25%' }}></Column>
            <Column field="jumlah_pinjaman" header="Total Pinjaman" style={{ width: '25%' }}></Column>
            <Column field="bunga" header="Bunga" style={{ width: '25%' }}></Column>
            <Column field="nama" header="Nama Peminjam" style={{ width: '25%' }}></Column>
            <Column body={dateBodyTemplate} header="Tanggal Pencairan" style={{ width: '25%' }}></Column>
            <Column field="status" header="Status" style={{ width: '25%' }}></Column>
          </DataTable>
        </div>
      </div>
    </div>

  );
};

export default withAuth(PageComponent);
