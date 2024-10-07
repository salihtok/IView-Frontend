import { useState } from 'react';
import { loginAdmin } from '../services/authServices';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await loginAdmin(email, password);
        if (!success) {
            setError('Login failed, please check your credentials.');
        } else {
            // Redirect to dashboard or other appropriate page
        }
    };

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f2f2f2',
            padding: '2rem',
        },
        formContainer: {
            backgroundColor: '#e3e3e8',
            padding: '3rem',
            borderRadius: '10px',
            width: '40%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        title: {
            marginBottom: '2rem',
            color: '#4d4d4d',
        },
        inputGroup: {
            marginBottom: '1.5rem',
        },
        label: {
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            color: '#4d4d4d',
        },
        input: {
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
        },
        button: {
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#4d4d4d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
        },
        buttonHover: {
            backgroundColor: '#363636',
        },
        errorMessage: {
            color: 'red',
            marginTop: '1rem',
        },
        imageContainer: {
            width: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        image: {
            width: '80%',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Admin Log in Page</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="email" style={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button}>Log in</button>
                    {error && <p style={styles.errorMessage}>{error}</p>}
                </form>
            </div>
            <div style={styles.imageContainer}>
                <img src="/path/to/admin.png" alt="Login illustration" style={styles.image} />
            </div>
        </div>
    );
};

export default Login;