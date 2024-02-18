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
  bunga:string;
  tanggal_pengajuan:string;
  jenis_pinjaman:string;
  maksimal_pinjaman: string;
  deskripsi: string;
  lama_angsuran: string;
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
  const [jenis_pinjaman, setJenis] = useState("");
  // const [bunga, setBunga] = useState("");
  const [jenis_bunga, setBunga] = useState("");
  const [maksimal_pinjaman, setPinjaman] = useState("");
  const [lama_angsuran, setAngsuran] = useState("");
  const [name, setName] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [amount, setAmount] = useState("");
  const [maxamount, setMaxAmount] = useState("");
  const [namaBank, setNamaBank] = useState("");
  const [noRekening, setNoRekening] = useState("");
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
    const token = localStorage.getItem('email');
    const token3 = localStorage.getItem('name');
    console.log(token2);
    console.log(formattedDateTime);
    const hasil=jenis_bunga as unknown as number ;
    const hasil2=amount as unknown as number ;
    const formData = {
      name:token3,
      jenis_pinjaman,
      tanggal_pengajuan:formattedDateTime,
      tanggal_pencairan:null,
      approved_by:null,
      amount,
      created_at: formattedDateTime, 
      created_by:token2,
      email:token,
      status:"pending",
      bunga:hasil/100*hasil2,
      nama_bank : namaBank,
      no_rekening : noRekening
    };

    try {
      const response = await fetch('/api/transaksi_pinjam/page_view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registrasi berhasil, lakukan tindakan yang sesuai
        console.log('Registration successful');
        router.push('/client/pengajuan_pinjaman'); // Pindahkan ke halaman login
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
      const response = await axios.get('/api/master_pinjaman/jenis_pinjam');
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
    const selectedData = data.find((item) => item.jenis_pinjaman === selectedValue);
    if (selectedData) {
      setAmount(selectedData.maksimal_pinjaman); // Memperbarui state amount sesuai dengan data yang dipilih
      setDeskripsi(selectedData.deskripsi);
      setAngsuran(selectedData.lama_angsuran);
      setBunga(selectedData.bunga);
      setMaxAmount(selectedData.maksimal_pinjaman);
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
              <InputText
                id="nik"
                type="text"
                placeholder="Amount"
                className="w-full md:w-full mb-5"
                // style={{ padding: "1rem" }}
                value={localStorage.getItem('name')||""
                    }
                onChange={(e) => setName(e.target.value)}
                readOnly
              />
              <label
                htmlFor="nik"
                className="block text-900 text-sm font-medium mb-2"
              >
                Email
              </label>
              <InputText
                id="nik"
                type="text"
                placeholder="Amount"
                className="w-full md:w-full mb-5"
                // style={{ padding: "1rem" }}
                value={localStorage.getItem('email')||""}
                onChange={(e) => setEmail(e.target.value)}
                readOnly
              />
  
              <label
                htmlFor="email1"
                className="block text-900 text-sm font-medium mb-2"
              >
                Pinjaman
              </label>
              <select
                id="name"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={jenis_pinjaman}
                onChange={(e) => handleJenisSimpananChange(e.target.value)}
              >
                <option value="">Pilih Pinjaman</option>
                {data.map((item) => (
                <option key={item.id} value={item.jenis_pinjaman}>
                  {item.jenis_pinjaman}
                </option>
              ))}
              </select>
  
              <label
                htmlFor="nik"
                className="block text-900 text-sm font-medium mb-2"
              >
                Maksimal
              </label>
              <InputText
                id="nik"
                type="number"
                placeholder="Maksimal"
                className="w-full md:w-full mb-5"
                // style={{ padding: "1rem" }}
                value={amount}
                onChange={(e) => {
                  const inputValue = parseInt(e.target.value);
                  if (!isNaN(inputValue)) {
                    const newAmount = parseInt(maxamount);
                    console.log(amount);
                    if (inputValue > newAmount) {
                      setAmount(newAmount.toString());
                    } else {
                      setAmount(inputValue.toString());
                    }
                  } else {
                    setAmount(''); // Menangani kasus ketika nilai yang dimasukkan bukan angka
                  }
                }}
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
                // style={{ padding: "1rem" }}
                value={lama_angsuran}
                onChange={(e) => setAngsuran(e.target.value)}
                readOnly={jenis_pinjaman === "Wajib" || jenis_pinjaman === "Pokok"}
              />
              <label
                htmlFor="nik"
                className="block text-900 text-sm font-medium mb-2"
              >
               Bunga
              </label>
              <InputText
                id="nik"
                type="Bunga"
                placeholder="Amount"
                className="w-full md:w-full mb-5"
                // style={{ padding: "1rem" }}
                value={jenis_bunga}
                onChange={(e) => setBunga(e.target.value)}
                readOnly
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
                // style={{ padding: "1rem" }}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
              <label
                htmlFor="nama_bank"
                className="block text-900 text-sm font-medium mb-2"
              >
                Nama Bank
              </label>
              <InputText
                id="nama_bank"
                type="text"
                placeholder="Nama Bank Transfer"
                className="w-full md:w-full mb-5"
                value={namaBank}
                onChange={(e) => setNamaBank(e.target.value)}
              />
              <label
                htmlFor="no_rek"
                className="block text-900 text-sm font-medium mb-2"
              >
                No Rekening
              </label>
              <InputText
              id="no_rek"
                type="text"
                placeholder="No Rekening Transfer"
                className="w-full md:w-full mb-5"
                value={noRekening}
                onChange={(e) => setNoRekening(e.target.value)}
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
