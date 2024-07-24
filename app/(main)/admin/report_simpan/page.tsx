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
  nama: string;
  jenis_simpan: string;
  deskripsi: string;
  besar_simpanan: string;
  email: string;
  created_by: string;
  created_at: string;
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


// const [allExpanded, setAllExpanded] = useState(false);
const PageComponent = () => {
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]
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
      const response = await axios.get('/api/view_data?nama_tabel=transaksi_simpanans');
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
            text: 'Laporan Simpanan',
            style: 'header',
            margin: [0, 10]
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*','*','*', '*','*','*'],
              body: [
                  ['Nama','Jenis Simpan','Deskripsi','Besar Simpanan','Email','Created by', 'Created At'], // Table header
                ...data.map(item => [item.nama,item.jenis_simpan,item.deskripsi,item.besar_simpanan,item.email,item.created_by, moment(item.created_at).format('DD/MM/YYYY')]), // Table data
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
      pdfDoc.download('laporan simpanan.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  const dateBodyTemplate = (rowData: any) => {
    return moment(rowData.created_at).format('DD/MM/YYYY')
  };

  return (
    <div className="p-grid p-dir-col">
    
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Report Simpan</h5>
        <Button
        // icon={allExpanded ? "pi pi-minus" : "pi pi-plus"}
        label={"Cetak Data"}
        className="w-11rem mb-3"
        onClick={fetchAndGeneratePDF}
      />
        <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}">
          <Column field="nama" header="Nama" style={{ width: '25%' }}></Column>
          <Column field="jenis_simpan" header="Jenis Simpanan" style={{ width: '25%' }}></Column>
          <Column field="deskripsi" header="Deskripsi" style={{ width: '25%' }}></Column>
          <Column field="besar_simpanan" header="Besar Simpanan" style={{ width: '25%' }}></Column>
          <Column field="email" header="Email" style={{ width: '25%' }}></Column>
          <Column field="created_by" header="Created By" style={{ width: '25%' }}></Column>
          <Column body={dateBodyTemplate} header="Created At" style={{ width: '25%' }}></Column>
        </DataTable>
      </div>
    </div>
  </div>
   
  );
};

export default withAuth(PageComponent);
