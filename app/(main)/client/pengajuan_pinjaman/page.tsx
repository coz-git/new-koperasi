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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token2 = localStorage.getItem('email');
    try {
      const response = await axios.get(`/api/user/history_pinjaman?email=${token2}`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const approvalDateTemplate = (rowData: any) => {
    return moment(rowData.tanggal_pengajuan).format('DD/MM/YYYY')
  };

  const disburseDateTemplate = (rowData: any) => {
    return moment(rowData.tanggal_pencairan).format('DD/MM/YYYY')
  };

  return (
    <div className="p-grid p-dir-col">
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Master User</h5>
        <a href={'/client/pengajuan_pinjaman/tambah'}  rel="noopener noreferrer" className="w-11rem mr-2">
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
          <Column field="jenis_pinjaman" header="Jenis Pinjaman" style={{ width: '25%' }}></Column>
          <Column body={approvalDateTemplate} header="Tanggal Pengajuan" style={{ width: '25%' }}></Column>
          <Column body={disburseDateTemplate} header="Tanggal Pencairan" style={{ width: '25%' }}></Column>
          <Column field="jumlah_pinjaman" header="Jumlah Pinjaman" style={{ width: '25%' }}></Column>
          <Column field="bunga" header="Bunga" style={{ width: '25%' }}></Column>
          <Column field="nama_bank" header="Nama Bank" style={{ width: '25%' }}></Column>
          <Column field="no_rekening" header="No Rekening" style={{ width: '25%' }}></Column>
          <Column field="email" header="Email" style={{ width: '25%' }}></Column>
          <Column field="approved_by" header="Aproved By" style={{ width: '25%' }}></Column>
          <Column field="status" header="Status" style={{ width: '25%' }}></Column>
        </DataTable>
      </div>
    </div>
  </div>
  );
};

export default withAuth(PageComponent);
