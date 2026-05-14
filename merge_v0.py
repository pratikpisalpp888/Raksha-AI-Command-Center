import os
import shutil
from pathlib import Path

def copy_v0_components():
    base_dir = Path(r"c:\Users\pisal\OneDrive\Desktop\RakshaAI")
    downloads_dir = base_dir / "downloads"
    frontend_dir = base_dir / "raksha-frontend" / "src"
    
    components_dir = frontend_dir / "components"
    lib_dir = frontend_dir / "lib"
    pages_dir = frontend_dir / "pages"
    
    # Create necessary directories
    components_dir.mkdir(parents=True, exist_ok=True)
    lib_dir.mkdir(parents=True, exist_ok=True)
    
    # Mapping of V0 download folder to target page file
    page_mappings = {
        "intro+Full Dashboard": "DashboardPage.jsx",
        "login page": "LoginPage.jsx",
        "Case detail": "CaseDetailPage.jsx",
        "Report page": "ReportsPage.jsx",
        "live call": "LiveCallPage.jsx"
    }

    # Iterate through all downloads
    for folder in downloads_dir.iterdir():
        if folder.is_dir():
            print(f"Processing {folder.name}...")
            
            # 1. Copy Components
            v0_comp_dir = folder / "components"
            if v0_comp_dir.exists():
                for item in v0_comp_dir.iterdir():
                    if item.is_dir():
                        dest_dir = components_dir / item.name
                        if not dest_dir.exists():
                            shutil.copytree(item, dest_dir)
                            print(f"  Copied component directory: {item.name}")
                        else:
                            # Merge contents if exists (like 'ui' folder)
                            for subitem in item.iterdir():
                                if subitem.is_file():
                                    shutil.copy2(subitem, dest_dir / subitem.name)
                                elif subitem.is_dir():
                                    sub_dest = dest_dir / subitem.name
                                    if not sub_dest.exists():
                                        shutil.copytree(subitem, sub_dest)
            
            # 2. Copy lib (utils.ts)
            v0_lib_dir = folder / "lib"
            if v0_lib_dir.exists():
                for item in v0_lib_dir.iterdir():
                    shutil.copy2(item, lib_dir / item.name)
                    print(f"  Copied lib file: {item.name}")
                    
            # 3. Copy Page Code
            v0_page = folder / "app" / "page.tsx"
            if v0_page.exists() and folder.name in page_mappings:
                target_page = pages_dir / page_mappings[folder.name]
                
                # We rename it to .jsx and add the Header logic
                with open(v0_page, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Import header if not there
                if "import { Header }" not in content and "import Header" not in content:
                    content = "import Header from '../components/shared/Header'\n" + content
                
                # Inject Header component inside the main div
                if "return (" in content:
                    parts = content.split("return (", 1)
                    if "<div" in parts[1] or "<main" in parts[1]:
                        # Simple replacement to inject Header at the top
                        content = parts[0] + "return (\n    <>\n      <Header />\n" + parts[1].replace("</main>", "</main>\n    </>").replace("</div>\n  )", "</div>\n    </>\n  )")
                
                with open(target_page, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"  Updated page: {page_mappings[folder.name]}")

    print("\n✅ V0 files have been successfully merged into raksha-frontend!")
    
if __name__ == "__main__":
    copy_v0_components()
