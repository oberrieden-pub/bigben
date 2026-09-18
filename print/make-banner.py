# -*- coding: utf-8 -*-
"""Builds print/banner.html: one A4 landscape sheet holding two identical
banner strips, 281 x 92 mm. One cut across the middle gives two.

Self-contained on purpose. The fonts are embedded and the QR codes are inline
SVG, so the landlord can open the file on any machine, print it, and get the
pub's own typefaces and a scannable code with no network connection.

Re-run after changing a URL below:  python print/make-banner.py
"""
import base64
import io
import pathlib

import segno

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = ROOT / "public" / "fonts"

SITE = "https://oberrieden.pub"
# Points at the pub's own short redirect, not straight at Google. Three
# reasons: it is printable as text, it makes a far less dense code that scans
# from further away, and if the Google link ever changes only
# src/pages/review/index.astro changes - nothing has to be reprinted.
REVIEW = "https://oberrieden.pub/review"


def font(name):
    return base64.b64encode((FONTS / name).read_bytes()).decode()


def qr(data):
    """Inline SVG that scales to whatever the tile gives it."""
    buf = io.BytesIO()
    # Error level M survives a bit of pub wall. A quiet zone of 2 modules is
    # the minimum a phone camera will reliably lock onto.
    segno.make(data, error="m").save(
        buf, kind="svg", xmldecl=False, svgns=True, border=2,
        dark="#531C23", svgclass=None, lineclass=None, scale=1,
    )
    svg = buf.getvalue().decode("utf-8")
    # segno writes width/height and no viewBox, so CSS resizes the element but
    # leaves the drawing at natural size in the corner. Replacing the opening
    # tag with a viewBox lets it scale. Done by index rather than regex: the
    # pattern needs a backslash, and this file is generated from a shell
    # heredoc often enough that one got mangled into a literal 0x08 once.
    size = segno.make(data, error="m").symbol_size(scale=1, border=2)[0]
    open_tag_end = svg.index(">") + 1
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" '
        'viewBox="0 0 {0} {0}" preserveAspectRatio="xMidYMid meet" '
        'shape-rendering="crispEdges">'.format(size)
        + svg[open_tag_end:]
    )


html = (ROOT / "print" / "banner.template.html").read_text(encoding="utf-8")
for token, value in (
    ("__CABIN__", font("cabin-600-latin.woff2")),
    ("__BITTER__", font("bitter-700-latin.woff2")),
    ("__GEIST6__", font("geist-600-latin.woff2")),
    ("__QR_SITE__", qr(SITE)),
    ("__QR_REVIEW__", qr(REVIEW)),
):
    html = html.replace(token, value)

out = ROOT / "print" / "banner.html"
out.write_text(html, encoding="utf-8")
print("wrote {}  ({} KB)".format(out, out.stat().st_size // 1024))
