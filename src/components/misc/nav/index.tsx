import { useContext } from "react";
import { JwtDecodedContext, PageContext } from "../../../App";

export default function Nav(props: any) {
  const page = useContext(PageContext);
  const jwtDecoded = useContext(JwtDecodedContext);

  return (
    <>
      <nav className="list-group m-3">
        <button className={`list-group-item ${page === "home" && "active"}`} onClick={() => {props.onSetPage("home")}}>
          Accueil
        </button>
        <button className={`list-group-item ${page === "post" && "active"}`} onClick={() => {props.onSetPage("post")}}>
          Voir les posts
        </button>
        <button className={`list-group-item ${page === "category" && "active"}`} onClick={() => {props.onSetPage("category")}}>
          Voir les categories
        </button>
        {jwtDecoded?.roles.includes("ROLE_USER") && (
          <button className={`list-group-item list-group-item-warning ${page === "post_new" && "active"}`} onClick={() => {props.onSetPage("post_new")}}>
            Créer un post
          </button>
        )}
        {jwtDecoded?.roles.includes("ROLE_ADMIN") && (
          <>
            <button className={`list-group-item list-group-item-danger ${page === "category_new" && "active"}`} onClick={() => {props.onSetPage("category_new")}}>
              Créer une categorie
            </button>
            <button className={`list-group-item list-group-item-danger ${page === "user" && "active"}`} onClick={() => {props.onSetPage("user")}}>
              Voir les utilisateurs
            </button>
          </>
        )}
        {!jwtDecoded ? (
          <button className={`list-group-item list-group-item-info ${page === "user" && "active"}`} onClick={() => {props.onSetPage("user_login")}}>
            Se connecter
          </button>
        ) : (
          <button className={"list-group-item list-group-item-info"} onClick={() => {props.onLogout(); props.onSetPage("home")}}>
            Se déconnecter
          </button>
        )}
      </nav>
    </>
  );
}
