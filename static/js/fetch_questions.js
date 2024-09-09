function fetchAndRenderQuestions(jsonPath) {
    fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched Data:', data); // Debugging line

            // Set the page title and main header
            document.getElementById('page-title').textContent = data.metadata.title;
            document.getElementById('main-header').textContent = data.metadata.title;

            const questionsContainer = document.getElementById('questions-container');
            if (!questionsContainer) {
                console.error('Element with id "questions-container" not found.');
                return;
            }

            let counter = 1;

            data.questions.forEach(question => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('question');

                // Create question title
                const questionTitle = document.createElement('h2');
                questionTitle.textContent = `${counter}. ${question.title}`;
                questionDiv.appendChild(questionTitle);

                // Handling mixed content of text, code, and images
                const parser = new DOMParser();
                const doc = parser.parseFromString(question.content, 'text/html');
                const elements = doc.body.childNodes;

                elements.forEach(element => {
                    if (element.nodeName === 'PRE') {
                        // Create a pre element for code content
                        const codeBlock = document.createElement('pre');
                        codeBlock.innerHTML = element.innerHTML;
                        questionDiv.appendChild(codeBlock);
                    } else if (element.nodeName === 'IMG') {
                        // Create an img element for images
                        const imgElement = document.createElement('img');
                        imgElement.src = element.getAttribute('src');  // Set the src attribute
                        imgElement.alt = element.getAttribute('alt') || 'Image';  // Set the alt attribute
                        questionDiv.appendChild(imgElement);
                    } else {
                        // Create a paragraph for non-code content
                        const paragraph = document.createElement('p');
                        paragraph.innerHTML = element.textContent;
                        questionDiv.appendChild(paragraph);
                    }
                });

                // Conditionally create the textarea for user input
                if (question.textarea) {
                    const textarea = document.createElement('textarea');
                    textarea.id = `answer${question.id}`;
                    textarea.name = `answer${question.id}`;
                    textarea.rows = 4;
                    textarea.required = true;
                    questionDiv.appendChild(textarea);
                }

                // Conditionally create the file upload area
                if (question.upload_area) {
                    // Create a label for file upload input
                    const fileUploadLabel = document.createElement('label');
                    fileUploadLabel.setAttribute('for', `file-upload-${question.id}`);
                    fileUploadLabel.textContent = 'بارگذاری فایل:';

                    // Create the file input element
                    const fileUploadInput = document.createElement('input');
                    fileUploadInput.type = 'file';
                    fileUploadInput.id = `file-upload-${question.id}`;
                    fileUploadInput.name = `file-upload-${question.id}`;

                    questionDiv.appendChild(fileUploadLabel);
                    questionDiv.appendChild(fileUploadInput);
                }

                counter++;
                questionsContainer.appendChild(questionDiv);
            });

            // Re-highlight code blocks after dynamically inserting content
            Prism.highlightAll();
        })
        .catch(error => console.error('Error fetching JSON:', error));
}
