"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import  { useRouter } from "next/navigation";

// import { Link } from 'react-router-dom'; 

interface UserData {
  id: string;
  nama_bank: string;
  no_rekening:string;
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

const PageComponent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [nama_bank, setNama_bank] = useState("")
  const [no_rekening, setNo_rekening] = useState("")
  const [id, setId] = useState("");
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/bank/view');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEditClick = (dataToEdit: { id: React.SetStateAction<string>; nama_bank: React.SetStateAction<string>; no_rekening: React.SetStateAction<string>; }) => {
    setNama_bank(dataToEdit.nama_bank);
    setNo_rekening(dataToEdit.no_rekening);
    setId(dataToEdit.id);
    setIsEditing(true);
  };

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const formattedDateTime = formatDateTime(new Date());

  const handleSave = async () => {
    const formData = {
      id,
      nama_bank,
      no_rekening
    };

    try {
      const response = await fetch('/api/bank/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Registration successful');
        setIsEditing(false);
        fetchData();
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }

  }

  const actionBodyTemplate = (rowData : UserData) => {
    return (
      <React.Fragment>
        <button
          onClick={() => handleEditClick(rowData)}
          className={'bg-green-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300'}
        >
          Edit
        </button>|
        <button
          onClick={() => handleInactiveClick(rowData.id, rowData.status)}
          className={`bg-${rowData.status === 'active' ? 'red' : 'green'}-500 text-white py-1 px-2 rounded hover:bg-${rowData.status === 'active' ? 'red' : 'green'}-600 transition duration-300`}
        >
          {rowData.status === 'active' ? 'inactive' : 'active'}
        </button>
      </React.Fragment>
    );
  };

  const handleInactiveClick = async (id: string,status:string) => {
    try {
      // console.log(status);
      if(status=="inactive"){
        status="active"
      }else{  
        status="inactive"
      }
      const response = await fetch('/api/bank/update_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          "status":status
        }),
      });
      let id2=localStorage.getItem("id");
      console.log(id2);
      console.log(id);
      if(id2===id.toString()){
        localStorage.setItem('status', status);

      }

      setData(prevData =>
        prevData.map(item => (item.id === id ? { ...item, status: status} : item))
      );
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="p-grid p-dir-col">
      {isEditing ? (
      // Tampilkan formulir edit jika sedang dalam mode pengeditan
      <div className="grid p-fluid">
        <div className="col-12 md:col-12">
          <div className="card">
            <h5>Ubah Data</h5>

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
                  Name
                </label>
                <InputText
                  id="name"
                  type="text"
                  placeholder="Name"
                  className="w-full md:w-90 mb-5"
                  style={{ padding: "1rem" }}
                  value={nama_bank}
                  readOnly
                  onChange={(e) => setNama_bank(e.target.value)}
                />
                <label
                  htmlFor="email1"
                  className="block text-900 text-sm font-medium mb-2"
                >
                  Value
                </label>
                <InputText
                  id="value"
                  type="text"
                  placeholder="value"
                  className="w-full md:w-90 mb-5"
                  style={{ padding: "1rem" }}
                  value={no_rekening}
                  onChange={(e) => setNo_rekening(e.target.value)}
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
          <h5 className="text-xl font-semibold mb-4">Master Parameter</h5>
          <a href={'/admin/master_bank/tambah'}  rel="noopener noreferrer" className="w-11rem mr-2">
        <Button
          label={"Tambah Data"}
          className="w-11rem mb-3"
        />
        </a>
            <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="{first} to {last} of {totalRecords}">
              <Column field="nama_bank" header="Nama Bank" style={{ width: '25%' }}></Column>
              <Column field="no_rekening" header="No Rekening" style={{ width: '25%' }}></Column>
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
