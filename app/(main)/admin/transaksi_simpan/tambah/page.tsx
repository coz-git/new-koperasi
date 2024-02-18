"use client";
import React, { useContext, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { Password } from "primereact/password";
import axios from "axios";

interface UserData {
  id: number;
  nama:string;
  jenis_simpanan:string;
  besar_simpanan: string;
  deskripsi: string;
  amount: string;
  email:string;
  created_by: string;
  created_at: string;
}
interface UserData2{
  id: number;
  name: string;
  nip: string;
  nik: string;
  alamat: string;
  email: string;
  username: string;
  role: string;
  status: string;
}
const InputDemo = () => {
  const [jenis_simpanan, setJenis] = useState("");
  const [name, setName] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
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
      name,
      email,
      jenis_simpanan,
      deskripsi,
      amount,
      created_at: formattedDateTime, 
      created_by:token2,
    };

    try {
      const response = await fetch('/api/transaksi_simpan/page_view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registrasi berhasil, lakukan tindakan yang sesuai
        console.log('Registration successful');
        router.push('/admin/transaksi_simpan'); // Pindahkan ke halaman login
      } else {
        // Registrasi gagal, lakukan tindakan yang sesuai
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]
  const [data2, setData2] = useState<UserData2[]>([]); 

  useEffect(() => {
    fetchData();
    fetchData2()
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/master_simpanan/jenis_simpan');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchData2 = async () => {
    try {
      const response = await axios.get('/api/masterview_user');
      setData2(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const handleJenisSimpananChange = (selectedValue: React.SetStateAction<string>) => {
    setJenis(selectedValue); // Memperbarui state jenis_simpanan sesuai dengan pilihan
    // Selanjutnya, Anda dapat menentukan "Amount" berdasarkan pilihan jenis_simpanan
    const selectedData = data.find((item) => item.jenis_simpanan === selectedValue);
    if (selectedData) {
      setAmount(selectedData.amount); // Memperbarui state amount sesuai dengan data yang dipilih
      setDeskripsi(selectedData.deskripsi);
    }
  };
  const handleUserChange = (selectedValue: React.SetStateAction<string>) => {
    setName(selectedValue); // Memperbarui state jenis_simpanan sesuai dengan pilihan
    // Selanjutnya, Anda dapat menentukan "Amount" berdasarkan pilihan jenis_simpanan
    const selectedData = data2.find((item) => item.name=== selectedValue);
    if (selectedData) {
      setEmail(selectedData.email); // Memperbarui state amount sesuai dengan data yang dipilih
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
                Nama
              </label>
              <select
                id="name"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={name}
                onChange={(e) => handleUserChange(e.target.value)}
              >
                <option value="">Pilih User</option>
                {data2.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
              </select>
              <label
                htmlFor="nik"
                className="block text-900 text-sm font-medium mb-2"
              >
                Email
              </label>
              <InputText
                id="nik"
                type="text"
                placeholder="Email"
                readOnly={true}
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
  
              <label
                htmlFor="email1"
                className="block text-900 text-sm font-medium mb-2"
              >
                Jenis Simpanan
              </label>
              <select
                id="name"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={jenis_simpanan}
                onChange={(e) => handleJenisSimpananChange(e.target.value)}
              >
                <option value="">Pilih Jenis Simpanan</option>
                {data.map((item) => (
                <option key={item.id} value={item.jenis_simpanan}>
                  {item.jenis_simpanan}
                </option>
              ))}
              </select>
  
              <label
                htmlFor="nik"
                className="block text-900 text-sm font-medium mb-2"
              >
                Total Simpanan
              </label>
              <InputText
                id="nik"
                type="number"
                placeholder="Amount"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                readOnly={jenis_simpanan === "Wajib" || jenis_simpanan === "Pokok"}
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
