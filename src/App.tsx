import { BaseSyntheticEvent, createContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import Header from "./components/misc/header";
import Home from "./components/pages/home";
import User from "./components/pages/user";
import UserList from "./components/pages/user/list";
import UserLogin from "./components/pages/user/login";
import Category from "./components/pages/category";
import CategoryList from "./components/pages/category/list";
import CategoryForm from "./components/pages/category/form";
import Post from "./components/pages/post";
import PostList from "./components/pages/post/list";
import PostForm from "./components/pages/post/form";

export type Page =
  | "home"
  | "user"
  | "user_login"
  | "category"
  | "category_new"
  | "post"
  | "post_new";
export type Cookies = {
  [index: string]: string;
};
export type JwtDecoded = {
  iat: number;
  exp: number;
  roles: string[];
  email: string;
};

export const PageContext = createContext<Page>("home");
export const JwtContext = createContext<string | null>(null);
export const JwtDecodedContext = createContext<JwtDecoded | null>(null);
export const RefreshTokenContext = createContext<string | null>(null);

export default function App() {
  const apiEndpoitRefresh = new URL("https://localhost:8000/api/token/refresh");
  const [page, setPage] = useState<Page>("home");
  const [jwt, setJwt] = useState<string | null>(null);
  const [jwtDecoded, setJwtDecoded] = useState<JwtDecoded | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const getCookies = (index?: string): Cookies | string | null => {
    if (!document.cookie) {
      return null;
    }
    const cookies: Cookies = {};
    document.cookie.split(";").forEach((cookie) => {
      const [cookieIndex, cookieValue] = cookie.trim().split("=");
      cookies[cookieIndex] = cookieValue;
    });
    if (index && cookies[index]) {
      return cookies[index];
    }
    return cookies;
  };

  const setTokenRefreshTokenCookies = (
    token?: string,
    refresh_token?: string,
  ): void => {
    if (token) {
      const jwtDecoded: JwtDecoded = jwtDecode(token);
      setJwt(token);
      setJwtDecoded(jwtDecoded);
      document.cookie = `jwtCookie=${token}; max-age=${
        jwtDecoded.exp - jwtDecoded.iat
      }; path=/`;
    }
    if (refresh_token) {
      setRefreshToken(refresh_token);
      document.cookie = `refreshTokenCookie=${refresh_token}; max-age=86400; path=/`;
    }
  };

  const logout = () => {
    const res = confirm("Voulez-vous vous déconecter ?");
    if (res) {
      document.cookie = "jwtCookie=; max-age=-1;";
      document.cookie = "refreshTokenCookie=; max-age=-1;";
      setJwt(null);
      setJwtDecoded(null);
      setRefreshToken(null);
    }
  };

  const stayConnected = () => {
    let isCookieJwtExist = false;
    const jwtCookie = getCookies("jwtCookie");
    const refreshTokenCookie = getCookies("refreshTokenCookie");
    if (jwtCookie && typeof jwtCookie === "string") {
      isCookieJwtExist = true;
      setJwt(jwtCookie);
      setJwtDecoded(jwtDecode(jwtCookie));
    }
    if (refreshTokenCookie && typeof refreshTokenCookie === "string") {
      setRefreshToken(refreshTokenCookie);
      if (!isCookieJwtExist) {
        fetch(apiEndpoitRefresh, {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body: `refresh_token=${refreshTokenCookie}`,
        })
          .then((res) => (res.ok ? res.json() : console.log(res.status)))
          .then((dataJson) =>
            dataJson
              ? setTokenRefreshTokenCookies(
                  dataJson.token,
                  dataJson.refresh_token,
                )
              : null,
          )
          .catch((err) => console.log(err));
      }
    }
  };

  const renderPage = () => {
    return (
      {
        home: <Home title="Hello from my home, sweet home... ✅" />,
        user: (
          <User>
            <UserList onSetPage={setPage} />
          </User>
        ),
        user_login: (
          <User>
            <UserLogin onSetTokenRefreshTokenCookies={setTokenRefreshTokenCookies} />
          </User>
        ),
        post: (
          <Post>
            <PostList />
          </Post>
        ),
        post_new: (
          <Post>
            <PostForm onSetPage={setPage} />
          </Post>
        ),
        category: (
          <Category>
            <CategoryList />
          </Category>
        ),
        category_new: (
          <Category>
            <CategoryForm onSetPage={setPage} />
          </Category>
        ),
      }[page] || <h1>Page inexistante</h1>
    );
  };

  useEffect(() => {
    stayConnected();
  }, [page]);

  return (
    <>
      <JwtContext.Provider value={jwt}>
        <JwtDecodedContext.Provider value={jwtDecoded}>
          <RefreshTokenContext.Provider value={refreshToken}>
            <PageContext.Provider value={page}>
              <Header onLogout={logout} onSetPage={setPage} />
              <main className="p-3">{renderPage()}</main>
            </PageContext.Provider>
          </RefreshTokenContext.Provider>
        </JwtDecodedContext.Provider>
      </JwtContext.Provider>
    </>
  );
}
