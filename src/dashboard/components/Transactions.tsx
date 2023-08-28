import React from 'react'
import axios from 'axios'
import {useEffect, useState} from 'react';


export default function Transactions(props: {[key: string]: any}) {
  const [transactionArray, setTransactionArray] = useState<object[]>([]);


  const fetchTransactions = async(): Promise<void> => {
    const url: string = `https://trading-app-backend.onrender.com/api/tickers/${props.tickerId}`;

    await axios.get(url).then((response) => {
      const transactionData = response.data.included;
      const result = response;
      console.log(result);
      transactionData.map((element: {[key: string]: any}) => {
        console.log(element.attributes);
        setTransactionArray(transactionArray => [...transactionArray, element.attributes]);
      })
    }).catch(errors => console.log(errors))
  }

  useEffect(() => {
    fetchTransactions();
  }, [])

  return (
    <div className='flex flex-col w-1/2 h-1/3 fixed self-center overflow-hidden bg-slate-800 z-50 bg-opacity-70 justify-center items-center overflow-y-scroll'>
        {transactionArray.map((element: {[key: string]: any}, index: number) => {
            return <div className='flex flex-row justify-between items-center bg-sky-500 w-[600px] h-1/2 mb-4 p-6 rounded-xl'>
                <h1 className='text-3xl'>{element.action.toUpperCase()}</h1>
                <h1 className='text-xl' style={{color: element.profit > 0? "green" : "red"}}>{element.profit > 0? "Profit" : "Loss"}: {element.profit}</h1>
                <h1 className='text-xl' style={{color: element.percent > 0? "green" : "red"}}>Percent: {element.percent}</h1>
            </div>
        })}
    </div>
  )
}
