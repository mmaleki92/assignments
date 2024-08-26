from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
import os

app = Flask(__name__)

category = "python"
questions_dir_path = f'data/{category}/questions/'
index_json_path = f'{questions_dir_path}index.json'

# Function to list all available posts (JSON files)
def list_available_posts():
    files = [f for f in os.listdir(questions_dir_path) if f.endswith('.json') and f != 'index.json']
    posts = []
    for file in files:
        with open(os.path.join(questions_dir_path, file), 'r', encoding='utf-8') as f:
            data = json.load(f)
            posts.append({
                'name': file.replace('.json', ''),
                'title': data.get('metadata', {}).get('title', 'Untitled')
            })
    return posts

# Function to load questions for a specific post
def load_questions(post_name):
    json_file_path = os.path.join(questions_dir_path, f'{post_name}.json')
    if os.path.exists(json_file_path):
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        return data['questions'], json_file_path
    return [], json_file_path

# Function to add new questions to a specific post
def add_new_questions_to_json(json_file_path, new_questions):
    if not os.path.exists(json_file_path):
        create_default_json_file(json_file_path)
    
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    existing_questions = data.get('questions', [])
    
    existing_titles = {q['title'] for q in existing_questions}
    if all(q['title'] in existing_titles for q in new_questions):
        return "All new questions already exist. No updates made."
    
    next_id = determine_next_id(existing_questions)
    
    for question in new_questions:
        question_id = next_id
        question['id'] = question_id
        next_id += 1
        question['content'] = question['content'].format(question_id=question_id)
    
    data['questions'].extend(new_questions)
    
    with open(json_file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

    return "New questions added successfully."

# Determine the next available ID based on existing questions
def determine_next_id(existing_questions):
    max_id = 0
    for question in existing_questions:
        if 'id' in question and isinstance(question['id'], int):
            max_id = max(max_id, question['id'])
    return max_id + 1

# Create a default JSON file structure if it does not exist
def create_default_json_file(json_file_path, title="Untitled", description=""):
    default_data = {
        "metadata": {
            "version": "1.0.0",
            "author": "Morteza Maleki",
            "date_created": "N/A",
            "description": description,
            "category": "پایگیم",
            "title": title
        },
        "questions": []
    }
    
    with open(json_file_path, 'w', encoding='utf-8') as file:
        json.dump(default_data, file, ensure_ascii=False, indent=4)

# Function to update the index JSON with a new post entry
def update_index_json(index_json_path, new_file_path, new_title, new_description):
    if not os.path.exists(index_json_path):
        with open(index_json_path, 'w', encoding='utf-8') as file:
            json.dump([], file, ensure_ascii=False, indent=4)
    
    with open(index_json_path, 'r', encoding='utf-8') as file:
        index_data = json.load(file)
    
    if any(entry['file_path'] == new_file_path for entry in index_data):
        return "The new index entry already exists. No updates made."
    
    new_entry = {
        "title": new_title,
        "description": new_description,
        "file_path": new_file_path
    }
    index_data.append(new_entry)
    
    with open(index_json_path, 'w', encoding='utf-8') as file:
        json.dump(index_data, file, ensure_ascii=False, indent=4)

    return "New post added to the index successfully."

@app.route('/')
def index():
    posts = list_available_posts()
    return render_template('index.html', posts=posts)

@app.route('/view_post/<post_name>', methods=['GET', 'POST'])
def view_post(post_name):
    questions, json_file_path = load_questions(post_name)
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        new_question = {
            "title": title,
            "content": content
        }
        message = add_new_questions_to_json(json_file_path, [new_question])
        return redirect(url_for('view_post', post_name=post_name, message=message))
    
    return render_template('view_post.html', post_name=post_name, questions=questions)

def create_post_html(post_name):
    with open("templates/questions_template.html", "r") as f:
        new_question_html = f.read().replace("__file_name__", post_name)

    new_html = f"fa/learning/{category}/posts/{post_name}.html"
    if not os.path.exists(new_html): 
        with open(new_html, "w") as file:
            file.write(new_question_html)

@app.route('/create_post', methods=['GET', 'POST'])
def create_post():
    if request.method == 'POST':
        post_name = request.form['post_name']
        title = request.form['title']
        description = request.form['description']
        
        json_file_path = os.path.join(questions_dir_path, f'{post_name}.json')
        
        if os.path.exists(json_file_path):
            return f"Post '{post_name}' already exists.", 400
        
        create_default_json_file(json_file_path, title=title, description=description)
        update_index_json(index_json_path, new_file_path=f'{post_name}.json', new_title=title, new_description=description)
        create_post_html(post_name)
        return redirect(url_for('view_post', post_name=post_name))
    
    return render_template('create_post.html')

if __name__ == '__main__':
    app.run(debug=True)
