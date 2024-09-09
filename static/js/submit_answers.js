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
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
        alert("لطفاً ابتدا نام و کلمه عبور خود را وارد کنید.");
        return;
    }

    // Collect all answers dynamically
    var answers = {};
    var promises = [];

    document.querySelectorAll('.question').forEach(function (question, index) {
        var textarea = question.querySelector('textarea');
        var fileInput = question.querySelector('input[type="file"]');

        if (fileInput && fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var reader = new FileReader();

            var promise = new Promise((resolve, reject) => {
                reader.onload = function (e) {
                    answers[index] = e.target.result;
                    resolve();
                };
                reader.onerror = function () {
                    reject();
                };
                reader.readAsText(file);
            });

            promises.push(promise);
        } else if (textarea) {
            answers[index] = textarea.value;
        }
    });

    // After all file reading promises resolve, send the data
    Promise.all(promises).then(() => {
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
    }).catch((error) => {
        console.error('Error reading file:', error);
        alert('خطا در خواندن فایل.');
    });
}
