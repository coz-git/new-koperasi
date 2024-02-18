"use client";
import React, { useContext, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { Password } from "primereact/password";

const InputDemo = () => {
  const [jenis_simpanan, setJenis] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [amount, setAmount] = useState("");
  const [created_by, setCreatedBy] = useState("");
  const [created_at, setCreatedAt] = useState("");
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
      jenis_simpanan,
      deskripsi,
      amount,
      created_at: formattedDateTime, 
      created_by:token2,
    };

    try {
      const response = await fetch('/api/master_simpanan/page_view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registrasi berhasil, lakukan tindakan yang sesuai
        console.log('Registration successful');
        router.push('/admin/master_simpan'); // Pindahkan ke halaman login
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
                Jenis Simpanan
              </label>
              <InputText
                id="name"
                type="text"
                placeholder="Jenis Simpan"
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
                onClick={handleRegistration}
              ></Button>
            </div>
        </div>

        
      </div>
    </div>
  );
};

export default InputDemo;
