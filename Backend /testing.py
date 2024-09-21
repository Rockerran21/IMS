import os
import random

# List of Nepali first names and surnames in English
first_names = ['Ram', 'Sita', 'Krishna', 'Radha', 'Gopal', 'Gita', 'Shiv', 'Laxmi']
surnames = ['Sharma', 'Prasad', 'Thapa', 'Malla', 'Devi', 'Magar', 'Gurung', 'Shakya']

# List of genders
genders = ['male', 'female']

def generate_student_data(image_folder, student_count):
    students = []

    # Ensure the folder exists and has images
    if not os.path.exists(image_folder):
        print(f"Image folder '{image_folder}' does not exist.")
        return

    image_files = os.listdir(image_folder)

    if len(image_files) < student_count:
        print(f"Not enough images in the folder. Found {len(image_files)} but need {student_count}.")
        return

    # Generate student data
    for i in range(student_count):
        first_name = random.choice(first_names)
        surname = random.choice(surnames)
        gender = random.choice(genders)
        image_path = os.path.join(image_folder, image_files[i])

        student = {
            'name': f'{first_name} {surname}',
            'gender': gender,
            'image': image_path
        }
        students.append(student)

        print(f"Generated student {i+1}/{student_count}: {student['name']}, {student['gender']}, {student['image']}")

    return students


if __name__ == '__main__':
    folder = 'downloaded_images'
    student_count = 100  # Example count
    students_data = generate_student_data(folder, student_count)
