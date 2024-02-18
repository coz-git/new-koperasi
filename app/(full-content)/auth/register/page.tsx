/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { LayoutContext } from "../../../../layout/context/layoutcontext";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";

import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";

const LoginPage = () => {
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
  const { layoutConfig } = useContext(LayoutContext);

  const router = useRouter();
  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" }
  );
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
      role,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        // console.log(data.token);
        // Registrasi berhasil, lakukan tindakan yang sesuai
        const token = data.token;
        const emaill = data.email;
        const role = data.role;
        const status = data.status;
        const name = data.name;

        // Simpan token ke local storage atau context state
        localStorage.setItem("token", token);
        localStorage.setItem("email", emaill);
        localStorage.setItem("role", role);
        localStorage.setItem("status", status);
        localStorage.setItem("name", name);
        console.log("Registration successful");
        router.push("/"); // Pindahkan ke halaman login
      } else {
        // Registrasi gagal, lakukan tindakan yang sesuai
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };
  return (
    <div className={containerClassName}>
      <div className="flex flex-column align-items-center justify-content-center">
        <img
          src={`/layout/images/logo-${
            layoutConfig.colorScheme === "light" ? "dark" : "white"
          }.svg`}
          alt="Sakai logo"
          className="mb-5 w-6rem flex-shrink-0"
        />
        <div
          style={{
            borderRadius: "56px",
            padding: "0.3rem",
            background:
              "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
          }}
        >
          <div
            className="w-full surface-card py-8 px-5 sm:px-8"
            style={{ borderRadius: "53px" }}
          >
            <div className="text-center mb-5">
              <img
                src="/demo/images/login/avatar.png"
                alt="Image"
                height="50"
                className="mb-3"
              />
              <div className="text-900 text-3xl font-medium mb-3">
                Welcome, Admin
              </div>
              <span className="text-600 font-medium">Sign in to continue</span>
            </div>

            <div>
              <label
                htmlFor="email1"
                className="block text-900 text-xl font-medium mb-2"
              >
                Full Name
              </label>
              <InputText
                id="name"
                type="text"
                placeholder="Full name"
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
                value={name}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setName(e.target.value)}
              />
              <label
                htmlFor="email1"
                className="block text-900 text-xl font-medium mb-2"
              >
                Username
              </label>
              <InputText
                id="username"
                type="text"
                placeholder="Username"
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
                value={username}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setUsername(e.target.value)}
              />
              <label
                htmlFor="email1"
                className="block text-900 text-xl font-medium mb-2"
              >
                Email
              </label>
              <InputText
                id="email"
                type="text"
                placeholder="Email address"
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
                value={email}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setEmail(e.target.value)}
              />

              <label
                htmlFor="nik"
                className="block text-900 text-xl font-medium mb-2"
              >
                NIK
              </label>
              <InputText
                id="nik"
                type="text"
                placeholder="NIK"
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
                value={nik}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setNik(e.target.value)}
              />

              <label
                htmlFor="nip"
                className="block text-900 text-xl font-medium mb-2"
              >
                NIP
              </label>
              <InputText
                id="nip"
                type="text"
                placeholder="NIP"
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
                value={nip}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setNip(e.target.value)}
              />

              <label
                htmlFor="alamat"
                className="block text-900 text-xl font-medium mb-2"
              >
                Alamat
              </label>
              <InputTextarea
                id="alamat"
                rows={4}
                placeholder="Alamat"
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
                value={alamat}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setAlamat(e.target.value)}
              />

              <label
                htmlFor="status"
                className="block text-900 text-xl font-medium mb-2"
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
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
                onChange={(e: { value: React.SetStateAction<string> }) =>
                  setStatus(e.value)
                }
              />

              <label
                htmlFor="status"
                className="block text-900 text-xl font-medium mb-2"
              >
                Status
              </label>
              <Dropdown
                id="status"
                value={role}
                options={[
                  { label: "Admin", value: "Admin" },
                  { label: "User", value: "User" },
                ]}
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
                onChange={(e: { value: React.SetStateAction<string> }) =>
                  setRole(e.value)
                }
              />

              <label
                htmlFor="password1"
                className="block text-900 font-medium text-xl mb-2"
              >
                Password
              </label>
              <Password
                inputId="password"
                value={password}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setPassword(e.target.value)}
                placeholder="Password"
                toggleMask
                className="w-full mb-5"
                inputClassName="w-full p-3 md:w-30rem"
              />

              <Button
                label="Sign In"
                className="w-full p-3 text-xl"
                onClick={handleRegistration}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
