import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Trader {
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    country: string,
    approved: boolean,
    balance: number
}

export default function AdminDashboard() {
    const [adminUserName, setAdminUserName] = useState<string>("");
    const [trader, setTrader] = useState<Trader>({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        approved: false,
        balance: 0
    })
    const [traderArray, settraderArray] = useState<object[]>([]);

    const fetchAdmin = async (): Promise<void> => {
        const url = `http://127.0.0.1:3000/api/admins/${localStorage.getItem("adminId")}`;

        await axios.get(url).then((response) => {
            //console.log(response.data.data.relationships.traders.data);
        }).catch(errors => console.log(errors))
    }

    const fetchEveryTrader = async(): Promise<void> => {
        const url = "http://127.0.0.1:3000/api/traders";

        await axios.get(url).then((response => {
            /*console.log(response.data.data);*/
            const result = response.data.data;
            result.map((elements: {[key: string]: any}) => {
                settraderArray(traderArray => [...traderArray, elements]);
            })


        })).catch(errors => console.log(errors))
    }

    useEffect(() => {
        fetchAdmin();
        fetchEveryTrader();
    }, [])


    console.log(traderArray);

  return (
    <div className='w-screen h-screen'>
        <nav className='flex flex-row justify-between items-center bg-yellow-500 w-screen h-14 p-6'>
            <div className='flex flex-row justify-center items-center'>
                <h1 className='text-3xl font-bold'>Tradeable</h1>
            </div>

            <div className='w-[300px] flex flex-row justify-between items-center'>
                <Link to="/register" className='text-xl underline'>Create a trader</Link>
                <h1 className='text-xl'>admin</h1>
            </div>

        </nav>
        <div className='flex flex-col w-full h-full bg-slate-700'>
            <div className='flex flex-row justify-center items-center mt-4'>
                <h1 className='text-4xl text-white'>List of Traders</h1>
            </div>
            <div className='flex flex-col justify-center items-center overflow-y-scroll mt-4 scroll-pt-6'>

                {traderArray.map((traderObject: {[key: string]: any}, index: number) => {
                    return <div className='flex flex-row w-full h-14 bg-sky-500 mb-6 p-6 items-center justify-between' key={index}>
                        <h1 className='text-xl'>{traderObject.attributes.username}</h1>
                        <div className='flex flex-row w-96 justify-between'>
                            <Link to="/profile" onClick={() => localStorage.setItem("traderId", traderObject.id)}>View Profile</Link>
                            {!traderObject.attributes.approved && <h1>Requesting for approval</h1>}
                        </div>
                    </div>
                })}
            </div>

        </div>

    </div>
  )
}
