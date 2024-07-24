"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import  { useRouter } from "next/navigation";
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

const image = '/signature/signature.png'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import moment from 'moment'
import 'moment/locale/id';
moment.locale('id');

interface UserData {
  id: number;
  name: string;
  nip: string;
  id_transaksi: string;
  angsuran_ke: string;
  jumlah_angsuran_bulan: string;
  sisa_angsuran: string;
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
      console.log("token"+token);
      if (!token) {
        router.replace('/auth/login'); // Ganti dengan halaman login
      }
      if(token2=="User"){
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
  const [base64Image, setBase64Image] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fileToBase64 = (file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    };

    // Load the image file from local directory
    fetch(image)
      .then(response => response.blob())
      .then(file => fileToBase64(file))
      .catch(error => console.error('Error fetching image:', error));
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/report/report_payment');
      console.log(response.data)
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
      const documentDefinition : any = {
        pageSize: 'A3', 
        content: [
          {
            text: 'Laporan Pembayaran',
            style: 'header',
            margin: [0, 10]
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*','*','*', '*','*','*'],
              body: [
                ['Name', 'NIP', 'ID Transaksi' , 'Angsuran Pembayaran', 'Total Angsuran', 'Sisa Angsuran','Status'], // Table header
                ...data.map(item => [item.name, item.nip, item.id_transaksi, item.angsuran_ke,item.sisa_angsuran,item.jumlah_angsuran_bulan,item.status]), // Table data
              ],
            },
          },
          { text: 'Depok, ' + moment().format('dddd D MMMM YYYY'), margin: [0, 20, 0, 10], alignment: 'right' },
          {
            image: base64Image,
            fit: [150, 200],
            alignment: 'right'
          },
          { text: 'Admin MPA', margin: [0, 10, 0, 0], alignment: 'right' },
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
      pdfDoc.download('Report Payment.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  

  return (
    <div className="p-grid p-dir-col">
    
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Report Payment</h5>
        <Button
        label={"Cetak Data"}
        className="w-11rem mb-3"
        onClick={fetchAndGeneratePDF}
      />
        <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}">
          <Column field="name" header="Nama" style={{ width: '25%' }}></Column>
          <Column field="nip" header="NIP" style={{ width: '25%' }}></Column>
          <Column field="id_transaksi" header="ID Transaksi" style={{ width: '25%' }}></Column>
          <Column field="angsuran_ke" header="Angsuran Pembayaran" style={{ width: '25%' }}></Column>
          <Column field="jumlah_angsuran_bulan" header="Total Angsuran" style={{ width: '25%' }}></Column>
          <Column field="sisa_angsuran" header="Sisa Angsuran" style={{ width: '25%' }}></Column>
          <Column field="status" header="Status" style={{ width: '25%' }}></Column>
        </DataTable>
      </div>
    </div>
  </div>
   
  );
};

export default withAuth(PageComponent);
