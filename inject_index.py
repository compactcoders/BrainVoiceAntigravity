import os

def insert_before_head(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    style_block = """
<!-- ==========================================================================
     GLOBAL RESPONSIVE OVERRIDES FOR INDEX.HTML (ADDED AUTOMATICALLY)
     ========================================================================== -->
<style id="mobile-responsive-overrides">
@media (max-width: 768px) {
  body, html {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }
  
  .tablet\:flex-row {
    flex-direction: column !important;
  }
  
  .tablet\:gap-24 {
    gap: 2rem !important;
  }
  
  .max-w-\[725px\] {
    max-width: 100% !important;
  }
  
  .is-h1 {
    font-size: 2.2rem !important;
  }
  
  .hero-text {
    padding-top: 30px !important;
  }
  
  .menu-row {
    display: none !important;
  }
  
  header {
    background-color: rgba(255,255,255,0.95) !important;
  }
}
</style>
"""
    if "</head>" in content and "mobile-responsive-overrides" not in content:
        content = content.replace("</head>", style_block + "\n</head>")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Injected style block into index.html")
    else:
        print("Not injected. Maybe already there or </head> not found.")

def main():
    filepath = r"c:\Users\Renusri\Downloads\Brainvoice-main\Brainvoice-main\index.html"
    if os.path.exists(filepath):
        insert_before_head(filepath)

if __name__ == "__main__":
    main()
