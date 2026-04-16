import '../auth.form.scss'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js'


const Login = () => {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await handleLogin({ email, password });
            navigate('/');
        } catch (error) {
            console.error("Login failed:", error);
        }

    };
    if (loading) {
        return <p>Loading...</p>
    }


    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label htmlFor="email">Email</label>
                        <input onChange={(e) => { setEmail(e.target.value) }} type="email" id='email' name='email' placeholder='Enter Email Address' />
                    </div>
                    <div className='input-group'>
                        <label htmlFor="password">Password</label>
                        <input onChange={(e) => { setPassword(e.target.value) }} type="password" id='password' name='password' placeholder='Enter Password' />
                    </div>
                    <button type='submit' className='button primary-button'>Login</button>
                </form>
                <p>Don't have an account? <Link to='/register'>Register here</Link></p>
            </div>

        </main>
    )
}

export default Login
