from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/bioaro-ai-model-handoff-v2.md"
OUTPUT = ROOT / "output/pdf/bioaro-ai-model-handoff-v2.pdf"


def ascii_text(value: str) -> str:
    replacements = {
        "->": "->",
        "→": "->",
        "←": "<-",
        "—": "-",
        "–": "-",
        "’": "'",
        "“": '"',
        "”": '"',
        "°": " degrees",
        "±": "+/-",
    }
    for old, new in replacements.items():
        value = value.replace(old, new)
    return value.encode("ascii", "replace").decode("ascii")


def inline_markup(text: str) -> str:
    text = ascii_text(text)
    text = re.sub(r"!\[([^]]*)\]\([^)]*\)", r"[Image: \1]", text)
    text = re.sub(r"\[([^]]+)\]\(([^)]+)\)", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"<font name='Courier'>\1</font>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", text)
    return text


class HandoffDocTemplate(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        super().__init__(filename, pagesize=A4, **kwargs)
        frame = Frame(18 * mm, 17 * mm, 174 * mm, 263 * mm, id="normal")
        self.addPageTemplates([PageTemplate(id="handoff", frames=frame, onPage=self.draw_page)])

    def draw_page(self, canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor("#DDD7CE"))
        canvas.line(18 * mm, 13 * mm, 192 * mm, 13 * mm)
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(colors.HexColor("#77736D"))
        canvas.drawString(18 * mm, 9 * mm, "BioAro Drugs AI Model Handoff v2")
        canvas.drawRightString(192 * mm, 9 * mm, f"{doc.page}")
        canvas.restoreState()


def table_from_lines(lines, styles):
    rows = []
    for line in lines:
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
            continue
        rows.append([Paragraph(inline_markup(cell), styles["TableCell"]) for cell in cells])
    if not rows:
        return None
    table = Table(rows, repeatRows=1, hAlign="LEFT", colWidths=None)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F1EEE9")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#1F1D1A")),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D9D3CA")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return table


def build_story():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="TitleBio", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=23, leading=28, textColor=colors.HexColor("#171513"), spaceAfter=12))
    styles.add(ParagraphStyle(name="H1Bio", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=16, leading=20, textColor=colors.HexColor("#C6492A"), spaceBefore=15, spaceAfter=7, keepWithNext=True))
    styles.add(ParagraphStyle(name="H2Bio", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=11.5, leading=15, textColor=colors.HexColor("#28241F"), spaceBefore=10, spaceAfter=5, keepWithNext=True))
    styles.add(ParagraphStyle(name="BodyBio", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.7, leading=12.2, textColor=colors.HexColor("#47423C"), spaceAfter=5))
    styles.add(ParagraphStyle(name="BulletBio", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.6, leading=11.8, leftIndent=11, firstLineIndent=-7, bulletIndent=1, textColor=colors.HexColor("#47423C"), spaceAfter=3))
    styles.add(ParagraphStyle(name="CodeBio", parent=styles["Code"], fontName="Courier", fontSize=6.4, leading=8.1, textColor=colors.HexColor("#29251F"), backColor=colors.HexColor("#F4F1EC"), borderColor=colors.HexColor("#E0D9CF"), borderWidth=0.4, borderPadding=6, spaceBefore=4, spaceAfter=7))
    styles.add(ParagraphStyle(name="TableCell", parent=styles["BodyText"], fontName="Helvetica", fontSize=6.7, leading=8.7, textColor=colors.HexColor("#403B35")))
    styles.add(ParagraphStyle(name="SmallBio", parent=styles["BodyText"], fontName="Helvetica-Oblique", fontSize=7.4, leading=10, textColor=colors.HexColor("#77736D"), spaceAfter=5))

    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    story = []
    i = 0
    paragraph = []
    in_code = False
    code = []

    def flush_paragraph():
        nonlocal paragraph
        if paragraph:
            text = " ".join(part.strip() for part in paragraph).strip()
            if text:
                story.append(Paragraph(inline_markup(text), styles["BodyBio"]))
            paragraph = []

    while i < len(lines):
        line = lines[i]
        if line.startswith("```"):
            flush_paragraph()
            if in_code:
                story.append(Preformatted(ascii_text("\n".join(code)), styles["CodeBio"]))
                code = []
                in_code = False
            else:
                in_code = True
            i += 1
            continue
        if in_code:
            code.append(line)
            i += 1
            continue
        if not line.strip():
            flush_paragraph()
            i += 1
            continue
        if line.startswith("# "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(line[2:]), styles["TitleBio"]))
            i += 1
            continue
        if line.startswith("## "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(line[3:]), styles["H1Bio"]))
            i += 1
            continue
        if line.startswith("### "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(line[4:]), styles["H2Bio"]))
            i += 1
            continue
        if line.startswith("| ") or line.startswith("|"):
            flush_paragraph()
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i])
                i += 1
            table = table_from_lines(table_lines, styles)
            if table:
                story.append(table)
                story.append(Spacer(1, 5))
            continue
        if line.startswith("- ") or re.match(r"^\d+\. ", line):
            flush_paragraph()
            text = re.sub(r"^(-|\d+\.)\s+", "", line)
            story.append(Paragraph("- " + inline_markup(text), styles["BulletBio"]))
            i += 1
            continue
        if line.startswith("> "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(line[2:]), styles["SmallBio"]))
            i += 1
            continue
        if line.startswith("!["):
            flush_paragraph()
            match = re.match(r"!\[([^]]+)\]", line)
            if match:
                story.append(Paragraph("[Image reference: " + inline_markup(match.group(1)) + "]", styles["SmallBio"]))
            i += 1
            continue
        paragraph.append(line)
        i += 1
    flush_paragraph()
    return story


OUTPUT.parent.mkdir(parents=True, exist_ok=True)
doc = HandoffDocTemplate(str(OUTPUT), title="BioAro Drugs AI Model Handoff v2", author="BioAro Drugs")
doc.build(build_story())
print(OUTPUT)
