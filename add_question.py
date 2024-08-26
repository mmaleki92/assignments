import json
import os

post_name = "post_5"
category = "python"
questions_json_path = f'data/{category}/questions/{post_name}.json'
index_json_path = f'data/{category}/questions/index.json'

new_questions = [
    {
        "title": "مثال جدید 1",
        "content": """<div class='question'>
        <p class='mixed-direction'>این یک مثال جدید است.</p>
        <script src="https://gist.github.com/mmaleki92/5671654bec8602b6c51bc022f0c8e796.js"></script>
        <textarea id='answer{question_id}' name='answer{question_id}' rows='4' required></textarea>
        </div>"""
    }
]

def determine_next_id(existing_questions):
    """Determine the next available ID based on existing questions."""
    max_id = 0
    for question in existing_questions:
        if 'id' in question and isinstance(question['id'], int):
            max_id = max(max_id, question['id'])
    return max_id + 1

def create_default_json_file(json_file_path):
    """Create a default JSON file structure if it does not exist."""
    default_data = {
        "metadata": {
            "version": "1.0.0",
            "author": "Unknown",
            "date_created": "N/A",
            "description": "Default JSON structure",
            "category": "Unknown",
            "title": "Default Title"
        },
        "questions": []
    }
    
    with open(json_file_path, 'w', encoding='utf-8') as file:
        json.dump(default_data, file, ensure_ascii=False, indent=4)

def add_new_questions_to_json(json_file_path, new_questions):
    """Add new questions with auto-assigned IDs to the JSON file."""
    if not os.path.exists(json_file_path):
        create_default_json_file(json_file_path)
    
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    existing_questions = data.get('questions', [])
    
    # Check if all new questions already exist
    existing_titles = {q['title'] for q in existing_questions}
    if all(q['title'] in existing_titles for q in new_questions):
        print("All new questions already exist. No updates made.")
        return
    
    next_id = determine_next_id(existing_questions)
    
    for question in new_questions:
        question_id = next_id
        question['id'] = question_id
        next_id += 1
        question['content'] = question['content'].format(question_id=question_id)
    
    data['questions'].extend(new_questions)
    
    with open(json_file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

def update_index_json(index_json_path, new_file_path, new_title, new_description):
    """Update the index JSON file to include a new entry."""
    if not os.path.exists(index_json_path):
        raise FileNotFoundError(f"Index file '{index_json_path}' does not exist.")
    
    with open(index_json_path, 'r', encoding='utf-8') as file:
        index_data = json.load(file)
    
    # Check if the new entry already exists
    if any(entry['file_path'] == new_file_path for entry in index_data):
        print("The new index entry already exists. No updates made.")
        return
    
    new_entry = {
        "title": new_title,
        "description": new_description,
        "file_path": new_file_path
    }
    index_data.append(new_entry)
    
    with open(index_json_path, 'w', encoding='utf-8') as file:
        json.dump(index_data, file, ensure_ascii=False, indent=4)

def process_new_questions():
    """Process and add new questions and update the index."""
    add_new_questions_to_json(questions_json_path, new_questions)
    
    new_file_path = f'posts/{post_name}.html'
    new_title = "مثال جدید"
    new_description = "سوالات جدید اضافه شده"
    update_index_json(index_json_path, new_file_path, new_title, new_description)

    with open("templates/questions.html", "r") as f:
        new_question_html = f.read().replace("__file_name__", post_name)
    with open(f"fa/learning/{category}/posts/{post_name}.html", "w") as file:
        file.write(new_question_html)

# Call the function to process new questions and update index
process_new_questions()
