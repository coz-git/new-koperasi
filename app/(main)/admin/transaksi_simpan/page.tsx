"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import  { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import moment from 'moment'

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

const dateBodyTemplate = (rowData: any) => {
  return moment(rowData.created_at).format('DD/MM/YYYY')
};

// const [allExpanded, setAllExpanded] = useState(false);
const PageComponent = () => {
 
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/view_data?nama_tabel=transaksi_simpanans');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }; 

  return (
    <div className="p-grid p-dir-col">
    
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Transaksi Simpan</h5>
        <a href={'/admin/transaksi_simpan/tambah'}  rel="noopener noreferrer" className="w-11rem mr-2">
      <Button
        // icon={allExpanded ? "pi pi-minus" : "pi pi-plus"}
        label={"Tambah Data"}
        className="w-11rem mb-3"
      />
      </a>
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
