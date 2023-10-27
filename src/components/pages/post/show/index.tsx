export default function PostShow(props) {
  return (
    <>
      <section className="col-11 col-lg-3  border border-2 rounded ps-3 py-5 pe-5 m-2">
        <h3 className="text-center">{props.title}</h3>
        <h4>{props.category}</h4>
        <i>Auteur: {props.email}, le {props.created_at.date.split(".")[0]}</i>
        <p className="p-3">{props.text}</p>
      </section>
    </>
  )
}
