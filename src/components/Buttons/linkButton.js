<!-- Mülakat detayları -->
<div id="interview-details">
    <h2>Mülakat Başlığı: {{ interview.title }}</h2>
    <p>Süre: {{ interview.expireDate }}</p>
    <p>Link: <span id="interview-link">{{ interviewLink }}</span></p>
    <button id="copy-link-button">Linki Kopyala</button>
</div>

<script>
    document.getElementById('copy-link-button').addEventListener('click', function() {
        const linkText = document.getElementById('interview-link').innerText; // Link metnini al
        navigator.clipboard.writeText(linkText).then(function() {
            alert('Link kopyalandı!'); // Başarılı bildirim
        }).catch(function(err) {
            console.error('Link kopyalanamadı:', err);
        });
    });
</script>
