"use client";
import React, { useContext, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { Password } from "primereact/password";

const InputDemo = () => {
  const [nama_bank, setNama_bank] = useState("")
  const [no_rekening, setNo_rekening] = useState("")
  const [status, setStatus] = useState("active");
  const router = useRouter();

  const handleRegistration = async () => {
    const formData = {
      nama_bank,
      no_rekening,
      status
    };

    try {
      const response = await fetch('/api/bank/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registrasi berhasil, lakukan tindakan yang sesuai
        console.log('Registration successful');
        router.push('/admin/master_bank'); // Pindahkan ke halaman login
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
                Bank Transfer
              </label>
              <InputText
                id="nama_bank"
                type="text"
                placeholder="Nama Bank"
                className="w-full md:w-90 mb-5"
                style={{ padding: "1rem" }}
                value={nama_bank}
                onChange={(e) => setNama_bank(e.target.value)}
              />
              <label
                htmlFor="email1"
                className="block text-900 text-sm font-medium mb-2"
              >
                Value
              </label>
              <InputText
                id="no_rekening"
                type="text"
                placeholder="No Rekening"
                className="w-full md:w-90 mb-5"
                style={{ padding: "1rem" }}
                value={no_rekening}
                onChange={(e) => setNo_rekening(e.target.value)}
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
