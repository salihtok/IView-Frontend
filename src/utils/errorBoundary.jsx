import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Hata aldığında state güncelleniyor
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Hata loglama işlemleri burada yapılabilir
    console.error("Hata:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Kullanıcıya gösterilecek yedek içerik
      return (
        <div className="error-boundary">
          <h1>Bir hata oluştu!</h1>
          <p>İşleminiz tamamlanamadı. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      );
    }

    return this.props.children;
    // Normalde render edilmesi gereken içerik
  }
}

export default ErrorBoundary;