export default function Logo() {
  const logoPath = new URL("https://localhost:8000/upload/logo.jpg");
  return (
    <>
      <div className="d-flex flex-column justify-content-center m-3">
        <img src={logoPath.toString()} alt="Veuillez uploader un logo en ADMIN" className="rounded" width={250} height={250}/>
      </div>
    </>
  )
}
