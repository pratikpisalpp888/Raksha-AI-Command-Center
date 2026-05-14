import os
import zipfile

def create_zip():
    zip_name = 'raksha-ai-source.zip'
    # These folders are huge and not needed for source code submission
    ignore_dirs = {'.git', 'node_modules', 'venv', '.venv', 'downloads', '__pycache__', 'dist'}
    
    print(f"Creating {zip_name}...")
    print("This will take a few seconds. Skipping heavy folders to keep size under 50MB...\n")
    
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            # Skip unwanted directories
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            
            for file in files:
                # Don't zip the zip file itself or this script
                if file == zip_name or file == 'create_zip.py':
                    continue
                    
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, '.')
                zipf.write(file_path, arcname)
                
    print(f"\n✅ Done! '{zip_name}' has been created in your folder.")
    size_mb = os.path.getsize(zip_name) / (1024 * 1024)
    print(f"📦 File size: {size_mb:.2f} MB")
    
    if size_mb < 50:
        print("Perfect! This is well under the 50MB limit.")
    else:
        print("Warning: File is over 50MB. Check for hidden large files.")

if __name__ == '__main__':
    create_zip()
