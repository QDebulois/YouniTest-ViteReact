import { useContext, useState, useEffect } from "react";
import { JwtContext, JwtDecodedContext } from "../../../../App";

type Res = { status: number; msg: string };

export default function PostForm(props) {
  const jwt = useContext(JwtContext);
  const jwtDecoded = useContext(JwtDecodedContext);
  const networkLag = Math.floor((Math.random() * 1.2 + 0.2) * 1000);
  const apiEndpointCategory = new URL("https://localhost:8000/api/category");
  const apiEndpointPost = new URL("https://localhost:8000/api/post");
  const [categories, setCategories] = useState<any>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [res, setRes] = useState<Res | null>(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      category_id: category,
      title: title,
      text: text,
    };
    fetch(apiEndpointPost, {
      method: "POST",
      headers: [
        ["content-type", "application/json"],
        ["authorization", `bearer ${jwt}`],
      ],
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.status === 201) {
          setRes({ status: res.status, msg: "Le post à bien été créé!" });
        } else if (res.status === 400) {
          setRes({ status: res.status, msg: "Erreur dans le formulaire." });
        } else if (res.status === 401) {
          setRes({
            status: res.status,
            msg: "Erreur JWT expiré, veuillez vous reconnecter.",
          });
        } else {
          setRes({
            status: res.status,
            msg: "Erreur lors de la création du post.",
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
        201: <div className="alert alert-success mx-auto">{res.msg}</div>,
        400: <div className="alert alert-danger mx-auto">{res.msg}</div>,
        401: <div className="alert alert-danger mx-auto">{res.msg}</div>,
      }[res.status] || (
        <div className="alert alert-danger">
          {res.msg} {res.status}
        </div>
      )
    );
  };

  useEffect(() => {
    if (!jwtDecoded || !jwtDecoded.roles.includes("ROLE_USER")) {
      props.onSetPage("home");
      return;
    }
    console.log(`Le réseau à ${networkLag}ms de latence`);
    setTimeout(() => {
      fetch(apiEndpointCategory, {
        method: "GET",
        headers: [["content-type", "application/json"]],
      })
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.log("ERR: ", err));
    }, networkLag);
  }, []);

  return (
    <>
      {jwtDecoded && jwtDecoded.roles.includes("ROLE_USER") ? (
        <>
          <h2>Créer un Post</h2>
          <form
            className="d-flex flex-column gap-4 p-5"
            onSubmit={(e) => handleFormSubmit(e)}
          >
            {res && showRes(res)}
            <label>
              Catégorie
              <select
                className="form-control"
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                required
              >
                {categories ? (
                  <>
                    {categories.map((c) => {
                      if (!category) setCategory(c.id);
                      return (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      );
                    })}
                  </>
                ) : (
                  <option>Chargement des categories...</option>
                )}
              </select>
            </label>
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
            <label>
              Text
              <textarea
                className="form-control"
                onChange={(e) => setText(e.target.value)}
                required
              ></textarea>
            </label>
            <button type="submit" className="btn btn-success mx-auto">
              Enregistrer
            </button>
          </form>
        </>
      ) : (
        <p>Access Denied</p>
      )}
    </>
  );
}
