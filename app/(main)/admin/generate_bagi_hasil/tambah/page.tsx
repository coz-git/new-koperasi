"use client";
import React, { useContext, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import axios from "axios";
interface DashboardData {
  pengajuan: number;
  user: number;
  pemasukan: number | null;
  pinjaman: number;
  simpanan_pokok:number |null;
  simpanan_wajib:number |null;
  simpanan_sukarela:number |null;
  total_pinjaman:number |null;
}
const InputDemo = () => {
  const [presentase_anggota, setPresentaseAnggota] = useState<number | ''>('');
  const [presentase_koperasi, setPresentaseKoperasi] = useState<number | ''>('');
  const [vee_admin, setVeeAdmin] = useState<number | ''>('');
  const [periode, setPeriode] = useState(new Date().getFullYear());
  const [amount_koperasi, setAmountKoperasi] = useState<number | ''>('');
  const [amount_admin, setAmountAdmin] = useState<number | ''>('');
  const [amount_anggota, setAmountAnggota] = useState<number | ''>('');
  const router = useRouter();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState<DashboardData>({ pengajuan: 0,
    user: 0,
    pemasukan: null,
    pinjaman: 0,
    simpanan_pokok:null,
    simpanan_sukarela:0,
    simpanan_wajib:0,
    total_pinjaman:0,
  }); 
  useEffect(() => {
    // Fungsi untuk mengupdate tanggal dan waktu setiap detik
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    fetchData()
    

    // Membersihkan interval ketika komponen unmount
    return () => clearInterval(intervalId);
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/dashboard?email=${token2}');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
  const formattedDateTime = formatDateTime(currentDateTime);
  const handleRegistration = async () => {
    const token2 = localStorage.getItem('role');
    console.log(token2);
    console.log(formattedDateTime);
    const formData = {
      presentase_anggota,
      presentase_koperasi,
      vee_admin,
      periode,
      amount_admin,
      amount_anggota,
      amount_koperasi,
    };

    try {
      const response = await fetch('/api/master_bagihasil/view_page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registrasi berhasil, lakukan tindakan yang sesuai
        console.log('Registration successful');
        router.push('/admin/generate_bagi_hasil'); // Pindahkan ke halaman login
      } else {
        // Registrasi gagal, lakukan tindakan yang sesuai
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };
const handlePresentaseAnggotaChange = (e: { target: { value: string; }; }) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setPresentaseAnggota(newValue);
      if (newValue > 0) {
        setPresentaseKoperasi(100 - newValue);
      }
    }
  };
 const handlePresentaseKoperasiChange = (e: { target: { value: string; }; }) => {
  const newValue = parseInt(e.target.value);
  if (!isNaN(newValue) && newValue >= 0) {
  const presentaseAnggotaNumber = presentase_anggota as number; // Mengkonversi presentase_anggota ke tipe number
  if (newValue <= (100 - presentaseAnggotaNumber)) {
    setPresentaseKoperasi(newValue);
    const veeAdminValue = 100 - presentaseAnggotaNumber - newValue;
    const data =dashboardData.pemasukan as number;
    setAmountAdmin(data*veeAdminValue/100);
    setAmountAnggota(data*presentaseAnggotaNumber/100);
    setAmountKoperasi(data*newValue/100);
    setVeeAdmin(veeAdminValue);

  }
}
};

 

  return (
    <div className="grid p-fluid">
      <div className="col-12 md:col-12">
        <div className="card">
          <h5>Tambahkan Data</h5>

          <div>
             <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
        Presentase Anggota
      </label>
      <input
        id="name"
        type="text"
        placeholder="Presentase Anggota"
        className="w-full md:w-full mb-5"
        style={{ padding: "1rem" }}
        value={presentase_anggota === '' ? '' : presentase_anggota.toString()}
        onChange={handlePresentaseAnggotaChange}
      />

      <label htmlFor="nik" className="block text-900 text-xl font-medium mb-2">
        Presentase Koperasi
      </label>
      <input
        id="nik"
        type="number"
        placeholder="Presentase Koperasi"
        className="w-full md:w-full mb-5"
        style={{ padding: "1rem" }}
        value={presentase_koperasi === '' ? '' : presentase_koperasi.toString()}
        onChange={handlePresentaseKoperasiChange}
        disabled={presentase_anggota === '' || presentase_anggota === 100}
      />
              <label
                htmlFor="nik"
                className="block text-900 text-xl font-medium mb-2"
              >
                Vee Admin
              </label>
              <InputText
                id="nik"
                type="number"
                placeholder="vee admin"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={vee_admin === '' ? '' : vee_admin.toString()}
                 onChange={(e) => {}}
                disabled
              />
              <label
                htmlFor="nik"
                className="block text-900 text-xl font-medium mb-2"
              >
                Periode
              </label>
              <InputText
                id="nik"
                type="number"
                placeholder="Bunga"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={periode.toString()}
                onChange={(e) => {}}
                disabled
              />
               <label
                htmlFor="nik"
                className="block text-900 text-xl font-medium mb-2"
              >
                Amount Koperasi
              </label>
              <InputText
                id="nik"
                type="number"
                placeholder="Amount Koperasi"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={amount_koperasi.toString()}
                onChange={(e) => {}}
                disabled
              />
               <label
                htmlFor="nik"
                className="block text-900 text-xl font-medium mb-2"
              >
                Amount Admin
              </label>
              <InputText
                id="nik"
                type="number"
                placeholder="Amount Admin"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={amount_admin.toString()}
                onChange={(e) => {}}
                disabled
              />
               <label
                htmlFor="nik"
                className="block text-900 text-xl font-medium mb-2"
              >
                Amount Anggota
              </label>
              <InputText
                id="nik"
                type="number"
                placeholder="Amount Anggota"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={amount_anggota.toString()}
                onChange={(e) => {}}
                disabled
              />
  

              <Button
                label="Simpan"
                className="w-full p-3 text-xl"
                onClick={handleRegistration}
              ></Button>
            </div>
        </div>

        
      </div>
    </div>
  );
};

export default InputDemo;
