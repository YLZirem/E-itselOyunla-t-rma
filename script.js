// --- DOM Elementleri ---
const gameArea = document.getElementById('game-area');
const scoreSpan = document.getElementById('current-score');
const levelSpan = document.getElementById('current-level');
const startButton = document.getElementById('start-button');
const infoButton = document.getElementById('info-button');
const infoModal = document.getElementById('info-modal');
const closeButton = infoModal.querySelector('.close-button');
const infoTitle = document.getElementById('info-title');
const infoText = document.getElementById('info-text');

// --- Oyun Durum Değişkenleri ---
let currentScore = 0;
let currentLevel = 1;
let currentQuestionIndex = 0;
let gameData = []; // Oyun soruları ve senaryoları buraya yüklenecek
let currentLevelType = 'quiz'; // 'quiz' veya 'simulation'

// --- Olay Dinleyicileri ---
startButton.addEventListener('click', startGame);
infoButton.addEventListener('click', openInfoModal);
closeButton.addEventListener('click', closeInfoModal);
window.addEventListener('click', (event) => {
    if (event.target === infoModal) {
        closeInfoModal();
    }
});

// --- Fonksiyonlar ---

/**
 * Oyunu başlatan ana fonksiyon
 */
function startGame() {
    startButton.style.display = 'none'; // Başlat butonunu gizle
    loadGameData();
}

/**
 * Oyun verilerini (sorular.json) yükler
 */
async function loadGameData() {
    // Gerçek bir projede, fetch() ile data/sorular.json'dan veriyi çekmelisiniz.
    // Şimdilik test için manuel bir veri setini kullanalım.
    gameData = [
        {
            type: 'quiz',
            level: 1,
            title: 'Hız ve Takip Mesafesi',
            info: 'Takip mesafesi, güvenli sürüşün temelidir ve genellikle hızınızın yarısı olarak hesaplanır. Hava koşulları bu mesafeyi artırmanızı gerektirir.',
            question: 'Azami hızın 90 km/saat olduğu kuru bir yolda, takip mesafesi en az kaç metre olmalıdır?',
            options: ['30', '45', '60', '90'],
            answer: '45'
        },
        // ... (daha sonra simülasyon ve diğer quiz sorularını ekleyeceğiz)
    ];
    
    // Veri yüklendikten sonra ilk seviyeyi başlat
    startNextLevel();
}

/**
 * Lider tablosunu yükler ve gösterir
 */
function loadLeaderboard() {
    // Bu kısım, bir sunucusuz veritabanı (Firebase) veya basit bir JSON/GitHub API kullanımı gerektirir.
    // Şimdilik sadece yer tutucu olsun.
    const leaderList = document.getElementById('leader-list');
    leaderList.innerHTML = `
        <li>Ahmet Yılmaz <span>1500 Puan</span></li>
        <li>Ayşe Demir <span>1200 Puan</span></li>
        <li>Siz <span>${currentScore} Puan</span></li>
    `;
}

/**
 * Sonraki seviyeyi başlatan ana kontrol mekanizması
 */
function startNextLevel() {
    const levelData = gameData.find(d => d.level === currentLevel && d.type === currentLevelType);

    if (!levelData) {
        gameArea.innerHTML = '<h2>Tebrikler! Oyunu Bitirdiniz!</h2>';
        return;
    }

    levelSpan.textContent = currentLevel;
    
    if (levelData.type === 'quiz') {
        renderQuiz(levelData);
    } else if (levelData.type === 'simulation') {
        // renderSimulation(levelData); // Daha sonra eklenecek
    }
}

/**
 * Quiz (Çoktan Seçmeli) tipindeki seviyeleri ekrana basar
 */
function renderQuiz(data) {
    gameArea.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.question}</p>
        <div id="options-container">
            ${data.options.map((option, index) => 
                `<button class="option-button" data-answer="${option}">${option}</button>`
            ).join('')}
        </div>
    `;

    // Cevap butonlarına dinleyici ekle
    gameArea.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', (e) => checkAnswer(e.target.dataset.answer, data.answer, data.info));
    });
}


// --- Eğitsel Buton (Kavşak Kılavuzu) Mantığı ---

/**
 * Kavşak Kılavuzu (Bilgi Modalı) açar
 */
function openInfoModal() {
    // Bilgi modalını, o anki seviyenin info metni ile doldur
    const levelData = gameData.find(d => d.level === currentLevel && d.type === currentLevelType);

    if (levelData && levelData.info) {
        infoTitle.textContent = levelData.title || 'Kavşak Kılavuzu';
        infoText.innerHTML = levelData.info; 
    } else {
        infoTitle.textContent = 'Genel Bilgilendirme';
        infoText.textContent = 'Şu anda bulunduğunuz seviyeye özel bir kılavuz notu bulunmamaktadır. Ancak trafik kuralları hakkında genel bilgileri her zaman kontrol edebilirsiniz.';
    }

    infoModal.style.display = 'block';
}

/**
 * Kavşak Kılavuzu (Bilgi Modalı) kapatır
 */
function closeInfoModal() {
    infoModal.style.display = 'none';
}


/**
 * Kullanıcının verdiği cevabı kontrol eder
 */
function checkAnswer(selectedAnswer, correctAnswer, levelInfo) {
    let message = '';
    let isCorrect = selectedAnswer === correctAnswer;

    if (isCorrect) {
        currentScore += 100;
        message = '✅ Doğru! Bir sonraki seviyeye geçiyorsunuz.';
    } else {
        currentScore -= 50; // Yanlış cevapta ceza puanı
        message = `❌ Yanlış Cevap. Doğru cevap: ${correctAnswer}.`;
        
        // Yanlış cevapta, ilgili bilgiyi gösteren butonu ön plana çıkarabiliriz
        openInfoModalWithMessage(`Yanlış cevap! Bilgiye göz atın:`, levelInfo);
        
        // İlerlemeyi durdurup, tekrar denemesini isteyebiliriz
        // veya aynı seviyede kalıp tekrar soru sorabiliriz.
        // Şimdilik basitleştirelim ve bir sonraki seviyeye geçelim.
    }

    scoreSpan.textContent = currentScore;
    
    // Sonucu göster
    gameArea.innerHTML = `
        <h2>${message}</h2>
        ${isCorrect ? '' : `<p>Bilgi: ${levelInfo}</p>`}
        <button id="next-button" class="primary-button">İlerle</button>
    `;

    // İlerle butonuna dinleyici ekle
    document.getElementById('next-button').addEventListener('click', () => {
        if (isCorrect) {
            currentLevel++;
            // Bu noktada quiz ve simülasyon arasında geçiş yapacak mantık kurulmalı.
        }
        startNextLevel(); 
    });
    
    loadLeaderboard();
}

/**
 * Hata durumunda bilgi modalını otomatik açan yardımcı fonksiyon
 */
function openInfoModalWithMessage(title, text) {
     infoTitle.textContent = title;
     infoText.innerHTML = text;
     infoModal.style.display = 'block';
}

// Uygulamayı başlat
loadLeaderboard();
