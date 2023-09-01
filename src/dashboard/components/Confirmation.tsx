import axios from 'axios'
import { useEffect, useState } from 'react';

export const Confirmation = (props: {[key: string]: any}): JSX.Element => {

    const [profit, setProfit] = useState<number>(0);

    const fetchRecentTransaction = async(): Promise<void> => {
        const url = `https://trading-app-backend.onrender.com/api/transactions/${localStorage.getItem("transactionId")}`;

        await axios.get(url)
        .then(response => {
            console.log(response)
            setProfit(response.data.data.attributes.profit)
        })
        .catch(errors => console.log(errors))
    }

    useEffect(() => {
        fetchRecentTransaction();
    }, [])


    return <div className='flex flex-col justify-center items-center z-50 bg-black bg-opacity-70 fixed w-screen h-screen'>
        <div className="w-[500px] h-96 border-2 border-dashed rounded-xl justify-between items-center flex flex-col p-9">
            <h1 className="text-3xl text-white font-bold">
                TRANSACTION CLOSED
            </h1>
            <h1 className="text-2xl text-white">
                You have {props.didBuy? "bought" : "sold"} {props.share} {props.share > 1? "shares" : "share"} {props.ticker} with a {profit > 0? "profit" : "loss"} of ${profit}.
            </h1>

            <button onClick={props.exitMethodFunction} className="text-sky-500 text-xl underline">Close</button>
        </div>

    </div>
}
