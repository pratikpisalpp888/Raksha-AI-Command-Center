import os
import shutil
import time

root = r"c:\Users\pisal\OneDrive\Desktop\RakshaAI"
raksha_ai = os.path.join(root, "raksha-ai")
raksha_frontend = os.path.join(root, "raksha-frontend")
backend_src = os.path.join(raksha_ai, "backend")
backend_dest = os.path.join(root, "backend")
frontend_dest = os.path.join(root, "frontend")

def remove_readonly(func, path, excinfo):
    import stat
    os.chmod(path, stat.S_IWRITE)
    func(path)

# 1. Move backend if it still exists in the old location
if os.path.exists(backend_src):
    if not os.path.exists(backend_dest):
        print(f"Moving {backend_src} to {backend_dest}")
        shutil.move(backend_src, backend_dest)
    else:
        print(f"Backend already exists at {backend_dest}, skipping move.")

# 2. Rename frontend if it still exists in the old location
if os.path.exists(raksha_frontend):
    if not os.path.exists(frontend_dest):
        print(f"Renaming {raksha_frontend} to {frontend_dest}")
        os.rename(raksha_frontend, frontend_dest)
    else:
        print(f"Frontend already exists at {frontend_dest}, skipping rename.")

# 3. Remove raksha-ai with error handling for locked files
if os.path.exists(raksha_ai):
    print(f"Removing {raksha_ai}...")
    try:
        shutil.rmtree(raksha_ai, onerror=remove_readonly)
    except Exception as e:
        print(f"Error removing {raksha_ai}: {e}")
        print("Please make sure all terminals are closed and try running the script one last time.")

# 4. Remove unwanted files
unwanted_files = [
    "merge_v0.py",
    "setup_project.py",
    "simulate_emergency.py",
    ".env.txt",
    "submission_guide.md",
    "package-lock.json" # This one was in root but belongs in frontend
]
for f in unwanted_files:
    path = os.path.join(root, f)
    if os.path.exists(path):
        try:
            print(f"Removing file {f}")
            os.remove(path)
        except:
            pass

# 5. Remove unwanted dirs
unwanted_dirs = [
    "downloads",
    ".venv"
]
for d in unwanted_dirs:
    path = os.path.join(root, d)
    if os.path.exists(path):
        try:
            print(f"Removing dir {d}")
            shutil.rmtree(path, onerror=remove_readonly)
        except:
            pass

print("\n--- Final Project Structure ---")
for item in os.listdir(root):
    print(f"- {item}")
print("\nCleanup attempt finished!")
