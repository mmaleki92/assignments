// Save user information
function saveUserInfo(event) {
    event.preventDefault();

    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;

    // Save user info in local storage
    localStorage.setItem("userInfo", JSON.stringify({ name: name, password: password }));

    // Hide user info form
    document.getElementById("user-info-form").style.display = "none";
}

// Submit all answers
function submitAllAnswers() {
    // Get user info from local storage
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
        alert("لطفاً ابتدا نام و کلمه عبور خود را وارد کنید.");
        return;
    }

    // Collect all answers dynamically
    var answers = {};
    document.querySelectorAll('.question textarea').forEach(function (textarea, index) {
        answers[index] = textarea.value;
    });

    // Prepare data for submission
    var data = {
        date: new Date().toISOString(),
        name: userInfo.name,
        password: userInfo.password,
        answers: answers
    };

    // Send data using Fetch API
    fetch('https://mra85x.pythonanywhere.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('پاسخ‌های شما با موفقیت ارسال شد.');
        localStorage.removeItem("userInfo"); // Clear user info
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('خطا در ارسال پاسخ‌ها.');
    });
}
