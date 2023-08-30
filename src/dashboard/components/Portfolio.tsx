import React from 'react';
import { useState } from 'react';
import Transactions from './Transactions';

export default function Portfolio(props: {[key: string]: any}): JSX.Element {

  const [showTransaction, setShowTransaction] = useState<boolean>(false);
  const [tickerId, setTickerId]= useState<number>(0);
  return (
    <div className='flex flex-row justify-between items-center w-full h-4/5 bg-slate-800 z-50 bg-opacity-70 fixed overflow-hidden'>
      <div className='flex flex-col w-1/2 h-2/3 overflow-y-scroll overflow-hidden justify-around items-center'>
          {props.portfolioArray.map((element: {[key: string]: any}, index: number) => {
              return <div className='flex flex-row justify-between items-center bg-sky-500 w-[600px] h-1/3 mb-4 p-6 rounded-xl' key={index}>
                  <h1 className='text-3xl'>{element.attributes.symbol}</h1>
                  <button onClick={() => {
                    setShowTransaction(!showTransaction);
                    setTickerId(element.id)
                  }}>View Transactions</button>
              </div>
          })}
      </div>
      <div className='flex flex-col w-1/2 h-full justify-center items-center'>
        {showTransaction && <Transactions tickerId={tickerId}/>}
      </div>
    </div>
  )
}
