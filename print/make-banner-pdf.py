# -*- coding: utf-8 -*-
"""Builds print/banner.pdf from print/banner.html using headless Chrome.

Chrome rather than LibreOffice on purpose. LibreOffice cannot run here at all
(its wrapper wants a unix socket), and even where it does run it converts the
.pptx with substituted fonts. Printing the HTML keeps the pub's own faces and
draws the QR as vector paths rather than a bitmap, so it stays sharp at any
size a print shop cares to use.

Run:  python print/make-banner-pdf.py
"""
import os
import pathlib
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "print" / "banner.html"
OUT = pathlib.Path(os.environ.get("BANNER_PDF") or ROOT / "print" / "banner.pdf")

CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]

browser = next((c for c in CANDIDATES if pathlib.Path(c).exists()), None)
if browser is None:
    sys.exit("No Chrome or Edge found; cannot print to PDF.")

if not SRC.exists():
    sys.exit("print/banner.html is missing - run make-banner.py first.")

profile = pathlib.Path(tempfile.mkdtemp(prefix="banner-chrome-"))
# Chrome refuses to overwrite a file another process holds open, and a PDF
# viewer counts. Write beside it and move, so a locked target fails loudly
# here rather than silently leaving the old PDF in place.
staged = pathlib.Path(tempfile.mkdtemp(prefix="banner-pdf-")) / "banner.pdf"

try:
    subprocess.run(
        [browser, "--headless=new", "--disable-gpu", "--no-sandbox",
         "--user-data-dir=" + str(profile), "--no-pdf-header-footer",
         "--print-to-pdf=" + str(staged), SRC.as_uri()],
        check=True, capture_output=True, timeout=180,
    )
    if not staged.exists():
        sys.exit("Chrome reported success but wrote no file.")
    try:
        shutil.move(str(staged), str(OUT))
    except PermissionError:
        sys.exit("{} is open in another program - close it and run again.".format(OUT))
finally:
    shutil.rmtree(profile, ignore_errors=True)
    shutil.rmtree(staged.parent, ignore_errors=True)

print("wrote {}  ({} KB)".format(OUT, OUT.stat().st_size // 1024))
