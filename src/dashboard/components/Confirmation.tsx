export const Confirmation = (props: {[key: string]: any}): JSX.Element => {

    return <div className='flex flex-col justify-center items-center z-50 bg-black bg-opacity-70 fixed w-screen h-screen'>
        <div className="w-[500px] h-96 border-2 border-dashed rounded-xl justify-between items-center flex flex-col p-9">
            <h1 className="text-3xl text-white font-bold">
                TRANSACTION CLOSED
            </h1>
            <h1 className="text-2xl text-white">
                You have {props.didBuy? "bought" : "sold"} {props.ticker} with a {props.latestPrice - props.lastPrice > 0? "profit" : "loss"} of {props.latestPrice - props.lastPrice}.
            </h1>

            <button onClick={props.exitMethodFunction} className="text-sky-500 text-xl underline">Close</button>
        </div>

    </div>
}
