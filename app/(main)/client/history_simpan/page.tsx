"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import  { useRouter } from "next/navigation";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import moment from 'moment'

interface UserData {
  id: number;
  nama: string;
  jenis_simpan: string;
  deskripsi: string;
  besar_simpanan: string;
  created_by: string;
  created_at: string;
  email: string;
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
    const token2 = localStorage.getItem('email');
    try {
      const response = await axios.get(`/api/user/history_simpan?email=${token2}`);
      console.log(response.data);
      setNilai(response.data.rows2[0].total_simpanan);
      setData(response.data.rows);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
 
  const dateBodyTemplate = (rowData: any) => {
    return moment(rowData.created_at).format('DD/MM/YYYY')
  };

  return (
    <div className="p-grid p-dir-col">
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold ">History Simpanan</h5>
        <h5 className="text-sm font-bold mb-4">Total Simpanan:{nilai}</h5>
        <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}">
          <Column field="nama" header="Nama" style={{ width: '25%' }}></Column>
          <Column field="jenis_simpan" header="Jenis Simpanan" style={{ width: '25%' }}></Column>
          <Column field="deskripsi" header="Deskripsi" style={{ width: '25%' }}></Column>
          <Column field="besar_simpanan" header="Besar Simpanan" style={{ width: '25%' }}></Column>
          <Column field="created_by" header="Created By" style={{ width: '25%' }}></Column>
          <Column body={dateBodyTemplate} header="Created At" style={{ width: '25%' }}></Column>
          <Column field="email" header="Email" style={{ width: '25%' }}></Column>
        </DataTable>
      </div>
    </div>
  </div>
  );
};

export default withAuth(PageComponent);
