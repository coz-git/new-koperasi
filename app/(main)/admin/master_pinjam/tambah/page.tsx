"use client";
import React, { useContext, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

const InputDemo = () => {
  const [jenis_pinjaman, setJenis] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [maksimal_pinjaman, setAmount] = useState("");
  const [lama_angsuran, setAngsuran] = useState("");
  const [bunga, setBunga] = useState("");
  const router = useRouter();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
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
  const handleRegistration = async () => {
    const token2 = localStorage.getItem('role');
    console.log(token2);
    console.log(formattedDateTime);
    const formData = {
      jenis_pinjaman,
      deskripsi,
      lama_angsuran,
      maksimal_pinjaman,
      bunga,
      created_at: formattedDateTime, 
      created_by:token2,
    };

    try {
      const response = await fetch('/api/master_pinjaman/page_view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registrasi berhasil, lakukan tindakan yang sesuai
        console.log('Registration successful');
        router.push('/admin/master_pinjam'); // Pindahkan ke halaman login
      } else {
        // Registrasi gagal, lakukan tindakan yang sesuai
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

 

  return (
    <div className="grid p-fluid">
      <div className="col-12 md:col-12">
        <div className="card">
          <h5>Tambahkan Data</h5>

          <div>
            <label
                htmlFor="email1"
                className="block text-900 text-sm font-medium mb-2"
              >
                Jenis Pinjaman
              </label>
              <InputText
                id="name"
                type="text"
                placeholder="Jenis Pinjaman"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={jenis_pinjaman}
                onChange={(e) => setJenis(e.target.value)}
              />
  
              <label
                htmlFor="nik"
                className="block text-900 text-sm font-medium mb-2"
              >
                Maksimal Pinjaman
              </label>
              <InputText
                id="nik"
                type="number"
                placeholder="Maksimal Pinjaman"
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
                placeholder="Lama Angsuran"
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
                placeholder="Bunga"
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
                placeholder="Deskripsi"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
  
             

              <Button
                label="Simpan"
                className="w-full p-3 text-sm"
                onClick={handleRegistration}
              ></Button>
            </div>
        </div>

        
      </div>
    </div>
  );
};

export default InputDemo;
