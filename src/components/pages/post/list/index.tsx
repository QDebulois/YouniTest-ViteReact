import { useEffect, useState } from "react";
import PostShow from "../show";

export default function PostList() {
  // Ajout d'un délai pour simuler un réseau internet
  const networkLag = Math.floor((Math.random() * 1.2 + 0.5) * 1000);
  const apiEndpointPost = new URL("https://localhost:8000/api/post");
  const basedLoadingText = "Veuillez patienter, chargement des posts ";
  const [loadingText, setLoadingText] = useState(basedLoadingText);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState(null);

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
      fetch(apiEndpointPost, {
        method: "GET",
        headers: [["content-type", "application/json"]],
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          clearInterval(intervalLoadingTextDots);
          setIsLoading(false);
          setPosts(data);
        })
        .catch((err) => {
          console.log("ERR: ", err);
        });
    }, networkLag);
  }, []);

  return (<>
      {isLoading ? (
        <div className="d-flex flex-row justify-content-center p-2">
          <p className="m-5 alert alert-success">{loadingText}</p>
        </div>
      ) : (
        <div className="container p-5">
          <div className="row justify-content-center">
            {posts.map((post) => (
              <PostShow
                key={post.id}
                title={post.title}
                category={post.category}
                text={post.text}
                email={post.email}
                created_at={post.created_at}
              />
            ))}
          </div>
        </div>
      )}
  </>)
}

