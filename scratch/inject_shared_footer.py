"""Replace page footers with shared site-footer mount."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

MOUNT = """<div id="site-footer-mount"></div>
\t<script src="{script}" defer></script>"""

INDEX_PATTERN = re.compile(
    r"<footer id=\"footer\"[\s\S]*?</footer>",
    re.IGNORECASE,
)

OTHER_PATTERN = re.compile(
    r"<footer class=\"footer\">[\s\S]*?</footer>",
    re.IGNORECASE,
)


def inject_file(path: Path, script_src: str) -> bool:
    text = path.read_text(encoding="utf-8")
    mount_block = MOUNT.format(script=script_src)

    if path.name == "index.html":
        if "site-footer-mount" in text:
            return False
        new_text, n = INDEX_PATTERN.subn(mount_block, text, count=1)
    else:
        if "site-footer-mount" in text:
            return False
        new_text, n = OTHER_PATTERN.subn(mount_block, text, count=1)

    if n != 1:
        print(f"SKIP {path.name}: footer match count={n}")
        return False

    path.write_text(new_text, encoding="utf-8")
    print(f"OK {path}")
    return True


def main():
    inject_file(ROOT / "index.html", "includes/load-site-footer.js")

    other_dir = ROOT / "BRAINVOICE - OTHER PAGES"
    for html in sorted(other_dir.glob("*.html")):
        inject_file(html, "../includes/load-site-footer.js")


if __name__ == "__main__":
    main()
