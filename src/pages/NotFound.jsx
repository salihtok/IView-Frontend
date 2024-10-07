function NotFound() {
  // Stil nesnesi
  const styles = {
    notFound: {
      textAlign: 'center',
      marginTop: '50px',
    },
    heading: {
      fontSize: '2.5em',
      color: '#ff0000', // Kırmızı renk
    },
    paragraph: {
      fontSize: '1.2em',
    },
    link: {
      textDecoration: 'none',
      color: '#007bff', // Mavi renk
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.notFound}>
      <h1 style={styles.heading}>404 - Sayfa Bulunamadı</h1>
      <p style={styles.paragraph}>Aradığınız sayfa mevcut değil.</p>
      <a style={styles.link} href="/">Ana Sayfaya Dön</a>
    </div>
  );
}

export default NotFound;