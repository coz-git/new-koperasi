"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import  { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import moment from 'moment'

interface UserData {
  id: string;
  jenis_pinjaman: string;
  deskripsi: string;
  maksimal_pinjaman: string;
  lama_angsuran: string;
  bunga: string;
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
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [jenis_pinjaman, setJenis] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [maksimal_pinjaman, setAmount] = useState("");
  const [lama_angsuran, setAngsuran] = useState("");
  const [bunga, setBunga] = useState("");
  const [id, setId] = useState("");
  const handleEditClick = (dataToEdit: { id: React.SetStateAction<string>; 
    jenis_pinjaman: React.SetStateAction<string>; 
    deskripsi: React.SetStateAction<string>; 
    maksimal_pinjaman: React.SetStateAction<string>; 
    lama_angsuran: React.SetStateAction<string>;
    bunga: React.SetStateAction<string>;}) => {
    setJenis(dataToEdit.jenis_pinjaman);
    setDeskripsi(dataToEdit.deskripsi);
    setAmount(dataToEdit.maksimal_pinjaman);
    setAngsuran(dataToEdit.lama_angsuran);
    setBunga(dataToEdit.bunga);
    setId(dataToEdit.id);
    setIsEditing(true);
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
    console.log(token2);
    console.log(formattedDateTime);
    const formData = {
      id,
      jenis_pinjaman,
      deskripsi,
      maksimal_pinjaman,
      lama_angsuran,
      bunga,
      created_at: formattedDateTime, 
      created_by:token2,
    };

    try {
      const response = await fetch('/api/master_pinjaman/page_edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registrasi berhasil, lakukan tindakan yang sesuai
        console.log('Registration successful');
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
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/view_data?nama_tabel=pinjamans');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const actionBodyTemplate = (rowData: UserData) => {
    return (
      <React.Fragment>
        <button
          onClick={() => handleEditClick(rowData)}
          className={'bg-green-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300'}
        >
          Edit
        </button>|
        <button
          onClick={() => handleDelete(rowData.id)}
          className={'bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300'}
        >
          Delete
        </button>
      </React.Fragment>
    );
  };
  
  const handleDelete = async (id: string) => {
    try {
      
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          "nama_tabel":"pinjamans"
        }),
      });

      fetchData();
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const dateBodyTemplate = (rowData: any) => {
    return moment(rowData.created_at).format('DD/MM/YYYY')
  };

  return (
    <div className="p-grid p-dir-col">
    
    {isEditing ? (
    // Tampilkan formulir edit jika sedang dalam mode pengeditan
    <div className="grid p-fluid">
      <div className="col-12 md:col-12">
        <div className="card">
          <h5>Tambahkan Data</h5>

          <div>
         
              <InputText
                id="name"
                type="hidden"
                placeholder="Full name"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            <label
                htmlFor="email1"
                className="block text-900 text-sm font-medium mb-2"
              >
                Jenis Pinjaman
              </label>
              <InputText
                id="name"
                type="text"
                placeholder="Full name"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={jenis_pinjaman}
                onChange={(e) => setJenis(e.target.value)}
              />
  
              <label
                htmlFor="nik"
                className="block text-900 text-sm font-medium mb-2"
              >
                maksimal_pinjaman
              </label>
              <InputText
                id="nik"
                type="number"
                placeholder="NIK"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={maksimal_pinjaman}
                onChange={(e) => setAmount(e.target.value)}
              />

              <label
                htmlFor="nik"
                className="block text-900 text-sm font-medium mb-2"
              >
                Lama Angsuran
              </label>
              <InputText
                id="nik"
                type="number"
                placeholder="NIK"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={lama_angsuran}
                onChange={(e) => setAngsuran(e.target.value)}
              />
  
              <label
                htmlFor="nik"
                className="block text-900 text-sm font-medium mb-2"
              >
                Bunga
              </label>
              <InputText
                id="nik"
                type="number"
                placeholder="NIK"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={bunga}
                onChange={(e) => setBunga(e.target.value)}
              />
              
              <label
                htmlFor="alamat"
                className="block text-900 text-sm font-medium mb-2"
              >
                Deskripsi
              </label>
              <InputTextarea
                id="alamat"
                rows={4}
                placeholder="Alamat"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
  
             

              <Button
                label="Sign In"
                className="w-full p-3 text-sm"
                onClick={handleSave}
              ></Button>
            </div>
        </div>

        
      </div>
    </div>
  ) : (
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Master Pinjaman</h5>
        <a href={'/admin/master_pinjam/tambah'}  rel="noopener noreferrer" className="w-11rem mr-2">
      <Button
        label={"Tambah Data"}
        className="w-11rem mb-3"
      />
      </a>
        <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}">
          <Column field="jenis_pinjaman" header="Jenis Pinjaman" style={{ width: '25%' }}></Column>
          <Column field="deskripsi" header="Deskripsi" style={{ width: '25%' }}></Column>
          <Column field="maksimal_pinjaman" header="Maksimal Pinjaman" style={{ width: '25%' }}></Column>
          <Column field="lama_angsuran" header="Lama Angsuran" style={{ width: '25%' }}></Column>
          <Column field="bunga" header="Bunga" style={{ width: '25%' }}></Column>
          <Column field="created_by" header="Created By" style={{ width: '25%' }}></Column>
          <Column body={dateBodyTemplate} header="Created At" style={{ width: '25%' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} ></Column>
        </DataTable>
      </div>
    </div>
  )}
  </div>
   
  );
};

export default withAuth(PageComponent);
