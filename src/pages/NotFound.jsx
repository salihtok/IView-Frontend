function NotFound() {
  return (
    <div className="text-center mt-12">
      <h1 className="text-5xl text-red-600 font-bold">
        404 - Sayfa Bulunamadı
      </h1>
      <p className="text-xl mt-4">Aradığınız sayfa mevcut değil.</p>
      <a
        href="/"
        className="text-blue-500 font-semibold underline hover:text-blue-700 mt-6 inline-block"
      >
        Ana Sayfaya Dön
      </a>
    </div>
  );
}

export default NotFound;