import Nav from "../nav";
import Status from "../status";
import Logo from "../logo";
import Login from "../../pages/user/login";

export default function Header(props) {
  return (
    <>
      <header className="d-flex flex-wrap justify-content-between m-3">
        <Nav onSetPage={props.onSetPage} onLogout={props.onLogout} />
        <Logo />
        <Status />
      </header>
    </>
  );
}
