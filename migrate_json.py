import json
import os

# Directory containing your JSON files
questions_dir_path = 'data/python/questions/'  # Update with your directory path

def update_json_files_in_directory(directory_path):
    # Get a list of all JSON files in the directory
    files = [f for f in os.listdir(directory_path) if f.endswith('.json') and f != 'index.json']
    
    if not files:
        print(f"No JSON files found in directory: {directory_path}")
        return
    
    for file_name in files:
        file_path = os.path.join(directory_path, file_name)
        
        # Read the existing JSON data
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Update questions
        for question in data.get('questions', []):
            question['textarea'] = True  # Set textarea to true
            question['upload_area'] = False  # Set upload_area to false
        
        # Write the updated JSON data back to the file
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=4)
        
        print(f"Updated JSON file: {file_path}")

# Run the function to update all JSON files in the directory
update_json_files_in_directory(questions_dir_path)
