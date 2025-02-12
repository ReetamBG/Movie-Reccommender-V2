import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Authentication() {

    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [userId, setUserId] = useState(null)

    function handleUsernameChange(event) {
        setUsername(event.target.value)
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault()
        console.log('Username:', username);
        console.log('Password:', password);
        const data = {
            username: username,
            password: password
        }
        axios.post("http://localhost:8000/login/",
            data
        )
            .then(res => {
                setUserId(res.data.user_id)
                localStorage.setItem("user_id", res.data.user_id)
                navigate("/")
            })
            .catch(err => {
                console.error(err)
                navigate("/login")
            });
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="col-4">
                <form onSubmit={handleSubmit}>
                    <img className="mb-4" src="/images/image_1.jpg" alt="" width="72" height="57" />
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            required
                            className="form-control"
                            id="floatingInput"
                            placeholder="Username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <label htmlFor="floatingInput">Username</label>
                    </div>
                    <div className="form-floating">
                        <input
                            type="password"
                            required
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <div className="form-check text-start my-3">
                        <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Remember me
                        </label>
                    </div>
                    <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
                    <p className="mt-5 mb-3 text-body-secondary">© 2017–2024</p>
                </form>
            </div>
        </div>
    )
}

export default Authentication
