import React from 'react'
import * as yup from 'yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios, { AxiosResponse } from 'axios'
import { NavigateFunction, useNavigate } from 'react-router-dom'

interface RegisterProfile {
  userName:string,
  firstName:string,
  lastName:string
  email:string,
  country:string,
  password: string,
  passwordConfirmation: string
}

export default function Register() {
  const [profile, setProfile] = useState<RegisterProfile>({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    password: '',
    passwordConfirmation: ''
  })

  const navigate: NavigateFunction = useNavigate();

  const validation = yup.object().shape({
    userName: yup.string().required("Please enter your username"),
    firstName: yup.string().required("Please enter your first name"),
    lastName: yup.string().required("Please enter your last name"),
    email: yup.string().email("Invalid email format").required("Please enter your email"),
    country: yup.string().required(),
    password: yup.string().required("Please enter password").min(8).max(20),
    passwordConfirmation: yup.string().required("Please confirm your password").oneOf(["password"], "Passwords do not match").min(8).max(20)
  })

  const { register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(validation)
  })

  const updateUserName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setProfile({...profile, userName: event.target.value});
  }

  const updateFirstName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setProfile({...profile, firstName: event.target.value});
  }

  const updateLastName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setProfile({...profile, lastName: event.target.value});
  }

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setProfile({...profile, email: event.target.value});
  }

  const updateCountry = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setProfile({...profile, country: event.target.value});
  }

  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setProfile({...profile, password: event.target.value});
  }

  const updateConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setProfile({...profile, passwordConfirmation: event.target.value});
  }

  const registerData = async (data: RegisterProfile): Promise<void> => {
    await axios.post("http://127.0.0.1:3000/api/traders", {
      username: data.userName,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      country: data.country,
      password: data.password,
      password_confirmation: data.passwordConfirmation
    },{
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("adminToken")

      }
    }).then((response: AxiosResponse<any, any>) => {
      console.log(response);
      navigate("/modal");
    }).catch((error: any) => {
      console.error(error);
    })
  }

  return (
    <div className='flex flex-col justify-center items-center w-screen h-screen bg-slate-800 text-lg'>
      <form method='POST' onSubmit={handleSubmit(registerData)} className='flex flex-col w-[700px] h-[500px] border-2 justify-center items-center rounded-xl'>
        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='userName-input' className='text-2xl text-gray-400'>Username:</label>
          <input id='userName-input' {...register("userName")} className='w-[300px] h-11 outline-none rounded-xl p-5' onChange={updateUserName} />
        </div>
        <div className='mb-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.userName?.message}</span>
        </div>

        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='firstName-input' className='text-2xl text-gray-400'>First Name:</label>
          <input id='firstName-input' {...register("firstName")} className='w-[300px] h-11 outline-none rounded-xl p-5' onChange={updateFirstName} />
        </div>
        <div className='mb-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.firstName?.message}</span>
        </div>

        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='lastName-input' className='text-2xl text-gray-400'>Last Name:</label>
          <input id='lastName-input' {...register("lastName")} className='w-[300px] h-11 outline-none rounded-xl p-5' onChange={updateLastName} />
        </div>
        <div className='mb-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.lastName?.message}</span>
        </div>

        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='email-input' className='text-2xl text-gray-400'>Email:</label>
          <input id='email-input' {...register("email")} className='w-[300px] h-11 outline-none rounded-xl p-5' onChange={updateEmail} />
        </div>
        <div className='mb-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.email?.message}</span>
        </div>

        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='country-input' className='text-2xl text-gray-400'>Country:</label>
        <select id="country-input" {...register("country")} onChange={updateCountry} className='outline-none w-[300px] h-11 rounded-xl p-2' defaultValue="Afghanistan">
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
          </select>
        </div>
        <div className='mb-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.country?.message}</span>
        </div>

        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='password-input' className='text-2xl text-gray-400'>Password:</label>
          <input id='password-input' type='password' {...register("password")} className='w-[300px] h-11 outline-none rounded-xl p-5' onChange={updatePassword} />
        </div>
        <div className='mb-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.password?.message}</span>
        </div>

        <div className='flex flex-row justify-between items-center w-[600px]'>
          <label htmlFor='confirmPassword-input' className='text-2xl text-gray-400'>Confirm Password:</label>
          <input id='confirmPassword-input' {...register("passwordConfirmation")} className='w-[300px] h-11 outline-none rounded-xl p-5' onChange={updateConfirmPassword} type='password' />
        </div>
        <div className='mb-3 flex flex-row justify-end w-[600px]'>
          <span className='text-lg text-gray-500'>{errors.passwordConfirmation?.message}</span>
        </div>

        <button type='submit' className='text-xl bg-yellow-300 w-[500px] h-11 rounded-xl mt-5'>
            Register
          </button>
      </form>
    </div>
  )
}
