"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import  { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

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
  
  const [showButton, setShowButton] = useState(true);
  
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
  const checkShowButton = async () =>  {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Mengembalikan bulan 0-11 (0 untuk Januari, 11 untuk Desember)
    const currentDay = currentDate.getDate();
    console.log(currentMonth);
    const currentYear = new Date().getFullYear();
    if (currentMonth === 9 && currentDay > 1) {
      try {
        const response = await fetch('/api/master_bagihasil/ambiltahun');
        const data = await response.json();
        if (Array.isArray(data) && data.length === 0) {
          setShowButton(true);
        } else {
          if (data[0].periode) {
            if (data[0].periode !== currentYear) {
              setShowButton(true);
            } else {
              setShowButton(false);
            }
          } else {
            setShowButton(true);
          }
        }
        
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    }
    
  };

  
  return (
    <div className="p-grid p-dir-col">
    
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Generate Bagi Hasil</h5>
        {showButton && ( // Hanya menampilkan tombol jika showButton adalah true
            <a href={'/admin/generate_bagi_hasil/tambah'} rel="noopener noreferrer" className="w-11rem mr-2">
              <Button label={"Tambah Data"} className="w-11rem mb-3" />
            </a>
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
