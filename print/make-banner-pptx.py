# -*- coding: utf-8 -*-
"""Builds print/banner.pptx: the wall banner as an editable PowerPoint.

One slide per language, sized to the finished sign (281 x 92 mm) rather than
to a sheet of paper, so what is on screen is what gets printed and every piece
can be dragged, retyped or recoloured.

Fonts are deliberately ones that ship with Office. The site's own faces
(Bitter, Cabin, Geist) are web fonts, not installed on a normal machine, so
naming them here would only produce a silent substitution that looks wrong.
Georgia stands in for Bitter and Trebuchet MS for Cabin.

Run:  python print/make-banner-pptx.py
"""
import pathlib

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Mm, Pt

ROOT = pathlib.Path(__file__).resolve().parent.parent
QR = ROOT / "print" / "qr-review.png"

MAROON = RGBColor(0x53, 0x1C, 0x23)
GOLD = RGBColor(0xDD, 0xBA, 0x7A)
PAPER = RGBColor(0xFB, 0xF7, 0xF0)
TAN = RGBColor(0x8A, 0x62, 0x39)

W, H = 281, 92          # the finished sign, in mm
BAR = 12                # fascia board
MARGIN = 14
QRSIZE = 50
QRX = W - MARGIN - QRSIZE

CONTENT = [
    dict(quip="Neue Website. Immer noch das gleiche gute Bier.",
         ask="Hat es Ihnen gefallen? Sagen Sie es Google. Wenn nicht, dem Wirt.",
         cap="BEWERTEN SIE UNS"),
    dict(quip="New website. Still the same great beer.",
         ask="Enjoyed it? Tell Google. If not, tell the landlord.",
         cap="REVIEW US"),
]

NOTES = (
    "Finished size 281 x 92 mm. Print at 100% scale with background graphics "
    "switched on, or the maroon bar will not appear.\n\n"
    "The QR code points at oberrieden.pub/review, which redirects to the pub's "
    "Google listing. If that Google link ever changes, the redirect is what "
    "changes - this code stays valid, so printed copies keep working.\n\n"
    "Do not put this up until the website is live and approved."
)


def text(slide, x, y, w, h, body, *, font, size, colour,
         bold=False, spacing=None, align=PP_ALIGN.LEFT,
         anchor=MSO_ANCHOR.TOP):
    box = slide.shapes.add_textbox(Mm(x), Mm(y), Mm(w), Mm(h))
    tf = box.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    # PowerPoint pads text boxes by default, which would push everything a
    # couple of millimetres off the alignment the shapes establish.
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = body
    f = run.font
    f.name, f.size, f.bold = font, Pt(size), bold
    f.color.rgb = colour
    if spacing is not None:
        # python-pptx exposes no letter spacing; spc is in hundredths of a point.
        run._r.get_or_add_rPr().set("spc", str(int(spacing * 100)))
    return box


def rect(slide, x, y, w, h, fill, line=None, line_pt=1):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Mm(x), Mm(y), Mm(w), Mm(h))
    shape.shadow.inherit = False          # python-pptx defaults to a drop shadow
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    if line is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = line
        shape.line.width = Pt(line_pt)
    shape.text_frame.text = ""
    return shape


prs = Presentation()
prs.slide_width, prs.slide_height = Mm(W), Mm(H)
blank = prs.slide_layouts[6]

for c in CONTENT:
    slide = prs.slides.add_slide(blank)

    bg = slide.background.fill
    bg.solid()
    bg.fore_color.rgb = PAPER

    # The edge of the sign, so it reads as an object hung on a dark wall.
    rect(slide, 0.5, 0.5, W - 1, H - 1, PAPER, line=MAROON, line_pt=1)
    # The fascia board.
    rect(slide, 0, 0, W, BAR, MAROON)

    text(slide, MARGIN, 0, W - MARGIN * 2, BAR,
         "BIG BEN PUB  ·  OBERRIEDEN DORF",
         font="Trebuchet MS", size=11.5, colour=GOLD, bold=True,
         spacing=3, anchor=MSO_ANCHOR.MIDDLE)

    text(slide, MARGIN, 33, QRX - MARGIN - 6, 20, "oberrieden.pub",
         font="Georgia", size=50, colour=MAROON, bold=True)

    text(slide, MARGIN, 54.5, QRX - MARGIN - 6, 8, c["quip"],
         font="Georgia", size=18, colour=TAN, bold=True)

    text(slide, MARGIN, 64, QRX - MARGIN - 6, 7, c["ask"],
         font="Calibri", size=14, colour=MAROON)

    slide.shapes.add_picture(str(QR), Mm(QRX), Mm(23.5), Mm(QRSIZE), Mm(QRSIZE))

    text(slide, QRX - 8, 75, QRSIZE + 16, 6, c["cap"],
         font="Trebuchet MS", size=10, colour=MAROON, bold=True,
         spacing=1.5, align=PP_ALIGN.CENTER)

    slide.notes_slide.notes_text_frame.text = NOTES

out = ROOT / "print" / "banner.pptx"
prs.save(out)
print("wrote {}  ({} KB)".format(out, out.stat().st_size // 1024))
