"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import  { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import moment from 'moment'

interface UserData {
  id: string;
  nama: string;
  jenis_pinjaman: string;
  tanggal_pengajuan: string;
  tanggal_pencairan: string;
  email: string;
  created_by:string;
  approved_by: string;
  created_at: string;
  status: string;
  jumlah_pinjaman: string;
  bunga: string;
  nama_bank: string;
  no_rekening: string;
}
const withAuth = (WrappedComponent: React.ComponentType) => {
  
  // const router = useRouter();
  return (props: any) => {
    // Memeriksa apakah ada token dalam local storage
    const router = useRouter();
    

    useEffect(() => {
      const token = localStorage.getItem('token');
      const token2 = localStorage.getItem('role');
      // console.log("token"+token);
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
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [tanggal_pencairan, setTanggal] = useState("");
  const [jenis_pinjaman, setJenis] = useState("");
  const [jumlah_pinjaman, setJumlah] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [id, setId] = useState("");

  const handleEditClick = (dataToEdit: { email:React.SetStateAction<string>, jumlah_pinjaman: React.SetStateAction<string>; id: React.SetStateAction<string>; tanggal_pencairan: React.SetStateAction<string>; jenis_pinjaman:React.SetStateAction<string>; }) => {
    setTanggal(dataToEdit.tanggal_pencairan);
    setId(dataToEdit.id);
    setJenis(dataToEdit.jenis_pinjaman);
    setIsEditing(true);
    setJumlah(dataToEdit.jumlah_pinjaman);
    setEmail(dataToEdit.email);
  };
  useEffect(() => {
    // Fungsi untuk mengupdate tanggal dan waktu setiap detik
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Membersihkan interval ketika komponen unmount
    return () => clearInterval(intervalId);
  }, []);
  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  const formattedDateTime = formatDateTime(currentDateTime);
  const handleSave = async () => {
    const token2 = localStorage.getItem('role');
    // console.log(token2);
    // console.log(formattedDateTime);
    const formData = {
      id,
      email,
      jumlah_pinjaman,
      jenis_pinjaman,
      tanggal_pencairan,
      created_at: formattedDateTime, 
      approved_by:token2,
      status:"Acc", 
    };

    try {
      const response = await fetch('/api/transaksi_pinjam/page_edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registrasi berhasil, lakukan tindakan yang sesuai
        // console.log('Registration successful');
        // console.log(response.body);
        setIsEditing(false);
        fetchData(); // Pindahkan ke halaman login
      } else {
        // Registrasi gagal, lakukan tindakan yang sesuai
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };
  const handleTolak = async (id: string,status:string) => {
    const token2 = localStorage.getItem('role');
    try {
      // console.log(status);
      if(status=="Pending"){
        status="Tolak"
      }
      const response = await fetch('/api/transaksi_pinjam/page_tolak', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          "email":email,
          "status":"Tolak",
          "tanggal_pencairan":null,
          "created_at":formatDateTime,
          "approved_by":token2
        }),
      });
      // localStorage.setItem('status', status);

      fetchData();
    } catch (error) {
      console.error('Error registering:', error);
    }
  };
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/view_data?nama_tabel=transaksi_pinjamans');
      setData(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const actionBodyTemplate = (rowData: UserData) => {
    return (
      <React.Fragment>
        {rowData.status === 'pending' && (
          <div>
            <button
              onClick={() => handleEditClick(rowData)}
              className={`bg-green-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300`}
            >
              Acc
            </button>
            |
            <button
              onClick={() => handleTolak(rowData.id, rowData.status)}
              className={`bg-red-500 text-white py-1 px-2 rounded hover:bg-red-800 transition duration-300`}
            >
              Tolak
            </button>
          </div>
        )}
      </React.Fragment>
    );
  };
  
  const dateBodyTemplate = (rowData: any) => {
    return moment(rowData.created_at).format('DD/MM/YYYY')
  };

  const approvalDateTemplate = (rowData: any) => {
    return moment(rowData.created_at).format('DD/MM/YYYY')
  };

  const disburseDateTemplate = (rowData: any) => {
    return moment(rowData.tanggal_pencairan).format('DD/MM/YYYY')
  };


  return (
    <div className="p-grid p-dir-col">
    
        {isEditing ? (
    // Tampilkan formulir edit jika sedang dalam mode pengeditan
    <div className="grid p-fluid">
      <div className="col-12 md:col-4">
        <div className="card">
          <h5>Tambahkan Data</h5>

          <div>
         
              <InputText
                id="name"
                type="hidden"
                placeholder="Full name"
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
               <InputText
                id="name"
                type="hidden"
                placeholder="Full name"
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
                value={jenis_pinjaman}
                onChange={(e) => setJenis(e.target.value)}
              />
            <label
                htmlFor="email1"
                className="block text-900 text-xl font-medium mb-2"
              >
                Tanggal Pencairan
              </label>
              <InputText
                id="name"
                type="date"
                placeholder="Tanggal Pencairan"
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
                value={tanggal_pencairan}
                onChange={(e) => setTanggal(e.target.value)}
              />
  
              <Button
                label="Acc"
                className="w-full p-3 text-xl"
                onClick={handleSave}
              ></Button>
            </div>
        </div>

        
      </div>
    </div>
  ) : (
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Transaksi Pinjaman</h5>
          <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}">
            <Column field="nama" header="Nama" style={{ width: '25%' }}></Column>
            <Column field="jenis_pinjaman" header="Jenis Pinjaman" style={{ width: '25%' }}></Column>
            <Column body={approvalDateTemplate} header="Tanggal Pengajuan" style={{ width: '25%' }}></Column>
            <Column body={disburseDateTemplate} header="Tanggal Pencairan" style={{ width: '25%' }}></Column>
            <Column field="jumlah_pinjaman" header="Jumlah Pinjaman" style={{ width: '25%' }}></Column>
            <Column field="bunga" header="Bunga" style={{ width: '25%' }}></Column>
            <Column field="nama_bank" header="Nama Bank" style={{ width: '25%' }}></Column>
            <Column field="no_rekening" header="No Rekening" style={{ width: '25%' }}></Column>
            <Column field="email" header="Email" style={{ width: '25%' }}></Column>
            <Column field="created_by" header="Created By" style={{ width: '25%' }}></Column>
            <Column field="approved_by" header="Aproved By" style={{ width: '25%' }}></Column>
            <Column body={dateBodyTemplate} header="Created At" style={{ width: '25%' }}></Column>
            <Column field="status" header="Status" style={{ width: '25%' }}></Column>
            <Column body={actionBodyTemplate} exportable={false} ></Column>
          </DataTable>
      </div>
    </div>
  )}
  </div>
   
  );
};

export default withAuth(PageComponent);
