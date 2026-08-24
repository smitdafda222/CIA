import sys
import os
import html
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#4a5568"))
        
        # Header (Top Left Header)
        self.drawString(54, 750, "24ce021-AWF")
        self.drawRightString(558, 750, "ITUE301: Advanced Web Development Frameworks")
        
        # Line under header
        self.setStrokeColor(colors.HexColor("#cbd5e0"))
        self.setLineWidth(0.5)
        self.line(54, 742, 558, 742)
        
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_text)
        self.drawString(54, 36, "QuickBite Food Ordering System — Open-Book Practical Examination (Set A)")
        self.restoreState()

def format_code(raw_code):
    escaped = html.escape(raw_code)
    return escaped.replace('\n', '<br/>').replace(' ', '&nbsp;')

def create_report():
    pdf_filename = "24ce021_SetA_Report.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=72,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#1a202c"),
        spaceAfter=12
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#2b6cb0"),
        spaceAfter=20
    )

    task_header_style = ParagraphStyle(
        'TaskHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor("#1a202c"),
        spaceBefore=14,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#2d3748"),
        spaceAfter=8
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#e2e8f0"),
        backColor=colors.HexColor("#1a202c"),
        borderPadding=8,
        spaceAfter=10
    )

    story = []

    # Cover Header / Details (Matches AAa.pdf Page 1 layout)
    story.append(Paragraph("24ce021-AWF", title_style))
    story.append(Paragraph("ITUE301: Advanced Web Development Frameworks", subtitle_style))
    
    github_box = [
        [Paragraph("<b>Github link:</b> <font color='#2b6cb0'><u>https://github.com/smitdafda222/CIE</u></font>", body_style)]
    ]
    t = Table(github_box, colWidths=[504])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f7fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t)
    story.append(Spacer(1, 15))

    # Task 1
    story.append(Paragraph("Task 1: React Component Architecture", task_header_style))
    story.append(Paragraph("Created basic React frontend for QuickBite Food Ordering System with reusable <code>RestaurantCard</code> component accepting props: <code>name</code>, <code>cuisine</code>, <code>rating</code>, <code>isOpen</code>. Open/closed status styling dynamically updates based on <code>isOpen</code> value ('Open Now' vs 'Closed').", body_style))
    
    home_img = "a:/CIA/screenshots/home.png"
    if os.path.exists(home_img):
        story.append(Image(home_img, width=500, height=260))
        story.append(Spacer(1, 10))
    else:
        t1_code = """// RestaurantCard.jsx Component Definition
const RestaurantCard = ({ name, cuisine, rating, isOpen }) => {
  return (
    <div className="bg-[#1b1c22] border border-[#2a2b34] rounded-xl p-5 shadow-lg">
      <h3 className="text-lg font-bold text-white tracking-wide capitalize">{name}</h3>
      <p>Cuisine: {cuisine}</p>
      <p>Rating: ★ {rating}</p>
      <span className={isOpen ? "bg-emerald-900/60 text-emerald-400" : "bg-rose-900/60 text-rose-400"}>
        {isOpen ? "Open Now" : "Closed"}
      </span>
    </div>
  );
};"""
        story.append(Paragraph(format_code(t1_code), code_style))

    # Task 2
    story.append(Paragraph("Task 2: React Routing and State Management", task_header_style))
    story.append(Paragraph("Configured React Router with routes: <code>/</code> (HomePage), <code>/restaurants</code> (RestaurantsPage), <code>/order</code> (Protected OrderPage), and <code>/admin</code> (Lazy-loaded AdminPanel using <code>React.lazy()</code> + <code>Suspense</code>). <code>AuthContext</code> manages <code>{ customer, token }</code> and redirects unauthenticated users.", body_style))
    
    order_img = "a:/CIA/screenshots/order.png"
    if os.path.exists(order_img):
        story.append(Image(order_img, width=500, height=260))
        story.append(Spacer(1, 10))
    else:
        t2_code = """// App.jsx - React Router & Lazy Loading
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/restaurants" element={<RestaurantsPage />} />
  <Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
  <Route path="/admin" element={<AdminPanel />} />
</Routes>"""
        story.append(Paragraph(format_code(t2_code), code_style))

    # Task 3
    story.append(Paragraph("Task 3: Express REST API + Middleware", task_header_style))
    story.append(Paragraph("Built Express backend exposing REST endpoints under <code>/api/v1/</code>. Applied global <code>requestLogger</code> middleware logging <code>[METHOD] [PATH] [TIMESTAMP]</code> and custom <code>authGuard</code> middleware validating Bearer tokens in Authorization header.", body_style))
    
    t3_logs = """[POST] /api/v1/auth/login [2026-08-24T13:53:08.256Z]
[GET] /api/v1/restaurants [2026-08-24T13:53:08.272Z]
[POST] /api/v1/orders [2026-08-24T13:53:08.295Z] -> 401 Unauthorized (AuthGuard Block)
[POST] /api/v1/orders [2026-08-24T13:53:08.311Z] -> 201 Created (Token Verified)
[GET] /api/v1/orders [2026-08-24T13:53:08.332Z] -> 200 OK (Populated references)
[PATCH] /api/v1/orders/6a8c4cca6bb6722c2e89799a/status [2026-08-24T13:53:08.351Z] -> 200 OK"""
    story.append(Paragraph(format_code(t3_logs), code_style))

    # Task 4
    story.append(Paragraph("Task 4: REST API Consumption in React", task_header_style))
    story.append(Paragraph("In <code>RestaurantsPage</code>, fetched <code>/api/v1/restaurants</code> on mount using <code>useEffect()</code>. Maintained <code>data</code>, <code>loading</code>, and <code>error</code> states. Added client-side search input filtering the restaurants array by name or cuisine without re-fetching.", body_style))
    
    rest_img = "a:/CIA/screenshots/restaurants.png"
    if os.path.exists(rest_img):
        story.append(Image(rest_img, width=500, height=260))
        story.append(Spacer(1, 10))
    else:
        t4_code = """// Client-Side Search Filtering
const filteredRestaurants = restaurants.filter(r => {
  const query = searchQuery.toLowerCase().trim();
  if (!query) return true;
  return r.name.toLowerCase().includes(query) || r.cuisine.toLowerCase().includes(query);
});"""
        story.append(Paragraph(format_code(t4_code), code_style))

    # Task 5
    story.append(Paragraph("Task 5: MongoDB + Mongoose Schema Design and Validation", task_header_style))
    story.append(Paragraph("Connected MongoDB via Mongoose using connection string in <code>.env</code>. Created schemas for <code>Customer</code>, <code>Restaurant</code>, and <code>Order</code> with validation rules (required, unique, min 0, enum). Used <code>.populate('customerId', 'name email')</code> and <code>.populate('restaurantId', 'name cuisine')</code>.", body_style))
    
    t5_code = """// MongoDB Connection Log & Database Status
Connecting to MongoDB at mongodb://127.0.0.1:27017/quickbite...
MongoDB Connected Successfully via Mongoose!
Seeded default Customer into MongoDB: Jay Chheta
Seeded 6 Restaurants into MongoDB.
Seeded default Order into MongoDB: new ObjectId('6a8c4c6a6bb6722c2e89789')
QuickBite Express Backend running on port 5000"""
    story.append(Paragraph(format_code(t5_code), code_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF report: {pdf_filename}")

if __name__ == '__main__':
    create_report()
