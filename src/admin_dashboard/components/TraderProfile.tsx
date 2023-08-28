import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as yup from 'yup'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Transactions from '../../dashboard/components/Transactions';

interface Trader {
  userName: string,
  firstName: string,
  lastName: string,
  email: string,
  country: string,
  approved?: boolean,
  balance: number
}

export default function TraderProfile(props: {[key: string]: any}) {
  const [traderProfile, setTraderProfile] = useState<Trader>({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    balance: 0
  })

  const [stocks, setStocks] = useState<object[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [tickerId, setTickerId] = useState<number>(0);
  const [showTransaction, setShowTransaction] = useState<boolean>(false);

  const validation = yup.object().shape({
    userName: yup.string().required("Please enter your username"),
    firstName: yup.string().required("Please enter your first name"),
    lastName: yup.string().required("Please enter your last name"),
    email: yup.string().email("Please enter valid email").required("Please enter your email"),
    country: yup.string().required("Please enter your country"),
    balance: yup.number().required("Please enter balanced"),
  })

  const {register} = useForm({
    resolver: yupResolver(validation)
  })

  const fetchTrader = async (): Promise<void> => {
    const url = `https://trading-app-backend.onrender.com/api/traders/${localStorage.getItem("traderId")}`;

    await axios.get(url).then(response => {
      const mainData: {[key: string]: any} = response.data.data.attributes;
      const portfolio = response.data.included;
      console.log(portfolio);
      setTraderProfile({...traderProfile, userName: mainData.username, firstName: mainData.first_name, lastName: mainData.last_name, email: mainData.email, country: mainData.country, balance: mainData.balance, approved: mainData.approved});
      portfolio.map((element: {[key: string]: any}) => {
        setStocks(stocks => [...stocks, element]);
      })
    }).catch(errors => console.log(errors))
  }

  //console.log(stocks);

  const approveTrader = async(): Promise<void> => {
    const url = `http://127.0.0.1:3000/api/traders/${localStorage.getItem("traderId")}`;

    await axios.put(url, {
      approved: true
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("adminToken")
      }
    }).then(response => {
      //console.log(response)
      window.location.reload();
    }).catch(errors => console.log(errors))
  }

  const updateUserName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTraderProfile({...traderProfile, userName: event.target.value});
  }

  const updateFirstName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTraderProfile({...traderProfile, firstName: event.target.value});
  }

  const updateLastName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTraderProfile({...traderProfile, lastName: event.target.value});
  }

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTraderProfile({...traderProfile, email: event.target.value});
  }

  const updateCountry = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setTraderProfile({...traderProfile, country: event.target.value});
  }

  const editTrader = async(data: Trader): Promise<void> => {
    const url = `http://127.0.0.1:3000/api/traders/${localStorage.getItem("traderId")}`;

    await axios.put(url, {
      username: data.userName,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      country: data.country
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("adminToken")
      }
    })
    .then(response => {
      //console.log(response);
      window.location.reload();
    })
    .catch(errors => console.log(errors))
  }

  useEffect(() => {
    fetchTrader();
  }, []);

  return (
    <div className='w-screen h-screen flex flex-row justify-between items-center bg-slate-800'>
        <div className='flex flex-col w-1/2 border-2 h-full border-dashed border-gray-500 rounded-xl'>
          <div className='flex flex-row w-full h-16 items-center justify-between p-6'>
            <h1 className='text-2xl text-white'>Username:</h1>
            {isEdit? <input {...register("userName")} className='w-[350px] h-11 text-xl p-4 text-right rounded-xl' onChange={updateUserName} defaultValue={traderProfile.userName}/> : <h1 className='text-2xl text-white'>{traderProfile.userName}</h1>}
          </div>

          <div className='flex flex-row w-full h-16 items-center justify-between p-6'>
            <h1 className='text-2xl text-white'>First Name:</h1>
            {isEdit? <input {...register("firstName")} className='w-[350px] h-11 text-xl p-4 text-right rounded-xl'
            onChange={updateFirstName} defaultValue={traderProfile.firstName}/> : <h1 className='text-2xl text-white'>{traderProfile.firstName}</h1>}
          </div>

          <div className='flex flex-row w-full h-16 items-center justify-between p-6'>
            <h1 className='text-2xl text-white'>Last Name:</h1>
            {isEdit? <input {...register("lastName")} className='w-[350px] h-11 text-xl p-4 text-right rounded-xl' onChange={updateLastName} defaultValue={traderProfile.lastName}/> : <h1 className='text-2xl text-white'>{traderProfile.lastName}</h1>}
          </div>

          <div className='flex flex-row w-full h-16 items-center justify-between p-6'>
            <h1 className='text-2xl text-white'>Email:</h1>
            {isEdit? <input {...register("email")} className='w-[350px] h-11 text-xl p-4 text-right rounded-xl' onChange={updateEmail} defaultValue={traderProfile.email}/> : <h1 className='text-2xl text-white'>{traderProfile.email}</h1>}
          </div>

          <div className='flex flex-row w-full h-16 items-center justify-between p-6'>
            <h1 className='text-2xl text-white'>Country:</h1>
            {isEdit? <select id="country-input" {...register("country")} onChange={updateCountry} className='outline-none w-[350px] text-right text-xl h-11 rounded-xl p-2' defaultValue="Afghanistan">
            <option value="Afghanistan">Afghanistan</option>
            <option value="Aland Islands">Aland Islands</option>
            <option value="Albania">Albania</option>
            <option value="Algeria">Algeria</option>
            <option value="American Samoa">American Samoa</option>
            <option value="Andorra">Andorra</option>
            <option value="Angola">Angola</option>
            <option value="Anguilla">Anguilla</option>
            <option value="Antarctica">Antarctica</option>
            <option value="Antigua and Barbuda">Antigua and Barbuda</option>
            <option value="Argentina">Argentina</option>
            <option value="Armenia">Armenia</option>
            <option value="Aruba">Aruba</option>
            <option value="Australia">Australia</option>
            <option value="Austria">Austria</option>
            <option value="Azerbaijan">Azerbaijan</option>
            <option value="Bahamas">Bahamas</option>
            <option value="Bahrain">Bahrain</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Barbados">Barbados</option>
            <option value="Belarus">Belarus</option>
            <option value="Belgium">Belgium</option>
            <option value="Belize">Belize</option>
            <option value="Benin">Benin</option>
            <option value="Bermuda">Bermuda</option>
            <option value="Bhutan">Bhutan</option>
            <option value="Bolivia">Bolivia</option>
            <option value="Bonaire, Sint Eustatius and Saba">Bonaire, Sint Eustatius and Saba</option>
            <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
            <option value="Botswana">Botswana</option>
            <option value="Bouvet Island">Bouvet Island</option>
            <option value="Brazil">Brazil</option>
            <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
            <option value="Brunei Darussalam">Brunei Darussalam</option>
            <option value="Bulgaria">Bulgaria</option>
            <option value="Burkina Faso">Burkina Faso</option>
            <option value="Burundi">Burundi</option>
            <option value="Cambodia">Cambodia</option>
            <option value="Cameroon">Cameroon</option>
            <option value="Canada">Canada</option>
            <option value="Cape Verde">Cape Verde</option>
            <option value="Cayman Islands">Cayman Islands</option>
            <option value="Central African Republic">Central African Republic</option>
            <option value="Chad">Chad</option>
            <option value="Chile">Chile</option>
            <option value="China">China</option>
            <option value="Christmas Island">Christmas Island</option>
            <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
            <option value="Colombia">Colombia</option>
            <option value="Comoros">Comoros</option>
            <option value="Congo">Congo</option>
            <option value="Congo, Democratic Republic of the Congo">Congo, Democratic Republic of the Congo</option>
            <option value="Cook Islands">Cook Islands</option>
            <option value="Costa Rica">Costa Rica</option>
            <option value="Cote D'Ivoire">Cote D'Ivoire</option>
            <option value="Croatia">Croatia</option>
            <option value="Cuba">Cuba</option>
            <option value="Curacao">Curacao</option>
            <option value="Cyprus">Cyprus</option>
            <option value="Czech Republic">Czech Republic</option>
            <option value="Denmark">Denmark</option>
            <option value="Djibouti">Djibouti</option>
            <option value="Dominica">Dominica</option>
            <option value="Dominican Republic">Dominican Republic</option>
            <option value="Ecuador">Ecuador</option>
            <option value="Egypt">Egypt</option>
            <option value="El Salvador">El Salvador</option>
            <option value="Equatorial Guinea">Equatorial Guinea</option>
            <option value="Eritrea">Eritrea</option>
            <option value="Estonia">Estonia</option>
            <option value="Ethiopia">Ethiopia</option>
            <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
            <option value="Faroe Islands">Faroe Islands</option>
            <option value="Fiji">Fiji</option>
            <option value="Finland">Finland</option>
            <option value="France">France</option>
            <option value="French Guiana">French Guiana</option>
            <option value="French Polynesia">French Polynesia</option>
            <option value="French Southern Territories">French Southern Territories</option>
            <option value="Gabon">Gabon</option>
            <option value="Gambia">Gambia</option>
            <option value="Georgia">Georgia</option>
            <option value="Germany">Germany</option>
            <option value="Ghana">Ghana</option>
            <option value="Gibraltar">Gibraltar</option>
            <option value="Greece">Greece</option>
            <option value="Greenland">Greenland</option>
            <option value="Grenada">Grenada</option>
            <option value="Guadeloupe">Guadeloupe</option>
            <option value="Guam">Guam</option>
            <option value="Guatemala">Guatemala</option>
            <option value="Guernsey">Guernsey</option>
            <option value="Guinea">Guinea</option>
            <option value="Guinea-Bissau">Guinea-Bissau</option>
            <option value="Guyana">Guyana</option>
            <option value="Haiti">Haiti</option>
            <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
            <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
            <option value="Honduras">Honduras</option>
            <option value="Hong Kong">Hong Kong</option>
            <option value="Hungary">Hungary</option>
            <option value="Iceland">Iceland</option>
            <option value="India">India</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
            <option value="Iraq">Iraq</option>
            <option value="Ireland">Ireland</option>
            <option value="Isle of Man">Isle of Man</option>
            <option value="Israel">Israel</option>
            <option value="Italy">Italy</option>
            <option value="Jamaica">Jamaica</option>
            <option value="Japan">Japan</option>
            <option value="Jersey">Jersey</option>
            <option value="Jordan">Jordan</option>
            <option value="Kazakhstan">Kazakhstan</option>
            <option value="Kenya">Kenya</option>
            <option value="Kiribati">Kiribati</option>
            <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
            <option value="Korea, Republic of">Korea, Republic of</option>
            <option value="Kosovo">Kosovo</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Kyrgyzstan">Kyrgyzstan</option>
            <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
            <option value="Latvia">Latvia</option>
            <option value="Lebanon">Lebanon</option>
            <option value="Lesotho">Lesotho</option>
            <option value="Liberia">Liberia</option>
            <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
            <option value="Liechtenstein">Liechtenstein</option>
            <option value="Lithuania">Lithuania</option>
            <option value="Luxembourg">Luxembourg</option>
            <option value="Macao">Macao</option>
            <option value="Macedonia, the Former Yugoslav Republic of">Macedonia, the Former Yugoslav Republic of</option>
            <option value="Madagascar">Madagascar</option>
            <option value="Malawi">Malawi</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Maldives">Maldives</option>
            <option value="Mali">Mali</option>
            <option value="Malta">Malta</option>
            <option value="Marshall Islands">Marshall Islands</option>
            <option value="Martinique">Martinique</option>
            <option value="Mauritania">Mauritania</option>
            <option value="Mauritius">Mauritius</option>
            <option value="Mayotte">Mayotte</option>
            <option value="Mexico">Mexico</option>
            <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
            <option value="Moldova, Republic of">Moldova, Republic of</option>
            <option value="Monaco">Monaco</option>
            <option value="Mongolia">Mongolia</option>
            <option value="Montenegro">Montenegro</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Morocco">Morocco</option>
            <option value="Mozambique">Mozambique</option>
            <option value="Myanmar">Myanmar</option>
            <option value="Namibia">Namibia</option>
            <option value="Nauru">Nauru</option>
            <option value="Nepal">Nepal</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Netherlands Antilles">Netherlands Antilles</option>
            <option value="New Caledonia">New Caledonia</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Nicaragua">Nicaragua</option>
            <option value="Niger">Niger</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Niue">Niue</option>
            <option value="Norfolk Island">Norfolk Island</option>
            <option value="Northern Mariana Islands">Northern Mariana Islands</option>
            <option value="Norway">Norway</option>
            <option value="Oman">Oman</option>
            <option value="Pakistan">Pakistan</option>
            <option value="Palau">Palau</option>
            <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
            <option value="Panama">Panama</option>
            <option value="Papua New Guinea">Papua New Guinea</option>
            <option value="Paraguay">Paraguay</option>
            <option value="Peru">Peru</option>
            <option value="Philippines">Philippines</option>
            <option value="Pitcairn">Pitcairn</option>
            <option value="Poland">Poland</option>
            <option value="Portugal">Portugal</option>
            <option value="Puerto Rico">Puerto Rico</option>
            <option value="Qatar">Qatar</option>
            <option value="Reunion">Reunion</option>
            <option value="Romania">Romania</option>
            <option value="Russian Federation">Russian Federation</option>
            <option value="Rwanda">Rwanda</option>
            <option value="Saint Barthelemy">Saint Barthelemy</option>
            <option value="Saint Helena">Saint Helena</option>
            <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
            <option value="Saint Lucia">Saint Lucia</option>
            <option value="Saint Martin">Saint Martin</option>
            <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
            <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
            <option value="Samoa">Samoa</option>
            <option value="San Marino">San Marino</option>
            <option value="Sao Tome and Principe">Sao Tome and Principe</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Senegal">Senegal</option>
            <option value="Serbia">Serbia</option>
            <option value="Serbia and Montenegro">Serbia and Montenegro</option>
            <option value="Seychelles">Seychelles</option>
            <option value="Sierra Leone">Sierra Leone</option>
            <option value="Singapore">Singapore</option>
            <option value="Sint Maarten">Sint Maarten</option>
            <option value="Slovakia">Slovakia</option>
            <option value="Slovenia">Slovenia</option>
            <option value="Solomon Islands">Solomon Islands</option>
            <option value="Somalia">Somalia</option>
            <option value="South Africa">South Africa</option>
            <option value="South Georgia and the South Sandwich Islands">South Georgia and the South Sandwich Islands</option>
            <option value="South Sudan">South Sudan</option>
            <option value="Spain">Spain</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Sudan">Sudan</option>
            <option value="Suriname">Suriname</option>
            <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
            <option value="Swaziland">Swaziland</option>
            <option value="Sweden">Sweden</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Syrian Arab Republic">Syrian Arab Republic</option>
            <option value="Taiwan, Province of China">Taiwan, Province of China</option>
            <option value="Tajikistan">Tajikistan</option>
            <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
            <option value="Thailand">Thailand</option>
            <option value="Timor-Leste">Timor-Leste</option>
            <option value="Togo">Togo</option>
            <option value="Tokelau">Tokelau</option>
            <option value="Tonga">Tonga</option>
            <option value="Trinidad and Tobago">Trinidad and Tobago</option>
            <option value="Tunisia">Tunisia</option>
            <option value="Turkey">Turkey</option>
            <option value="Turkmenistan">Turkmenistan</option>
            <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
            <option value="Tuvalu">Tuvalu</option>
            <option value="Uganda">Uganda</option>
            <option value="Ukraine">Ukraine</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
            <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
            <option value="Uruguay">Uruguay</option>
            <option value="Uzbekistan">Uzbekistan</option>
            <option value="Vanuatu">Vanuatu</option>
            <option value="Venezuela">Venezuela</option>
            <option value="Viet Nam">Viet Nam</option>
            <option value="Virgin Islands, British">Virgin Islands, British</option>
            <option value="Virgin Islands, U.s.">Virgin Islands, U.s.</option>
            <option value="Wallis and Futuna">Wallis and Futuna</option>
            <option value="Western Sahara">Western Sahara</option>
            <option value="Yemen">Yemen</option>
            <option value="Zambia">Zambia</option>
            <option value="Zimbabwe">Zimbabwe</option>
          </select> : <h1 className='text-2xl text-white'>{traderProfile.country}</h1>}
          </div>

          <div className='flex flex-row w-full h-16 items-center justify-between p-6'>
            <h1 className='text-2xl text-white'>Balance:</h1>
            <h1 className='text-2xl text-white'>{traderProfile.balance}</h1>
          </div>

          {props.isAdmin && <div className='flex flex-row w-full h-16 items-center justify-between p-6'>
            <h1 className='text-2xl text-white'>Approved:</h1>
            <h1 className='text-2xl text-white'>{traderProfile.approved? "True" : "False"}</h1>
          </div>}

          {!isEdit? <div className='flex flex-row justify-around items-center'>
                      <button onClick={() => setIsEdit(!isEdit)} className='w-[200px] h-14 self-center bg-gray-500 mt-6 text-2xl rounded-xl mb-6'>Edit Info
                      </button>
                      {(!traderProfile.approved && props.isAdmin) && <button className='w-[200px] h-14 self-center bg-green-700 text-white mt-6 text-2xl rounded-xl mb-6' onClick={approveTrader}>Approve Trader</button>}
                  </div>
          :
          <div className='flex flex-row justify-around items-center mt-6'>
            <button className='w-[200px] h-11 bg-green-500 rounded-xl text-xl' type="submit" onClick={() => editTrader(traderProfile)}>Confirm</button>
            <button className='w-[200px] h-11 bg-red-500 rounded-xl text-xl' onClick={() => setIsEdit(!isEdit)}>Cancel</button>
          </div>}
        </div>
        <div className='flex flex-col w-1/2 h-full border-dashed border-2'>
          <div className='flex flex-col justify-center items-center w-full h-1/2 border-2 border-dashed p-6 rounded-xl border-gray-500 self-start overflow-hidden overflow-y-scroll'>
            {stocks.length > 0? stocks.map((element: {[key: string]: any}, index: number) => {
              return <div key={index} className='bg-sky-500 flex flex-row w-full h-14 mb-6 justify-between items-center p-4 rounded-xl'>
                <h1 className='text-xl'>{element.attributes.symbol}</h1>
                  <button
                onClick={() => {
                  setTickerId(element.id); setShowTransaction(!showTransaction)
                  }
                }>
                    View Transactions
                  </button>
              </div>

            }) : <h1 className='text-2xl text-gray-500'>No stocks at this moment.</h1>}
          </div>
          <div className='flex flex-col justify-center items-center w-full h-1/2 border-2 border-gray-500 border-dashed overflow-hidden overflow-y-scroll'>
            {showTransaction && <Transactions tickerId={tickerId}/>}
          </div>
        </div>
    </div>
  )
}
