document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();  // Formun sayfayı yeniden yüklemesini engelle
  
  // Kullanıcı adı ve şifre kontrolü (örnek: sabit bir değerle)
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  // Basit bir kontrol - gerçekte veritabanı kullanmalısınız
  if (username === "admin" && password === "1234") {
    // Başarılı giriş sonrası yönlendirme yapılacak
    window.location.href = "index.html";  // index.html sayfasına yönlendirme
  } else {
    alert("Hatalı kullanıcı adı veya şifre!");
  }
});
