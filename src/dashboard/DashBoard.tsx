import { useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { Link } from 'react-router-dom';
import { CategoryScale } from "chart.js/auto";
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";
import { Confirmation } from './components/Confirmation';
import TraderProfile from '../admin_dashboard/components/TraderProfile';

export default function DashBoard(): JSX.Element {

    const [userName, setUserName] = useState<string>("");
    const [newsArray, setNewsArray] = useState<object[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [lastPrice, setLastPrice] = useState<number>(0);
    const [latestPrice, setLatestPrice] = useState<number>(0);
    const [timeStamp, setTimeStamp] = useState<number>(0);
    const [volume, setVolume] = useState<number>(0);
    const [portfolioArray, setPortfolioArray] = useState<object[]>([]);
    const [isBuy, setIsBuy] = useState<boolean>(false);
    const [isSell, setIsSell] = useState<boolean>(false);
    const [ticker, setTicker] = useState<string>("");
    const [companyName, setCompanyName] = useState<string>("");
    const tickerArray: string[] = ["STAA", "KVUE", "JNJ", "MSFT", "NVDA", "BAC", "AAPL", "INTC", "PLTR", "AMZN", "PFE", "META", "LCID", "AIG", "WBD"];
    const [enterModal, setEnterModal] = useState<boolean>(false);
    const [rowDataArray, setRowDataArray] = useState<object[]>([]);
    const [share, setShare] = useState<string>("1");
    const [showPortfolio, setShowPortfolio] = useState<boolean>(false);
    const [approved, setApproved] = useState<boolean>(false);
    const [profit, setProfit] = useState<number>(0);
    const [percent, setPercent] = useState<number>(0);

    const fetchTickerNews = async (stockSymbol: string): Promise<void> => {
        const url: string = `https://api.polygon.io/v2/reference/news?ticker=${stockSymbol}&apiKey=8MXftqYJltJ10de075dDr4h8EXwmeRys`;

        await axios.get(url)
        .then((response: {[key: string]: any}) => {
            if (response.data.results !== undefined) {
                const result = response.data.results;
                result.map((element: object): void => {
                    setNewsArray(newsArray => [...newsArray, element])
                })

            }
        })
        .catch((errors: object): void => console.log(errors));
    }

    const updateShare = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setShare(event.target.value);
    }

    Chart.register(CategoryScale);

    useEffect(() => {

        const socket: WebSocket = new WebSocket(`wss://ws.finnhub.io?token=cjcafghr01qnfft1n2hgcjcafghr01qnfft1n2i0`);


        socket.addEventListener('open', (): void => {
            if (ticker !== "") {
                //socket.send(JSON.stringify({'type':'subscribe', 'symbol': ticker}));
                socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}));
            }
        })

        socket.addEventListener('message', (event: MessageEvent<object>): void => {
        const stringData: unknown = event.data as unknown;
        const converted: string = stringData as string;
        const priceData: {[key: string]: any} = JSON.parse(converted);
        const timeData = priceData['data'];
        if (timeData !== undefined) {
            timeData.map((elements: {[key: string]: any}): void => {
            //console.log(elements);
            setRowDataArray([...rowDataArray, elements]);
            setLatestPrice(elements['p']);
            setTimeStamp(elements['t']);
            //setTicker(elements['s']);
            setVolume(elements['v']);
            })
        }
    });

    }, [ticker, timeStamp])



    const data = {
      labels: rowDataArray.map((element: { [key: string]: any}) => {
        const date = new Date(element['t']);
        const hours = date.getHours();
        const minutes = date.getMinutes() < 10? `0${date.getMinutes()}` : date.getMinutes();
        return `${hours}:${minutes}`;
      }),
      datasets: [
        {
          label: ticker,
          data: rowDataArray.map((element: { [key: string]: any}) => {
            return element['p']
          })
        }
      ]
    }

    const fetchTrader = async (): Promise<void> => {
        const url: string = `https://trading-app-backend.onrender.com/api/traders/${localStorage.getItem("traderId")}`;

        await axios.get(url)
        .then((response: {[key: string]: any}) => {
            setUserName(response.data.data.attributes.username);
            setApproved(response.data.data.attributes.approved);
        })
        .catch((errors: object): void => console.log(errors));
    }

    const fetchPortfolio = async(): Promise<void> => {
        const url = `https://trading-app-backend.onrender.com/api/traders/${localStorage.getItem("traderId")}`;

        await axios.get(url)
        .then(response => {
            const result = response.data.included;
            result.map((element: {[key: string]: any}): void => {
                setPortfolioArray(portfolioArray => [...portfolioArray, element])
            })
        })
        .catch((errors: object): void => console.log(errors));
    }

    const generateTIckerToken = async(stockName: string): Promise<void> => {
        const url = `https://trading-app-backend.onrender.com/api/ticker_tokens?ticker[symbol]=${stockName}`;

        await axios.post(url)
        .then((response: AxiosResponse<any, any>): void => {
            localStorage.setItem("tickerToken", response.data.ticker_token)
        })
        .catch((errors: object): void => console.log(errors));
    }

    const fetchTickerDetails = async (tickerSymbol: string): Promise<void> => {
        const url = `https://api.polygon.io/v3/reference/tickers/${tickerSymbol}?apiKey=8MXftqYJltJ10de075dDr4h8EXwmeRys`;

        await axios.get(url)
        .then((response: AxiosResponse<any, any>): void => {
            setTicker(response.data.results.ticker);
            setCompanyName(response.data.results.name);
        })
        .catch((errors: object) => console.log(errors));
    }

    const fetchLatestBalance = async (): Promise<void> => {
        const url: string = `https://trading-app-backend.onrender.com/api/traders/${localStorage.getItem("traderId")}`;

        await axios.get(url)
        .then((response: {[key: string]: any}): void => {
            setBalance(response.data.data.attributes.balance);
        })
        .catch((errors: object): void => console.log(errors));
    }

    const transact = async (price: number): Promise<void> => {
        const url = `https://trading-app-backend.onrender.com/api/tickers/${localStorage.getItem("tickerId")}`;

        await axios.put(url, {
            last_price: price,
            time_stamp: timeStamp.toString(),
            volume: volume,
            share: parseInt(share)
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("traderToken")
            }
        }).then((response: AxiosResponse<any, any>): void => {
            console.log(response);
            setLastPrice(response.data.data.attributes.last_price);
        }).catch((errors: object): void => console.log(errors))
    }

    const updateLatestPrice = async(price: number): Promise<void> => {
        const url = `https://trading-app-backend.onrender.com/api/tickers/${localStorage.getItem("tickerId")}`;

        await axios.put(url, {
            latest_price: price,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("traderToken")
            }
        }).then((response: AxiosResponse<any, any>): void => {
            console.log(response);
        }).catch((errors: object): void => console.log(errors))
    }

    const acquireStock = async (stockName: string): Promise<void> => {
        const url = "https://trading-app-backend.onrender.com/api/tickers";

        await axios.post(url, {
            symbol: stockName,
            time_stamp: timeStamp.toString(),
            volume: volume,
            share: parseInt(share)
        },{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${localStorage.getItem("traderToken")}`
            }
        }).then((response: AxiosResponse<any, any>): void => {
            localStorage.setItem("tickerId", response.data.data.id);

        }).catch((error: object): void => console.log(error))
    }

    const generateTransactionHistory = async(mode: "buy" | "sell"): Promise<void> => {
        const url = "https://trading-app-backend.onrender.com/api/transactions";

        await axios.post(url, {
            stock: ticker,
            action: mode
        },{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${localStorage.getItem("tickerToken")}`
            }
        }).then(response => {
            console.log(response);
            setPercent(response.data.data.attributes.percent);
            localStorage.setItem("transactionId", response.data.data.id)
        }).catch(errors => console.log(errors))
    }

    const endTransaction = (): void => {
        if (isBuy) {
            setIsBuy(!isBuy);
        }
        if (isSell) {
            setIsSell(!isSell);
        }
    }

    useEffect(() => {

        fetchTrader();
    }, [])

    useEffect(() => {
        if (ticker !== "") {
            fetchTickerNews(ticker);
            fetchTickerDetails(ticker);
        }
    }, [ticker])

    useEffect(() => {
        if (isBuy || isSell) {
            updateLatestPrice(latestPrice);
        }
    }, [isBuy, isSell, latestPrice])

    useEffect(() => {
        fetchLatestBalance();
    })

  return (
    <>
    {enterModal && <Confirmation didBuy={isBuy} ticker={ticker} exitMethodFunction={() => setEnterModal(!enterModal)} share={share}/>}
    <div className='flex flex-col w-screen h-screen bg-slate-800'>
        <nav className='flex flex-row justify-between items-center w-screen h-14 bg-yellow-500 p-4'>
            <div>
                <h1 className='text-3xl font-bold'>
                    Tradeable
                </h1>
            </div>

            <div className='flex flex-row w-[300px] justify-between items-center mr-6'>
                <button
                onClick={() => {
                    setShowPortfolio(!showPortfolio);
                }} className='text-xl font-semibold text-underlined'>
                    Portfolio
                </button>
            </div>

            <div className='flex flex-row justify-between'>
                <h1 className='mr-4 text-xl font-semibold'>
                    {userName}
                </h1>
                <h1 className='text-xl font-semibold'>
                    {balance}
                </h1>
            </div>
        </nav>


            <div className='flex flex-row w-screen h-16 bg-black justify-around items-center scroll-smooth overflow-x-scroll'>
                {tickerArray.map((ticker: string, index: number) => {
                    return <div className='mr-3' key={index}>
                            <button className='text-white text-2xl'
                            onClick={() => {
                                setTicker(ticker);
                                acquireStock(ticker);
                            }}>{ticker}</button>
                        </div>
                })}
            </div>

        <div className='flex flex-row justify-between items-center w-screen h-[550px]'>
        {showPortfolio && <div className='w-screen h-full'>
                            <TraderProfile isAdmin={false}/>
                        </div>}
            <div className='flex flex-col w-1/5 bg-slate-800 h-[550px] overflow-y-scroll justify-center overscroll-none'>
                {newsArray.map((element: {[key: string]: any}) => {
                    return <div className='flex flex-col items-center p-4 mt-6 flex-wrap'>
                        <img
                            src={element.image_url}
                            className='w-full mb-5'
                            alt="article" />
                        <Link
                            to={element['article_url']}
                            className='text-white flex-wrap text-justify mb-4' target='blank'>
                                {element.title}
                        </Link>
                    </div>
                })}
            </div>
            <div className='flex flex-col w-3/5 h-[550px] overflow-x-auto p-4 justify-center items-center bg-slate-900'>

                <Line data={data} />
            </div>
            <div className='flex flex-col w-1/5 bg-slate-800 h-[550px] items-center'>
                {ticker !== ""? <div className='flex flex-col items-center h-[300px] w-full p-4 flex-wrap'>
                    <h1 className='text-xl text-white mb-4'>
                        {companyName}
                    </h1>

                    <div className='flex flex-row justify-between w-full'>
                        <h1 className='text-xl text-gray-500'>
                            Symbol:
                        </h1>
                        <h1 className='text-xl text-white'>
                            {ticker}
                        </h1>
                    </div>

                    <div className='flex flex-row justify-between w-full mb-4'>
                        <h1 className='text-xl text-gray-500'>
                            Price:
                            </h1>
                        <h1 className='text-xl text-white'>
                            {latestPrice.toFixed(2)}
                        </h1>
                    </div>

                    <div className='flex flex-row justify-between w-full mb-4'>
                        <h1 className='text-xl text-gray-500'>
                            Volume:
                        </h1>
                        <h1 className='text-xl text-white'>
                            {volume}
                        </h1>
                    </div>

                    {approved && <div className='flex flex-row justify-between w-full mb-4'>
                        <h1 className='text-xl text-gray-500'>
                            Enter share:
                        </h1>
                        {isBuy || isSell?
                        <h1 className='text-xl text-white'>
                            {share}
                        </h1>

                        :

                        <input
                            onChange={updateShare}
                            type='number'
                            min={1}
                            className='w-10 pl-2 text-lg bg-slate-500 text-white outline-none'
                            defaultValue={share}/>}
                    </div>}
                    {(isBuy || isSell) &&
                    <h1 className='text-xl'>
                        {latestPrice - lastPrice > 0?
                            <h1 className='text-green-500 font-bold'>
                                PROFIT: {(latestPrice - lastPrice).toFixed(2)}
                            </h1>

                            :

                            <h1 className='text-red-500 font-bold'>
                                LOSS: {(latestPrice - lastPrice).toFixed(2)}
                            </h1>}
                    </h1>}

                    {volume === 0 &&
                    <div className='flex flex-row justify-center items-center w-full bg-gray-500 rounded-lg'>
                            <h1 className='text-gray-300'>
                                MARKET IS CLOSED.
                            </h1>
                    </div>}
                </div>

                :
                <div className='mb-6'>
                    <h1 className='text-xl text-white'>Select a stock</h1>
                </div>}


                {!approved &&
                <div className='w-full bg-gray-500 mb-6'>
                    <h1 className='text-md text-gray-300 text-center'>
                        You cannot transact at the moment. Wait for the admin's approval.
                    </h1>
                </div>}

                {(isBuy || isSell)?
                    <button
                        className='w-44 h-11 bg-gray-500 text-xl text-white align-middle text-center rounded-xl mb-6'
                        onClick={() => {
                            endTransaction();
                            setEnterModal(!enterModal);
                            isBuy? generateTransactionHistory("buy") : generateTransactionHistory("sell")
                        }}>
                            Close Position
                        </button>

                        :

                        <div className='flex flex-col justify-between mb-6'>
                            <button onClick={() => {
                                transact(latestPrice);
                                setIsBuy(!isBuy);
                                generateTIckerToken(ticker);
                            }
                            } className='h-11 w-44 bg-green-600 text-white text-xl mb-4 rounded-xl disabled:bg-gray-500 disabled:text-gray-400' disabled={(!approved || volume === 0)? true : false}>BUY</button>
                            <button
                                onClick={() => {
                                transact(latestPrice);
                                setIsSell(!isSell);
                                generateTIckerToken(ticker);
                            }
                            }   className='h-11 w-44 bg-red-600 text-white text-xl rounded-xl disabled:bg-gray-500 disabled:text-gray-400'
                                disabled={(!approved || volume === 0)? true : false}>
                                SELL
                            </button>
                </div>}
            </div>
        </div>
    </div>
    </>
  )
}
