import axios from 'axios';
import { useState } from 'react';
import './App.css';
function App() {
  // const OTP_GEN = ;
  const [AN, setAN] = useState({});
  const [userVerifyData, setUserVerifyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isANloaded, setisANloaded] = useState(false);
  const [isANformShow, setisAnFormShow] = useState(true);
  const [generatedOTP, setGeneratedOTP] = useState(Math.floor(Math.random() * 3000) + 1111);
  const [isOTPsent, setIsOTPsend] = useState(false);
  const [isUserVerified, setIsUserVerified] = useState(false);

  const verifyApplicationNumber = async (e) => {
    e.preventDefault();
    if (AN.applicationnumber === undefined || AN.username === undefined) {
      alert("Kindly fill the form!😢");
      return;
    }
    // axios get request

    try {
      setIsLoading(true);
      setisANloaded(false);
      const { data } = await axios.get(`https://soaverifierbackend-apju.vercel.app/verify/${AN.applicationnumber}/${AN.username}`);
      setUserVerifyData(data);
      console.log(data)
      setisANloaded(true);
      setIsLoading(false);
      if (data.isVerified) {
        setisAnFormShow(false);
      }
    } catch (error) {
      console.log(error);
    }



  }



  const sendOTP = async () => {
    console.log(generatedOTP);
    try {
      const { data } = await axios.get(`https://soaverifierbackend-apju.vercel.app/sendotp/${AN.email}/${generatedOTP}`)
      if (data.isSent) {
        setIsOTPsend(true);
      } else {
        alert("OTP send error! Kindly retry or contact admins.");
      }
    } catch (error) {

    }
  }

  const verifyOTP = () => {
    if (!isOTPsent) {
      alert("You can't because OTP did not send to you!");
      return;
    }

    if (parseInt(AN.otp) === generatedOTP) {
      setIsUserVerified(true);
      // post request to excel file
      const scriptURL = 'https://script.google.com/macros/s/AKfycbyJwnhOYtczQSdytJUg-ejYAMT3F5tdbJAkUCEVhOhM1DdN2iB3pbfzxK_r4j-3g0C7pQ/exec'
      const formData = new FormData();
      formData.append('NAME', AN.username);
      formData.append('EMAIL', AN.email);
      formData.append('APPLICATION ID', AN.applicationnumber);
      formData.append('PHONE NUMBER', AN.number);

      fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => alert("Thanks, Successfully Submitted."))
        .catch(error => console.error('Error!', error.message));
    } else {
      alert("Incorrect OTP ❌");
      console.log("G OTP: " + AN.otp + "E OTP: " + generatedOTP)
      return;
    }
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setAN(values => ({ ...values, [name]: value }))
    console.log(AN);
  }
  return <>
    <div className='container'>
      <div className='verifySymbolContainer'>
        {
          isUserVerified ? <img className='verifySymbol' src='/green_shield.png' alt='gree shield'></img> : <img className='verifySymbol' src='/red_shield.png' alt='red shield'></img>
        }
      </div>
      <div className='heading'>
        <h2>SOA STUDENT VERIFIER 🛡️</h2>
      </div>


      {
        !isUserVerified ? <div>
          {
            isANformShow ? <form>
              <label className='form-label'>Application Number:</label>
              <input onChange={handleChange} name='applicationnumber' value={AN.applicationnumber || ""} type="number" className='form-control' placeholder='Enter your application number' required={true}></input>
              <label className='form-label'>Your Full Name: </label>
              <input onChange={handleChange} name='username' value={AN.username || ""} type="text" className='form-control' placeholder='Enter your full name..' required={true}></input>
              <div class="form-text">⚠️ Enter your full name carefully! (exact as certificate)</div>
              <br></br>
              <label className='form-label'>Whatsapp Number: </label>
              <input onChange={handleChange} name='number' value={AN.number || ""} type="number" className='form-control' placeholder='Whatsapp number..' required={true}></input>
              <div className='submitButton'>
                <button onClick={(e) => verifyApplicationNumber(e)} className='btn btn-primary'>Verify</button>
              </div>
            </form> : <div>You are a verified student ✅</div>
          }


          {
            isLoading ? <div class="d-flex align-items-center">
              <strong>Loading...</strong>
              <div class="spinner-border ms-auto text-danger" role="status" aria-hidden="true"></div>
            </div> : null
          }

          {
            !isANloaded ? null : <div>
              {
                userVerifyData.isVerified ? <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>STUDENT NAME</th>
                      <th>PERCENTILE</th>
                      <th>COURSE</th>
                    </tr>

                  </thead>
                  <tbody>
                    <tr>
                      <td>{userVerifyData.userName}</td>
                      <td>{userVerifyData.userPercentile}</td>
                      <td>{userVerifyData.userCourse}</td>
                    </tr>
                  </tbody>
                </table> : <div>Wrong details entered ❌</div>
              }

              {
                isANloaded && userVerifyData.isVerified ? <div>
                  <label className='form-label'>Email Address:</label>
                  <input onChange={handleChange} name='email' value={AN.email || ""} type="email" className='form-control' placeholder='example@gmail.com' required={true}></input>
                  {
                    isOTPsent ? <div>OTP has been sent to your Mail Box! ✅</div> : <button onClick={() => sendOTP()} className='btn btn-danger'>Send OTP</button>
                  }

                  <br></br>
                  <label className='form-label'>OTP: </label>
                  <input onChange={handleChange} name='otp' value={AN.otp || ""} type="number" className='form-control' placeholder='Enter OTP..' required={true}></input>

                  <div class="form-text">⚠️ Enter OTP carefully!</div>
                  <div className='submitButton'>
                    {
                      isOTPsent ? <button onClick={(e) => verifyOTP(e)} className='btn btn-success'>Verify OTP</button> : null
                    }

                  </div>
                </div> : null
              }

            </div>
          }
        </div> : <div className='verifyMsg'>THANKS💖 , YOU ARE DONE! WE WILL CONTACT YOU!</div>
      }



    </div>
  </>;
}

export default App;
