"use client"
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { Dialog } from 'primereact/dialog';

interface UserData {
  id: string;
  name: string;
  nip: string;
  acc_by: string;
  id_transaksi: string;
  angsuran_ke: string;
  jumlah_angsuran_bulan: string;
  sisa_angsuran: string;
  status: string;
  foto: string;
  created_at: string;
}

interface BankData {
  id: string;
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
      console.log("token" + token);
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
  const token = localStorage.getItem('email');
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]
  const [dataBank, setDataBank] = useState<BankData[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [id_transaksi, setTransaksi] = useState("");
  const [angsuran_ke, setAngsuran] = useState("");
  const [jumlah_angsuran_per_bulan, setAngsuran_bulan] = useState("");
  const [sisa_angsuran, setSisa] = useState("");
  const [status, setStatus] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [acc_by, setAcc_by] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name : '',
    nip : '',
    acc_by : '',
    id_transaksi : '',
    angsuran_ke : '',
    jumlah_angsuran_per_bulan : '',
    sisa_angsuran : '',
    status : '',
    foto : '',
    created_at: '',
    created_by : ''
  })

  const handlePaymentClick = async (dataToEdit: {
    id: React.SetStateAction<string>; id_transaksi: React.SetStateAction<string>; angsuran_ke: React.SetStateAction<string>;
    jumlah_angsuran_bulan: React.SetStateAction<string>; sisa_angsuran: React.SetStateAction<string>;
    status: React.SetStateAction<string>; name: React.SetStateAction<string>; nip: React.SetStateAction<string>; acc_by: React.SetStateAction<string>;
  }) => {

    const token2 = localStorage.getItem('role');
    // console.log(token2);
    // console.log(JSON.stringify(formData));
    
    // const formData = {
    //   id: dataToEdit.id,
    //   name: dataToEdit.name,
    //   nip: dataToEdit.nip,
    //   acc_by: dataToEdit.acc_by,
    //   id_transaksi: dataToEdit.id_transaksi,
    //   angsuran_ke: dataToEdit.angsuran_ke,
    //   jumlah_angsuran_per_bulan: dataToEdit.jumlah_angsuran_bulan,
    //   sisa_angsuran: dataToEdit.sisa_angsuran,
    //   status: dataToEdit.status,
    //   foto: "null",
    //   created_at: formattedDateTime,
    //   created_by: token2,
    // };

    try {
      const response = await fetch('/api/user/tambah_pembayaran', {
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

  const handleEditClick = (dataToEdit: {
    id: React.SetStateAction<string>; id_transaksi: React.SetStateAction<string>; angsuran_ke: React.SetStateAction<string>;
    jumlah_angsuran_bulan: React.SetStateAction<string>; sisa_angsuran: React.SetStateAction<string>;
    status: React.SetStateAction<string>; name: React.SetStateAction<string>; nip: React.SetStateAction<string>; acc_by: React.SetStateAction<string> }) => {
    // setId(dataToEdit.id);
    // // setName(dataToEdit.name);
    // // setNip(dataToEdit.nip);
    // // setAcc_by(dataToEdit.acc_by);
    // // setStatus(dataToEdit.status);
    // // setSisa(dataToEdit.id);
    // // setAngsuran_bulan(dataToEdit.jumlah_angsuran_bulan);
    // // setAngsuran(dataToEdit.id);
    // // setTransaksi(dataToEdit.id);
    setFormData(dataToEdit);
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

  const customBase64Uploader = async (event : any) => {
    // convert file to base64 encoded
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

    reader.readAsDataURL(blob);

    reader.onloadend = function () {
      const base64data = reader.result;
      setImagePreview(base64data)
      setFormData({...formData, foto : base64data})
    };

  };

  useEffect(() => {
    fetchData();
    fetchDataBank();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/user/pembayaran?email=${token}`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataBank = async () => {
    try {
      const response = await axios.get(`/api/bank/view_active_only`);
      console.log(response.data);
      setDataBank(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const actionBodyTemplate = (rowData: UserData) => {
    return (
      <React.Fragment>
        <button
          onClick={() => handleEditClick(rowData)}
          className={`${rowData.status !== 'Sudah Dibayar' && rowData.status !== "Lunas" && rowData.status !== "Ditolak" && rowData.status !== 'Pending' ? 'bg-green-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300' : 'hidden'
            }`}
        >
          Bayar
        </button>
      </React.Fragment>
    );
  };

  const previewImageTemplate = (rowData: any) => {
    return <Image src={rowData.foto} alt="Image" width="100" preview />
  };

  return (
    <div className="p-grid p-dir-col">
      {isEditing ? (
        // Tampilkan formulir edit jika sedang dalam mode pengeditan
        <div className="grid p-fluid">
          <div className="col-12 md:col-12">
            <div className="card">
              <h5>Bukti Bayar</h5>
              <div>
                <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" className="w-full mb-5" customUpload uploadHandler={customBase64Uploader} auto />

                <Image src={imagePreview} alt="Image" width="250" preview />
                
                <Button
                  label="Simpan"
                  className="w-full p-3 text-sm"
                  onClick={handlePaymentClick}
                ></Button>
              </div>
            </div>


          </div>
        </div>
      ) : (
        <div className="p-col-12">
          <Dialog header="Mohon untuk transfer kedalam no rekening dibawah" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
              <DataTable value={dataBank} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} 
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}">
                <Column header="#" style={{ width: '5%' }} body={(data, options) => options.rowIndex + 1}></Column>
                <Column field="nama_bank" header="Nama Bank" style={{ width: '10%' }}></Column>
                <Column field="no_rekening" header="No Rekening" style={{ width: '10%' }}></Column>
              </DataTable>
          </Dialog>
          <div className="card p-4">
              <div className="flex justify-between items-center">
              <p className="text-xl text-center font-semibold mb-4">Master Pembayaran</p>
                <Button label="Cara Bayar" size="small" severity="warning" icon="pi pi-question-circle" rounded onClick={() => setVisible(true)} />
              {/* <p className="text-xl text-center font-semibold mb-4">Cara Bayar</p> */}
            </div>
            <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="{first} to {last} of {totalRecords}">
              <Column field="id_transaksi" header="ID Transaksi" style={{ width: '25%' }}></Column>
              <Column field="name" header="Name" style={{ width: '25%' }}></Column>
              <Column field="nip" header="NIP" style={{ width: '25%' }}></Column>
              <Column body={previewImageTemplate} header="Bukti Bayar" style={{ width: '25%' }}></Column>
              <Column field="angsuran_ke" header="Angsuran Ke" style={{ width: '25%' }}></Column>
              <Column field="jumlah_angsuran_bulan" header="Jumlah Angsuran Per Bulan" style={{ width: '25%' }}></Column>
              <Column field="sisa_angsuran" header="Sisa Angsuran" style={{ width: '25%' }}></Column>
              <Column field="status" header="Status" style={{ width: '25%' }}></Column>
              <Column field="acc_by" header="Acc_by" style={{ width: '25%' }}></Column>
              <Column body={actionBodyTemplate} exportable={false} ></Column>
            </DataTable>
          </div>
        </div>
      )}

    </div>
  );
};

export default withAuth(PageComponent);
