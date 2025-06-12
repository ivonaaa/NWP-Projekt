import { useState } from "react";
import { useLogin } from '../hooks/useLogin'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        await login(email, password)
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <form className="login" onSubmit={handleSubmit}>
            <h3>Log in</h3>

            <label>Email: </label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label>Password: </label>
            <div className="password-input-container">
                <input
                    type={passwordVisible ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <button type="button" onClick={togglePasswordVisibility} className="toggle-password-visibility">
                    <span className="material-symbols-outlined">
                        {passwordVisible ? 'visibility_off' : 'visibility'}
                    </span>
                </button>
            </div>

            <button type="submit" disabled ={ isLoading }>Log in</button>
            { error && <div className="error">{ error }</div>}
        </form>
    );
};

export default Login;
