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
  jenis_simpanan: string;
  deskripsi: string;
  amount: string;
  created_by: string;
  created_at: string;
}
const withAuth = (WrappedComponent: React.ComponentType) => {
  
  return (props: any) => {
    const router = useRouter();
    

    useEffect(() => {
      const token = localStorage.getItem('token');
      const token2 = localStorage.getItem('role');
      console.log("token"+token);
      if (!token) {
        router.replace('/auth/login');
      }
      if(token2=="User"){
        router.replace('/client/history_simpan');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

const PageComponent = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [jenis_simpanan, setJenis] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [amount, setAmount] = useState("");
  const [id, setId] = useState("");
  const handleEditClick = (dataToEdit: { id: React.SetStateAction<string>; jenis_simpanan: React.SetStateAction<string>; deskripsi: React.SetStateAction<string>; amount: React.SetStateAction<string>; }) => {
    setJenis(dataToEdit.jenis_simpanan);
    setDeskripsi(dataToEdit.deskripsi);
    setAmount(dataToEdit.amount);
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
      jenis_simpanan,
      deskripsi,
      amount,
      created_at: formattedDateTime, 
      created_by:token2,
    };

    try {
      const response = await fetch('/api/master_simpanan/page_edit', {
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
      const response = await axios.get('/api/master_simpanan/jenis_simpan');
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
          "nama_tabel":"jenissimpanans"
        }),
      });

      fetchData();
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const dateBodyTemplate = (rowData : any) => {
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
                Jenis Simpanan
              </label>
              <InputText
                id="name"
                type="text"
                placeholder="Jenis Simpanan"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={jenis_simpanan}
                onChange={(e) => setJenis(e.target.value)}
              />
  
              <label
                htmlFor="nik"
                className="block text-900 text-sm font-medium mb-2"
              >
                Amount
              </label>
              <InputText
                id="nik"
                type="number"
                placeholder="Amount"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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
                placeholder="Deskripsi"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
  
              <Button
                label="Simpan"
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
        <h5 className="text-xl font-semibold mb-4">Master Simpanan</h5>
        <a href={'/admin/master_simpan/tambah'}  rel="noopener noreferrer" className="w-11rem mr-2">
      <Button
        // icon={allExpanded ? "pi pi-minus" : "pi pi-plus"}
        label={"Tambah Data"}
        className="w-11rem mb-3"
      />
      </a>
      <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}">
        <Column field="jenis_simpanan" header="Jenis Simpanan" style={{ width: '25%' }}></Column>
        <Column field="deskripsi" header="Deskripsi" style={{ width: '25%' }}></Column>
        <Column field="amount" header="Amount" style={{ width: '25%' }}></Column>
        <Column field="created_by" header="Created By" style={{ width: '25%' }}></Column>
        <Column body={dateBodyTemplate}  header="Created At" style={{ width: '25%' }}></Column>
        <Column body={actionBodyTemplate} exportable={false} ></Column>
      </DataTable>
      </div>
    </div>
  )}
  </div>
   
  );
};

export default withAuth(PageComponent);
