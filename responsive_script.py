import os
import glob

responsive_css_block = """

/* ==========================================================================
   GLOBAL RESPONSIVE OVERRIDES (ADDED AUTOMATICALLY)
   ========================================================================== */
@media (max-width: 900px) {
  .hero-content h1 { font-size: 2.5rem !important; }
  .section-header h2 { font-size: 2rem !important; }
  .mission-grid, .strategy-grid, .services-grid, .footer-container, .contact-content, .career-content, .job-listings {
    grid-template-columns: 1fr !important;
    gap: 2rem !important;
  }
}

@media (max-width: 768px) {
  /* Enforce container widths to avoid horizontal scrolling */
  body, html {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }
  
  .container {
    padding: 0 1rem !important;
    width: 100% !important;
  }

  /* Typography downscaling */
  h1 { font-size: 2.2rem !important; line-height: 1.2 !important; }
  h2 { font-size: 1.8rem !important; line-height: 1.3 !important; }
  h3 { font-size: 1.5rem !important; }
  p, .hero-description, .mission-text { font-size: 0.95rem !important; line-height: 1.5 !important; }
  
  /* Reset complex grids to 1 column */
  .grid-2, .grid-3, .grid-4, .strategy-grid, .services-grid, .mission-grid, .blog-grid, .career-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 1.5rem !important;
  }

  /* Reset flex layouts */
  .flex-row, .hero-split, .contact-split {
    flex-direction: column !important;
  }

  /* Forms and inputs */
  input, select, textarea, button {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  /* Padding margins normalization */
  .hero-section, .mission-section, .strategy-section, .services-section {
    padding-top: 3rem !important;
    padding-bottom: 3rem !important;
  }

  /* Images responsive */
  img {
    max-width: 100% !important;
    height: auto !important;
  }
}
"""

tailwind_responsive_css = """

/* ==========================================================================
   GLOBAL RESPONSIVE OVERRIDES (ADDED AUTOMATICALLY)
   ========================================================================== */
@media (max-width: 768px) {
  body, html {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }
  
  /* Force Tailwind flex/grid layout to wrap / column nicely on small screens */
  .flex-row, .tablet\:flex-row {
    flex-direction: column !important;
  }
  
  .w-full {
    width: 100% !important;
  }
  
  .px-4 {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }

  h1.supertitle {
    font-size: 1.5rem !important;
    top: -20px !important;
  }

  /* Specific index.html fixes */
  #hero-text h1 span {
    font-size: 3rem !important;
    line-height: 1 !important;
  }

  .mesh-label {
    position: static !important;
    transform: none !important;
    margin-bottom: 1rem !important;
  }

  .features-grid {
    grid-template-columns: 1fr !important;
  }
}
"""

def append_to_file(filepath, content):
    with open(filepath, 'a', encoding='utf-8') as f:
        f.write(content)
    print(f"Appended responsive CSS to: {filepath}")

def main():
    root_dir = r"c:\Users\Renusri\Downloads\Brainvoice-main\Brainvoice-main"
    
    # 1. Individual Custom CSS files
    css_pages_dir = os.path.join(root_dir, "BRAINVOICE - OTHER PAGES", "css")
    css_files = glob.glob(os.path.join(css_pages_dir, "*.css"))
    
    for css_file in css_files:
        append_to_file(css_file, responsive_css_block)
        
    # 2. Main tailwind/theme css file for the index page
    index_css_file = os.path.join(root_dir, "wp-content", "themes", "startdigital", "static", "style.css")
    if os.path.exists(index_css_file):
        append_to_file(index_css_file, tailwind_responsive_css)
    else:
        print(f"Warning: {index_css_file} not found.")

if __name__ == "__main__":
    main()
