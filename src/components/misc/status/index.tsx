import { useContext } from "react";
import { JwtDecodedContext } from "../../../App";

export default function Status(props: any) {
  const jwtDecoded = useContext(JwtDecodedContext);

  return (
    <>
      <div className="d-flex flex-column justify-content-center">
        <p className={`alert ${jwtDecoded ? "alert-success" : "alert-warning"}`}>
          {jwtDecoded ? (
            <>
              You are logged in as <strong>{jwtDecoded.email}</strong>
              <br />
              Roles <strong>{JSON.stringify(jwtDecoded.roles)}</strong>
            </>
          ) : (
            <>You are not logged in</>
          )}
        </p>
      </div>
    </>
  );
}
