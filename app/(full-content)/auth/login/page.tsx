/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { LayoutContext } from "../../../../layout/context/layoutcontext";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";

import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { layoutConfig } = useContext(LayoutContext);

  const router = useRouter();
  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" }
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      email,
      password,
    };
    // try {
    //   const response = await axios.post('/api/login', { email, password });
    //   const token = response.data.token;
    //   const emaill = response.data.email;
    //   const role = response.data.role;
    //   const status = response.data.status;
    //   const name = response.data.name;
    //   const id = response.data.id;

    //   // Simpan token ke local storage atau context state
    //   localStorage.setItem('token', token);
    //   localStorage.setItem('email', emaill);
    //   localStorage.setItem('role', role);
    //   localStorage.setItem('status', status);
    //   localStorage.setItem('name', name);
    //   localStorage.setItem('id', id);
    //   console.log(response.data.name);
    //   // Redirect ke halaman setelah login sukses
    //   window.location.href = '/'; // Ganti dengan halaman yang sesuai
    // } catch (error) {
    //   // alert(error.);
    //   console.error('Login error:', error);
    // }

    await axios.post("/api/login", { email, password }).then(response => {
      if (response.status == 200) {
        const token = response.data.token;
        const emaill = response.data.email;
        const role = response.data.role;
        const status = response.data.status;
        const name = response.data.name;
        const id = response.data.id;

        // Simpan token ke local storage atau context state
        localStorage.setItem('token', token);
        localStorage.setItem('email', emaill);
        localStorage.setItem('role', role);
        localStorage.setItem('status', status);
        localStorage.setItem('name', name);
        localStorage.setItem('id', id);

        // Redirect ke halaman setelah login sukses
        window.location.href = '/'; // Ganti dengan halaman yang sesuai
      } else {
        alert(response.data.message)
      }

    }).catch(err => {
      // console.log(err)
      Swal.fire({
        title: "Error",
        text: err.response.data.message,
        icon: 'error'
      })
    })

  };


  return (
    <div className={containerClassName}>
      <div className="flex flex-column align-items-center justify-content-center">
        {/* <img
          src={`/layout/images/logo-${layoutConfig.colorScheme === "light" ? "dark" : "white"
            }.svg`}
          alt="Sakai logo"
          className="mb-5 w-6rem flex-shrink-0"
        /> */}
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
              <div style={{ textAlign: 'center' }}>
                <div className="text-900 text-3xl font-medium mb-3">
                  Welcome Back, User!
                </div>
                <span className="text-600 font-medium">Sign in to continue</span>
              </div>
            </div>

            <div>
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
                className="w-full md:w-full mb-5"
                style={{ padding: "1rem" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label
                htmlFor="password1"
                className="block text-900 font-medium text-xl mb-2"
              >
                Password
              </label>
              <Password
                inputId="password1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                toggleMask
                className="w-full mb-5"
                inputClassName="w-full p-3 md:w-full"
                feedback={false}
              />
              <Button
                label="Sign In"
                className="w-full p-3 text-xl"
                onClick={handleSubmit}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default LoginPage;
