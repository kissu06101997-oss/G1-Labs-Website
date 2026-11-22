"""Create the optional two-page executive research brief."""
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph

root = Path(__file__).resolve().parents[2]
out = root / "EXECUTIVE_SUMMARY.pdf"
w, h = A4
ink = colors.HexColor("#172A2A")
muted = colors.HexColor("#425557")
accent = colors.HexColor("#0B6759")
paper = colors.HexColor("#F5F7F3")
border = colors.HexColor("#D8E1DA")
dark = colors.HexColor("#102F2B")

c = Canvas(str(out), pagesize=A4, pageCompression=1, invariant=True)
c.setTitle("AI Virtual Laboratories - Research brief")
c.setAuthor("Codex research team")
row = ParagraphStyle("row", fontName="Helvetica", fontSize=10.2, textColor=ink, leading=15, alignment=TA_LEFT)
sub = ParagraphStyle("sub", fontName="Helvetica", fontSize=9.0, textColor=muted, leading=13.2)

def para(text, x, top, width, style=row):
    p = Paragraph(text, style)
    _, ht = p.wrap(width, 400)
    p.drawOn(c, x, top - ht)
    return top - ht

def text_line(string, x, y, size, color=ink, font="Helvetica"):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, string)

def base(page, title, subtitle):
    c.setFillColor(paper)
    c.rect(0,0,w,h,stroke=0,fill=1)
    c.setFillColor(dark)
    c.rect(0,h-177,w,177,stroke=0,fill=1)
    text_line("ANDHRA PRADESH  /  RESEARCH BRIEF", 44, h-48, 9.5, colors.HexColor("#BFE0D4"), "Helvetica-Bold")
    text_line(title,44,h-91,29,colors.white,"Helvetica-Bold")
    text_line(subtitle,45,h-120,11.2,colors.HexColor("#E3F1E9"))
    text_line("22 November 2026 IST   /   Version 1.0",45,h-148,9.2,colors.HexColor("#BFE0D4"))
    c.setStrokeColor(border)
    c.line(44,41,w-44,41)
    text_line("AI Virtual Laboratories  |  Independent production research",44,26,8.5,muted)
    c.setFont("Helvetica-Bold",8.5)
    c.setFillColor(accent)
    c.drawRightString(w-44,26,f"{page} / 2")

def label(string, x, y):
    text_line(string,x,y,10.2,accent,"Helvetica-Bold")

def section(name, body, top):
    label(name,44,top)
    return para(body,44,top-12,w-88)-28

base(1,"AI Virtual Laboratories","One platform, three subject laboratories, two modes per activity")

cards=[("311","Public Labster listings","One additional same-title route"),("340","AP activity candidates","120 Chemistry / 130 Physics / 90 Biology"),("3","First subject slices","All three require independent review")]
cw = (w - 104)/3
for i,(value,title,detail) in enumerate(cards):
    x = 44 + i * (cw+8)
    c.setFillColor(colors.white)
    c.setStrokeColor(border)
    c.roundRect(x,h-282,cw,84,8,stroke=1,fill=1)
    text_line(value,x+12,h-225,22,accent,"Helvetica-Bold")
    text_line(title,x+12,h-243,9,ink,"Helvetica-Bold")
    para(detail,x+12,h-249,cw-24,sub)

y = h-313
y = section("THE PRODUCT", "One English/Telugu website with a separate reusable room for Chemistry, Physics and Biology. Simulation Mode guides a curricular practical with checkpoints and assessment. Experiment Mode lets students choose scientifically admitted variables and compare evidence and uncertainty. Both use the same apparatus, models and observations.", y)
y = section("THE FIRST MILESTONE", "Build the website first. Show all three hubs and verify all six subject/mode launches with neutral browser fixtures, scoped school roles, accessible controls, checkpoint/reload and one confirmed teacher result. Then validate browser integration, build the three environments, produce experiments, and test and deploy.", y)
y = section("WHAT THE PUBLISHED EVIDENCE SUPPORTS", "The study reconciled four indexed Labster catalogue pages and reviewed twelve published experiment cases. Labster gameplay, performance and authenticated dashboards were not observed. Four of ten retrieved current-edition textbook links yielded usable content. The three first activities are anchored to prior official editions.", y)
y = section("FIRST SUBJECT SLICES", "<b>Chemistry:</b> Activity 2.3, acid-metal observations and theoretical bounds.<br/><b>Physics:</b> Activity 9.10, parallel glass-slab ray geometry and calibration.<br/><b>Biology:</b> Activity 5.1, onion epidermis and calibrated microscopy data.", y)
assert y > 50
c.showPage()

base(2,"Production decisions","Browser delivery, scientific authority and government review")
y = h-217
y = section("RENDERING AND DATA", "Provisional baseline: Babylon.js/WebGL2, an accessible HTML equivalent, signed asset/model packages and a shared server action contract. Each subject has a versioned scientific adapter. The player renders accepted state and can preview eligible actions offline. The optional tutor explains or proposes bounded choices for student approval.", y)
y = section("CLASSROOM PERFORMANCE TARGETS", "Measure real 4, 8 and 16 GB devices across school network profiles. Initial 4 GB/720p targets are 33.3 ms p95 frame time, 66.7 ms p99, a 2 MB compressed shell and a 12 MB first scene. The REA control verified tool operation on a local research fixture. School hardware and Labster player performance remain unmeasured.", y)
y = section("OPERATING COST SCENARIOS", "Base planning estimates are approximately USD 2,441, USD 5,453 and USD 24,286 per month for 10,000, 100,000 and 1,000,000 registered users. These cases correspond to modeled peaks of 127, 1,265 and 12,650 simultaneous users. Estimates include support and reserve, with public list prices and pending throughput, tax and procurement checks.", y)
y = section("RELEASE GATES", "Confirm Andhra Pradesh textbook and Telugu bindings, admit each subject model and dataset, benchmark real school hardware, and complete privacy, accessibility and procurement review. Seek vendor permission before any private Labster observation and a written distribution decision if Unity is reconsidered.", y)
label("READ THE FULL HANDOFF",44,y)
para("MASTER_BLUEPRINT.md provides the decision register and navigation. MASTER_BLUEPRINT_FULL.md includes the standalone specification and contracts. The research ZIP includes source ledgers, catalogues, access evidence and integrity checks.",44,y-12,w-88)
assert y-60 > 47
c.showPage()
c.save()
print(out)

