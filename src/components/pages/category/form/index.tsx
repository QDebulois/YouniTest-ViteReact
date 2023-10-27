import { useContext, useState, useEffect } from "react";
import { JwtContext, JwtDecodedContext } from "../../../../App";

type Res = { status: number; msg: string };

export default function CategoryForm(props) {
  const jwt = useContext(JwtContext);
  const jwtDecoded = useContext(JwtDecodedContext);
  const apiEndpointCategory = new URL("https://localhost:8000/api/category");
  const [title, setTitle] = useState<string | null>(null);
  const [res, setRes] = useState<Res | null>(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: title,
    };
    fetch(apiEndpointCategory, {
      method: "POST",
      headers: [
        ["content-type", "application/json"],
        ["authorization", `bearer ${jwt}`],
      ],
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.status === 201) {
          setRes({ status: res.status, msg: "La catégorie à bien été créée!" });
        } else if (res.status === 400) {
          setRes({ status: res.status, msg: "Erreur dans le formulaire." });
        } else if (res.status === 401) {
          setRes({ status: res.status, msg: "Erreur JWT expiré, veuillez vous reconnecter." });
        } else {
          setRes({
            status: res.status,
            msg: "Erreur lors de la création de la catégorie.",
          });
        }
        return res.json();
      })
      .then((data) => console.log("DATA: ", data))
      .catch((err) => console.log("ERR: ", err));
  };

  const showRes = (res: Res) => {
    return (
      {
        201: (
          <div className="alert alert-success mx-auto">{res.msg}</div>
        ),
        400: (
          <div className="alert alert-danger mx-auto">{res.msg}</div>
        ),
        401: (
          <div className="alert alert-danger mx-auto">{res.msg}</div>
        ),
      }[res.status] || <div className="alert alert-danger">{res.msg} {res.status}</div>
    );
  };

  useEffect(() => {
    if (!jwtDecoded || !jwtDecoded.roles.includes("ROLE_ADMIN")) {
      props.onSetPage("home");
      return;
    }
  }, []);

  return (
    <>
      <h2>Créer une Catégorie</h2>
      <form
        className="d-flex flex-column gap-4 p-5"
        onSubmit={(e) => handleFormSubmit(e)}
      >
        {res && showRes(res)}
        <label>
          Titre
          <input
            type="text"
            className="form-control"
            placeholder="Titre"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            required
          />
        </label>
        <button type="submit" className="btn btn-success mx-auto">
          Enregistrer
        </button>
      </form>
    </>
  );
}
