"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import  { useRouter } from "next/navigation";
import pdfMake from 'pdfmake/build/pdfmake';
import { StyleDictionary } from "pdfmake/interfaces";
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

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

interface UserData {
  id: number;
  name: string;
  nip: string;
  nik: string;
  alamat: string;
  email: string;
  username: string;
  role: string;
  status: string;
  total_simpanan:string;
  total_pinjaman: string;
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

// const [allExpanded, setAllExpanded] = useState(false);
const PageComponent = () => {
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/report_user/page_view');
      console.log(response.data.rows);
      setData(response.data.rows);
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
            text: 'Laporan User',
            style: 'header',
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*','*','*', '*','*','*'],
              body: [
                  ['Nama','Alamat','email','username','total simpanan','total pinjaman', 'Status'], // Table header
                ...data.map(item => [item.name,item.alamat,item.email,item.username,item.total_simpanan,item.total_pinjaman,item.status]), // Table data
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
      pdfDoc.download('Report User.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  return (
    <div className="p-grid p-dir-col">
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Report User</h5>
      <Button
        label={"Cetak Data"}
        className="w-11rem mb-3"
        onClick={fetchAndGeneratePDF}
      />
        <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}">
          <Column field="name" header="Name" style={{ width: '25%' }}></Column>
          <Column field="alamat" header="Alamat" style={{ width: '25%' }}></Column>
          <Column field="email" header="Email" style={{ width: '25%' }}></Column>
          <Column field="username" header="Username" style={{ width: '25%' }}></Column>
          <Column field="total_simpanan" header="Total Simpanan" style={{ width: '25%' }}></Column>
          <Column field="total_pinjaman" header="Total Pinjaman" style={{ width: '25%' }}></Column>
          <Column field="status" header="Status" style={{ width: '25%' }}></Column>
        </DataTable>
      </div>
    </div>
  </div>
  );
};

export default withAuth(PageComponent) ;
