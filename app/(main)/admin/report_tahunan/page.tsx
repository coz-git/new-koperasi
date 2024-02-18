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
  presentase_koperasi: string;
  presentase_anggota: string;
  vee_admin: string;
  periode: string;
  amount_koperasi: string;
  amount_admin: string;
  amount_anggota: string;
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
  
  const [showButton, setShowButton] = useState(false);
  
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]

  useEffect(() => {
    fetchData();
    checkShowButton();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/master_bagihasil/view_data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const checkShowButton = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Mengembalikan bulan 0-11 (0 untuk Januari, 11 untuk Desember)
    const currentDay = currentDate.getDate();

    if (currentMonth === 9 && currentDay > 13) {
      setShowButton(true);
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
                  ['presentase_anggota',
                    'presentase_koperasi',
                    'vee_admin',
                    'periode',
                    'amount_admin',
                    'amount_anggota',
                    'amount_koperasi'], // Table header
                ...data.map(item => [item.presentase_anggota,item.presentase_koperasi,item.vee_admin,item.periode,item.amount_admin,item.amount_anggota, item.amount_koperasi]), // Table data
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
        {showButton && ( // Hanya menampilkan tombol jika showButton adalah true
              <Button label={"cetak data"} className="w-11rem mb-3" 
              onClick={fetchAndGeneratePDF}/>
            
          )}
       <table className="min-w-full border-collapse table-auto col">
          <thead>
            <tr className="bg-gray-100">
              <th className="border py-2 px-4">Presentase Koperasi</th>
              <th className="border py-2 px-4">Presentase Anggota</th>
              <th className="border py-2 px-4">Vee Admin</th>
              <th className="border py-2 px-4">Periode</th>
              <th className="border py-2 px-4">Amount Koperasi</th>
              <th className="border py-2 px-4">Amount Admin</th>
              <th className="border py-2 px-4">Amount Anggota</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border py-2 px-4">{item.presentase_koperasi}</td>
                <td className="border py-2 px-4">{item.presentase_anggota}</td>
                <td className="border py-2 px-4">{item.vee_admin}</td>
                <td className="border py-2 px-4">{item.periode}</td>
                <td className="border py-2 px-4">{item.amount_koperasi}</td>
                <td className="border py-2 px-4">{item.amount_admin}</td>
                <td className="border py-2 px-4">{item.amount_anggota}</td>
                
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
