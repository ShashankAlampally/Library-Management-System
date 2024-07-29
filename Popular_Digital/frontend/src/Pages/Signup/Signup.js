import { Link, useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import React from 'react'
import { useState } from 'react'
import axios from 'axios'


function Signup() {

    const [data,setData] = useState({
        name:"",
        email:"",
        password:"",
        address : "",
        phone_number : ""
    })
    const [error , setError] = useState("")
    const navigate = useNavigate()
    const handleChange = ({currentTarget:input}) => {
        setData({...data,[input.name]:input.value});
    }
const handleSubmit = (e) =>{
    e.preventDefault()

        
        axios.post('http://shashanks-macbook-air.local:8080/signup',data).then((res)=>{
            console.log(res.message)
            navigate('/login')
        }).catch((error)=>{
            if(error && error.response.status == 400){
                setError(error.response.data.message)
            }
        })
    } 

  return (
    <div className={styles.signup_container}>
        <div className={styles.signup_form_container}>
            <div className={styles.left}>
                <h1>Welcome Back</h1>
                <Link to='/login'>
                    <button type='button' className={styles.white_btn}>
                        Sign in
                    </button>
                </Link>
            </div>
            <div className={styles.right}>
                <form className={styles.form_container} onSubmit={handleSubmit}>
                    <h1>Create Account</h1>
                    <input 
                        type='text' 
                        placeholder='Full Name'
                        name = "name"
                        onChange={handleChange}
                        value={data.name}
                        required
                        className={styles.input}
                    />
                    <input 
                        type='email' 
                        placeholder='Email'
                        name = "email"
                        onChange={handleChange}
                        value={data.email}
                        required
                        className={styles.input}
                    />
                    <input 
                        type='text' 
                        placeholder='Address'
                        name = "address"
                        onChange={handleChange}
                        value={data.address}
                        required
                        className={styles.input}
                    />
                    <input 
                        type='password' 
                        placeholder='Password'
                        name = "password"
                        onChange={handleChange}
                        value={data.password}
                        required
                        className={styles.input}
                    />
                    <input 
                        type='text' 
                        placeholder='Mobile Number'
                        name = "phone_number"
                        onChange={handleChange}
                        value={data.phone_number}
                        required
                        className={styles.input}
                    />
                    {
                        error && <div className={styles.error_msg}>
                            {error}
                        </div>
                    }
                    <button type='submbit' className={styles.green_btn}>
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Signup