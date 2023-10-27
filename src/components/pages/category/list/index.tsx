import { useState, useEffect } from "react";
import Table from "../../../misc/table";

export default function CategoryList() {
  // Ajout d'un délai pour simuler un réseau internet
  const networkLag = Math.floor((Math.random() * 1.2 + 0.2) * 1000);
  const apiEndpointCategory = new URL("https://localhost:8000/api/category");
  const basedLoadingText = "Veuillez patienter, chargement des catégories ";
  const [loadingText, setLoadingText] = useState(basedLoadingText);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
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
        headers: [["content-type", "application/json"]],
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          clearInterval(intervalLoadingTextDots);
          setIsLoading(false);
          setCategories(data);
        })
        .catch((err) => {
          console.log("ERR: ", err);
        });
    }, networkLag);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="d-flex flex-row justify-content-center p-2">
          <p className="m-5 alert alert-info">{loadingText}</p>
        </div>
      ) : (
        <Table data={categories} />
      )}
    </>
  );
}
