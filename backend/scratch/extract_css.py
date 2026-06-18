
import os

with open('resources/views/welcome.blade.php', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line 18 is at index 17
if len(lines) > 17:
    style_content = lines[17]
    # Remove <style> and </style> if they are on the same line, 
    # but based on view_file, they are on separate lines (17 and 19)
    # So line 18 (index 17) is just the CSS.
    
    css_path = 'public/css'
    if not os.path.exists(css_path):
        os.makedirs(css_path)
    
    with open(os.path.join(css_path, 'welcome.css'), 'w', encoding='utf-8') as f_out:
        f_out.write(style_content)
    print("Successfully moved CSS to public/css/welcome.css")
else:
    print("Could not find line 18")
