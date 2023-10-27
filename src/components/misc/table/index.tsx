import { useContext } from "react";
import { PageContext } from "../../../App";

export default function Table(props) {
  const page = useContext(PageContext);

  const manageDataType = (data) => {
    if (typeof data === "string" || typeof data === "number") {
      return data;
    } else if (typeof data === "object" && data.date) {
      return data.date.split(".")[0];
    } else {
      return JSON.stringify(data);
    }
  };

  const generateHeaders = () => {
    if (page === "category") {
      return (
        <>
          <th>Id</th>
          <th>Titre</th>
          <th>Auteur</th>
          <th>Créé le</th>
        </>
      );
    } else if (page === "user") {
      return (
        <>
          <th>Id</th>
          <th>Email</th>
          <th>Roles</th>
          <th>Créé le</th>
        </>
      );
    } else {
      return <></>;
    }
  };

  const generateRows = () => {
    return props.data.map((category, categoryIndex) => (
      <tr key={`tr_${categoryIndex}`}>
        {Object.values(category).map((data, dataIndex) => (
          <td key={`td_${category.id}_${dataIndex}`}>{manageDataType(data)}</td>
        ))}
      </tr>
    ));
  };

  return (
    <>
      <table className="table">
        <thead>
          <tr>{generateHeaders()}</tr>
        </thead>
        <tbody>{generateRows()}</tbody>
      </table>
    </>
  );
}
