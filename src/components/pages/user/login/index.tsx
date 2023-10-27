import { useContext, useState } from "react";
import { JwtContext, RefreshTokenContext } from "../../../../App";

type Res = { status: number; msg: string };

export default function UserLogin(props) {
  const jwt = useContext(JwtContext);
  const refreshToken = useContext(RefreshTokenContext);
  const apiEndpoitLogin = new URL("https://localhost:8000/api/user/login");
  const [email, setEmail] = useState<string|null>(null);
  const [password, setPassword] = useState<string|null>(null);
  const [res, setRes] = useState<Res|null>(null);

  const login = (email: string, password: string, e: BaseSyntheticEvent) => {
    e.preventDefault();
    const formButton = e.target.querySelector("[type='submit']");
    const initialText = formButton.innerText;
    const buttonText = document.createElement("span");
    buttonText.innerText = "connection...";
    const loader = document.createElement("span");
    loader.className = "spinner-border spinner-border-sm me-1";
    loader.role = "status";
    loader.ariaHidden = "true";
    while (formButton.firstChild) {
      formButton.removeChild(formButton.firstChild);
    }
    formButton.appendChild(loader);
    formButton.appendChild(buttonText);
    fetch(apiEndpoitLogin, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: email, password: password }),
    })
      .then((res) => {
        if (res.status === 200) {
          setRes({ status: res.status, msg: "Connection réussie!" });
        } else if (res.status === 401) {
          setRes({ status: res.status, msg: "Identifiants invalides." });
        } else {
          setRes({
            status: res.status,
            msg: "Erreur lors de la connection.",
          });
        }
        return res.json()
      })
      .then((dataJson) => {
        props.onSetTokenRefreshTokenCookies(dataJson.token, dataJson.refresh_token);
        formButton.innerText = initialText;
      })
      .catch((err) => console.log(err));
  };

  const showRes = (res: Res) => {
    return (
      {
        200: (
          <div className="alert alert-success mx-auto">{res.msg}</div>
        ),
        401: (
          <div className="alert alert-danger mx-auto">{res.msg}</div>
        ),
      }[res.status] || <div className="alert alert-danger">{res.msg} {res.status}</div>
    );
  };

  return (
    <>
      <h2 className="text-center">Connection</h2>
      <form className="d-flex flex-column gap-4 p-5" onSubmit={(e) => {if (email && password) login(email, password, e)}}>
        <p className="text-center">
          {jwt ? <>COOKIE JWT OK: {jwt.slice(0, 25)}...<br/></> : <>PAS de JWT<br/></>}
          {refreshToken ? (
            <>COOKIE REFRESH OK: {refreshToken.slice(0, 25)}...</>
          ) : (
            <>PAS de REFRESH</>
          )}
        </p>
        {res && showRes(res)}
        <label>
          Email
          <input
            className="form-control"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Mot de passe
          <input
            className="form-control"
            type="password"
            placeholder="Mot de passe"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="btn btn-primary mx-auto"
        >
          Se connecter
        </button>
      </form>
    </>
  );
}
