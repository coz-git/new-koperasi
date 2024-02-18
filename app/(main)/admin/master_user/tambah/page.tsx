"use client";
import React, { useContext, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { Password } from "primereact/password";

const InputDemo = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nik, setNik] = useState("");
  const [nip, setNip] = useState("");
  const [alamat, setAlamat] = useState("");
  const [status, setStatus] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const handleRegistration = async () => {
    const formData = {
      name,
      username,
      email,
      nik,
      nip,
      alamat,
      status,
      password,
      role
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registrasi berhasil, lakukan tindakan yang sesuai
        console.log('Registration successful');
        router.push('/'); // Pindahkan ke halaman login
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
                Full Name
              </label>
              <InputText
                id="name"
                type="text"
                placeholder="Full name"
                className="w-full md:w-90 mb-5"
                style={{ padding: "1rem" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
               <label
                htmlFor="email1"
                className="block text-900 text-sm font-medium mb-2"
              >
                Username
              </label>
              <InputText
                id="username"
                type="text"
                placeholder="Username"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
              />
              <label
                htmlFor="email1"
                className="block text-900 text-sm font-medium mb-2"
              >
                Email
              </label>
              <InputText
                id="email"
                type="text"
                placeholder="Email address"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
  
              <label
                htmlFor="nik"
                className="block text-900 text-sm font-medium mb-2"
              >
                NIK
              </label>
              <InputText
                id="nik"
                type="text"
                placeholder="NIK"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={nik}
                onChange={(e) => setNik(e.target.value)}
              />
  
              <label
                htmlFor="nip"
                className="block text-900 text-sm font-medium mb-2"
              >
                NIP
              </label>
              <InputText
                id="nip"
                type="text"
                placeholder="NIP"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={nip}
                onChange={(e) => setNip(e.target.value)}
              />
  
              <label
                htmlFor="alamat"
                className="block text-900 text-sm font-medium mb-2"
              >
                Alamat
              </label>
              <InputTextarea
                id="alamat"
                rows={4}
                placeholder="Alamat"
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
              />
  
              <label
                htmlFor="status"
                className="block text-900 text-sm font-medium mb-2"
              >
                Status
              </label>
              <Dropdown
                id="status"
                value={status}
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
                className="w-full md:w-full mb-5"
                onChange={(e) => setStatus(e.value)}
              />

              <label
                htmlFor="status"
                className="block text-900 text-sm font-medium mb-2"
              >
                Role
              </label>
              <Dropdown
                id="status"
                value={role}
                options={[
                  { label: "Admin", value: "Admin" },
                  { label: "User", value: "User" },
                ]}
                className="w-full md:w-full mb-5"
                onChange={(e) => setRole(e.value)}
              />
  
              <label
                htmlFor="password1"
                className="block text-900 font-medium text-sm mb-2"
              >
                Password
              </label>
              <Password
                inputId="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                toggleMask
                className="w-full mb-5"
                inputClassName="w-full p-3 md:w-full"
                feedback={false}
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
