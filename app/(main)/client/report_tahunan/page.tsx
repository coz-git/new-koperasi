"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import  { useRouter } from "next/navigation";
import pdfMake from "pdfmake/build/pdfmake";
import { StyleDictionary } from "pdfmake/interfaces";
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { Link } from 'react-router-dom'; 
const fontURL = '/Roboto-Medium.ttf';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.vfs[fontURL] = fetch('/Roboto-Medium.ttf').then(response => response.arrayBuffer());
// Tambahkan definisi font
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Medium.ttf', // Sesuaikan dengan path yang benar
    bold: 'Roboto-Medium.ttf',   // Juga sesuaikan dengan path yang benar
  },
};

// import { Link } from 'react-router-dom'; 

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
  total_pinjaman:string;
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
    }, []);

    // Jika token ada, render komponen halaman terproteksi
    return <WrappedComponent {...props} />;
  };
};

// const [allExpanded, setAllExpanded] = useState(false);
const PageComponent = () => {
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]
  const [nilai, setNilai] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('email');
    try {
      const response = await axios.get(`/api/user/report?nama_tabel=users&email=${token}`);
      // console.log(response.data);
      // const combinedData = [...response.data.rows, ...response.data.rows2];
      setData(response.data);
      // console.log(combinedData);
      // setNilai(response.data.rows2);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleInactiveClick = async (id: number,status:string) => {
    try {
      // console.log(status);
      if(status=="inactive"){
        status="active"
      }else{ 
        status="inactive"
      }
      const response = await axios.get(`/api/view_data?nama_tabel='users'`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };
  const fetchAndGeneratePDF = async () => {
    try {
      // Fetch data from the API
      await fetchData();

      // Define the PDF document content using the fetched data
      const documentDefinition = {
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
                  ['Nama','Alamat','email','username','role','jumlah simpanan', 'Status'], // Table header
                ...data.map(item => [item.name,item.alamat,item.email,item.username,item.role,item.total_simpanan, item.status]), // Table data
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
      pdfDoc.download('laporan.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="p-grid p-dir-col">
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Report Tahunan</h5>
      <Button
        // icon={allExpanded ? "pi pi-minus" : "pi pi-plus"}
        label={"Cetak Data"}
        className="w-11rem mb-3"
        onClick={fetchAndGeneratePDF}
      />
       <table className="min-w-full border-collapse table-auto col">
          <thead>
            <tr className="bg-gray-100">
              <th className="border py-2 px-4">Nama</th>
              <th className="border py-2 px-4">NIP</th>
              <th className="border py-2 px-4">NIK</th>
              <th className="border py-2 px-4">Alamat</th>
              <th className="border py-2 px-4">Email</th>
              <th className="border py-2 px-4">Jumlah Tabungan</th>
              <th className="border py-2 px-4">Jumlah Pinjaman</th>
              <th className="border py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border py-2 px-4">{item.name}</td>
                <td className="border py-2 px-4">{item.nip}</td>
                <td className="border py-2 px-4">{item.nik}</td>
                <td className="border py-2 px-4">{item.alamat}</td>
                <td className="border py-2 px-4">{item.email}</td>
                <td className="border py-2 px-4 ">{item.total_simpanan}</td>
                <td className="border py-2 px-4">{item.total_pinjaman}</td>
                <td className="border py-2 px-4">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

export default withAuth(PageComponent);
