import { useState, useEffect, useContext } from "react";
import Table from "../../../misc/table";
import { JwtContext, JwtDecodedContext } from "../../../../App";

export default function UserList(props) {
  // Ajout d'un délai pour simuler un réseau internet
  const jwt = useContext(JwtContext);
  const jwtDecoded = useContext(JwtDecodedContext);
  const networkLag = Math.floor((Math.random() * 1.2 + 0.2) * 1000);
  const apiEndpointCategory = new URL("https://localhost:8000/api/user");
  const basedLoadingText = "Veuillez patienter, chargement des utilisateurs ";
  const [loadingText, setLoadingText] = useState(basedLoadingText);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (!jwtDecoded || !jwtDecoded.roles.includes("ROLE_ADMIN")) {
      props.onSetPage("home");
      return;
    }
    console.log(`Le réseau à ${networkLag}ms de latence`);
    let loadingTextDots = 0;
    const intervalLoadingTextDots = setInterval(() => {
      loadingTextDots == 3 ? (loadingTextDots = 0) : loadingTextDots++;
      setLoadingText(
        basedLoadingText.padEnd(basedLoadingText.length + loadingTextDots, "."),
      );
    }, 300);
    setTimeout(() => {
      fetch(apiEndpointCategory, {
        method: "GET",
        headers: [
          ["content-type", "application/json"],
          ["authorization", `bearer ${jwt}`],
        ],
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          clearInterval(intervalLoadingTextDots);
          setIsLoading(false);
          setUsers(data);
        })
        .catch((err) => {
          console.log("ERR: ", err);
        });
    }, networkLag);
  }, []);

  return (
    <>
      {jwtDecoded && jwtDecoded.roles.includes("ROLE_ADMIN") ? (
        <>
          {isLoading ? (
            <div className="d-flex flex-row justify-content-center p-2">
              <p className="m-5 alert alert-warning">{loadingText}</p>
            </div>
          ) : (
            <Table data={users} />
          )}
        </>
      ) : (
        <p>Access Denied</p>
      )}
    </>
  );
}
