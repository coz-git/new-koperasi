"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

// import { Link } from 'react-router-dom'; 

interface UserData {
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
const withAuth = (WrappedComponent: React.ComponentType) => {
  // const router = useRouter();
  return (props: any) => {
    // Memeriksa apakah ada token dalam local storage
    const router = useRouter();
    

    useEffect(() => {
      const token = localStorage.getItem('token');
      const token2 = localStorage.getItem('role');
      console.log("token"+token);
      if (!token) {
        router.replace('/auth/login'); // Ganti dengan halaman login
      }
      if(token2=="User"){
        router.replace('/client/history_simpan');
      }
    }, []);

    // Jika token ada, render komponen halaman terproteksi
    return <WrappedComponent {...props} />;
  };
};

// const [allExpanded, setAllExpanded] = useState(false);
const PageComponent = () => {
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/masteruser');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleInactiveClick = async (id: number,status:string) => {
    try {
      // console.log(status);
      if(status=="inactive"){
        status="active"
      }else{ 
        status="inactive"
      }
      const response = await fetch('/api/updateuserstatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          "status":status
        }),
      });

      setData(prevData =>
        prevData.map(item => (item.id === id ? { ...item, status: status} : item))
      );
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="p-grid p-dir-col">
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Master User</h5>
        <a href={'/admin/master_user/tambah'}  rel="noopener noreferrer" className="w-11rem mr-2">
      <Button
        // icon={allExpanded ? "pi pi-minus" : "pi pi-plus"}
        label={"Tambah Data"}
        className="w-11rem mb-3"
      />
      </a>
       <table className="min-w-full border-collapse table-auto col">
          <thead>
            <tr className="bg-gray-100">
              <th className="border py-2 px-4">Nama</th>
              <th className="border py-2 px-4">NIP</th>
              <th className="border py-2 px-4">NIK</th>
              <th className="border py-2 px-4">Alamat</th>
              <th className="border py-2 px-4">Email</th>
              <th className="border py-2 px-4">Username</th>
              <th className="border py-2 px-4">Role</th>
              <th className="border py-2 px-4">Status</th>
              <th className="border py-2 px-4">Opsi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border py-2 px-4">{item.name}</td>
                <td className="border py-2 px-4">{item.nip}</td>
                <td className="border py-2 px-4">{item.nik}</td>
                <td className="border py-2 px-4">{item.alamat}</td>
                <td className="border py-2 px-4">{item.email}</td>
                <td className="border py-2 px-4">{item.username}</td>
                <td className="border py-2 px-4">{item.role}</td>
                <td className="border py-2 px-4">{item.status}</td>
                <td className="border py-2 px-4">
                  <button 
                 onClick={() => handleInactiveClick(item.id, item.status)}
                 className={`bg-${item.status === 'active' ? 'red' : 'green'}-500 text-white py-1 px-2 rounded hover:bg-${item.status === 'active' ? 'red' : 'green'}-600 transition duration-300`}
               >
                 {item.status === 'active' ? 'inactive' : 'active'}
          </button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

export default withAuth(PageComponent);
