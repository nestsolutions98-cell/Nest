// Global variables
let currentWeekStart = new Date();
let calendarView = 'week';
let currentCourseId = null;
let currentStudentId = null;
let allStudents = [];
let allCourses = [];
let allEnrollments = [];
let allCoaches = [];

// Tooltip element for calendar events
let calendarTooltip = null;

// --- Payment Participant Search ---
let selectedPaymentStudentId = null;
// --- Payment Course Search ---
let selectedPaymentCourseId = null;

function createCalendarTooltip() {
    if (!calendarTooltip) {
        calendarTooltip = document.createElement('div');
        calendarTooltip.className = 'calendar-event-tooltip';
        document.body.appendChild(calendarTooltip);
    }
}

// Translation dictionary
const translations = {
  en: {
    'Calendar': 'Calendar',
    'Courses': 'Courses',
    'Course': 'Course',
    'Students': 'Students',
    'Payments': 'Payments',
    'Analysis': 'Analysis',
    'Coaches': 'Coaches',
    'Add Coach': 'Add Coach',
    'Search coaches...': 'Search coaches...',
    'First Name': 'First Name',
    'Last Name': 'Last Name',
    'Duration (minutes)': 'Duration (minutes)',
    'Invoice': 'Invoice',
    'Add Course': 'Add Course',
    'Add Student': 'Add Student',
    'Add Payment': 'Add Payment',
    'Course Name': 'Course Name',
    'Teacher': 'Teacher',
    'Start Date': 'Start Date',
    'Time': 'Time',
    'Sessions Count': 'Sessions Count',
    'Weekdays': 'Weekdays',
    'Calendar Color': 'Calendar Color',
    'Weekly Calendar': 'Weekly Calendar',
    'Daily Calendar': 'Daily Calendar',
    'Week': 'Week',
    'Day': 'Day',
    'Today': 'Today',
    'Sunday': 'Sunday',
    'Monday': 'Monday',
    'Tuesday': 'Tuesday',
    'Wednesday': 'Wednesday',
    'Thursday': 'Thursday',
    'Friday': 'Friday',
    'Saturday': 'Saturday',
    'Save': 'Save',
    'Cancel': 'Cancel',
    'Create Course': 'Create Course',
    'Coach': 'Coach',
    'Participants': 'Participants',
    'Classes left': 'Classes left',
    'Search': 'Search',
    'Search courses...': 'Search courses...',
    'Search students...': 'Search students...',
    'English': 'English',
    'עברית': 'עברית',
    // Used in meetings log / modals
    'Date': 'Date',
    'ID': 'ID',
    'Age': 'Age',
    'years': 'years',
    'Notes': 'Notes',
    'Refresh': 'Refresh',
    'This Month': 'This Month',
    'Last 30 Days': 'Last 30 Days',
    'This Quarter': 'This Quarter',
    'This Year': 'This Year',
    'Custom Range': 'Custom Range',
    'Course Income': 'Course Income',
    'Coach Income': 'Coach Income',
    'Average Payment': 'Average Payment',
    'Total Payments': 'Total Payments',
    'Total Revenue': 'Total Revenue',
    'Income (₪)': 'Income (₪)',
    'Type to search...': 'Type to search...',
    'Search payments...': 'Search payments...',
    'Income': 'Income',
    'Phone': 'Phone',
    "Father's Name": "Father's Name",
    'Attendance': 'Attendance',
    'Save Attendance': 'Save Attendance',
    'No students enrolled in this course.': 'No students enrolled in this course.',
    'Not enrolled in any courses.': 'Not enrolled in any courses.',
    'Running Courses': 'Running Courses',
    'Total Students': 'Total Students',
    'Total Enrollments': 'Total Enrollments',
    'Unique Coaches': 'Unique Coaches',
    'Date of Birth': 'Date of Birth',
    'National ID (optional)': 'National ID (optional)',
    'Student Name': 'Student Name',
    'Month': 'Month',
    'Profile': 'Profile',
    'Search courses by name or teacher...': 'Search courses by name or teacher...',
    'Payment Method': 'Payment Method',
    'Amount': 'Amount',
    'Cash': 'Cash',
    'Check': 'Check',
    'Transfer': 'Transfer',
    'Select method...': 'Select method...',
    'Participant': 'Participant',
    'Export Payments': 'Export Payments',
    'Export Description': 'Export payment data to Excel for detailed analysis and reporting'
  },
  he: {
    'Calendar': 'לוח שנה',
    'Courses': 'קורסים',
    'Course': 'קןרס',
    'Date of Birth': 'תאריך לידה',
    'National ID (optional)': 'ת״ז (רשות)',
    "Father's Name": 'שם האב',
    'ID': 'ת"ז',
    'Student Name': 'שם התלמיד',
    'Age': 'גיל',
    'Type to search...': 'הקלד לחיפוש...',
    'Phone': 'מס טלפון',
    'Search payments...': 'חיפוש תשלומים...',
    'Create Course': 'צור קורס',
    'Daily Calendar': 'לוח יומי',
    'Week': 'שבוע',
    'Day': 'יום',
    'Duration (minutes)': 'משך (בדקות)',
    'years': 'שנים',
    'Month': 'חודש',
    'Students': 'תלמידים',
    'Payments': 'תשלומים',
    'Analysis': 'ניתוח',
    'Coaches': 'מאמנים',
    'Add Coach': 'הוסף מאמן',
    'Search coaches...': 'חפש מאמנים...',
    'First Name': 'שם פרטי',
    'Last Name': 'שם משפחה',
    'Invoice': 'חשבונית',
    'Add Course': 'הוסף קורס',
    'Add Student': 'הוסף תלמיד',
    'Add Payment': 'הוסף תשלום',
    'Course Name': 'שם הקורס',
    'Teacher': 'מדריך',
    'Start Date': 'תאריך התחלה',
    'Time': 'שעה',
    'Sessions Count': 'מספר מפגשים',
    'Weekdays': 'ימי השבוע',
    'Calendar Color': 'צבע לוח השנה',
    'Weekly Calendar': 'לוח שבועי',
    'Today': 'היום',
    'Sunday': 'ראשון',
    'Refresh': 'רענן',
    'This Month': 'חודש זה',
    'Last 30 Days': '30 הימים האחרונים',
    'This Quarter': 'רבעון זה',
    'This Year': 'שנה זו',
    'Custom Range': 'טווח מותאם',
    'Course Income': 'הכנסות לפי קורס',
    'Coach Income': 'הכנסות לפי מאמן',
    'Average Payment': 'תשלום ממוצע',
    'Total Payments': 'מספר תשלומים',
    'Total Revenue': 'סה״כ הכנסות',
    'Income (₪)': 'הכנסה (₪)',
    'Income': 'הכנסה',
    'Monday': 'שני',
    'Tuesday': 'שלישי',
    'Wednesday': 'רביעי',
    'Thursday': 'חמישי',
    'Friday': 'שישי',
    'Saturday': 'שבת',
    'Save': 'שמור',
    'Cancel': 'ביטול',
    'Coach': 'מאמן',
    'Participants': 'משתתפים',
    'Classes left': 'מפגשים שנותרו',
    'Search': 'חיפוש',
    'Search courses...': 'חפש קורסים...',
    'Search students...': 'חפש תלמידים...',
    'English': 'אנגלית',
    'עברית': 'עברית',
    // Meetings log / modals
    'Date': 'תאריך',
    'Notes': 'הערות',
    'Attendance': 'נוכחות',
    'Save Attendance': 'שמירת נוכחות',
    'No students enrolled in this course.': 'אין תלמידים רשומים בקורס זה.',
    'Not enrolled in any courses.': 'אינו רשום באף קורס.',
    'Running Courses': 'קורסים פעילים',
    'Total Students': 'סה״כ תלמידים',
    'Total Enrollments': 'סה״כ הרשמות',
    'Unique Coaches': 'מאמנים ייחודיים',
    'Profile': 'פרופיל',
    'Search courses by name or teacher...': 'חפש קורסים לפי שם או מדריך...',
    'Payment Method': 'אמצעי תשלום',
    'Amount': 'סכום',
    'Cash': 'מזומן',
    'Check': 'אשראי',
    'Transfer': 'העברה',
    'Select method...': 'בחירת דרך תשלום',
    'Participant': 'משתתף',
    'Export Payments': 'ייצוא תשלומים',
    'Export Description': 'ייצא נתוני תשלומים לאקסל לניתוח מפורט ודיווח'
  }
};


let currentLang = localStorage.getItem('lang') || 'en';

function t(key) {
    return translations[currentLang][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  // RTL only for Hebrew
  document.getElementById('mainBody').setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');

  // Toggle button: show the *other* language
  const btn = document.getElementById('langToggleBtn');
  if (btn) btn.textContent = (lang === 'he') ? 'English' : 'עברית';

  updateAllText();
  applyTranslations();

  // ▶︎ Re-render dynamic content that uses t(...)
  if (typeof renderCourses === 'function') renderCourses();
  if (typeof renderStudents === 'function') renderStudents();
  if (typeof renderPayments === 'function') renderPayments();

  // keep any active filters applied
  const cs = document.getElementById('courseSearch')?.value?.trim();
  if (cs && typeof filterCourses === 'function') filterCourses();

  const ss = document.getElementById('studentSearch')?.value?.trim();
  if (ss && typeof filterStudents === 'function') filterStudents();

  const ps = document.getElementById('paymentSearch')?.value?.trim();
  if (ps && typeof filterPayments === 'function') filterPayments();

  // Calendar needs a fresh render to localize month/day names
  if (typeof loadCalendarData === 'function') loadCalendarData();
}


function updateAllText() {
    // Update all static text elements by their data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    // Update tooltips in calendar
    document.querySelectorAll('.calendar-event .tooltip').forEach(tooltip => {
        const event = tooltip.parentElement.dataset.event;
        if (event) {
            const e = JSON.parse(event);
            tooltip.innerHTML = `<strong>${e.title}</strong><br>${t('Coach')}: ${e.teacher}<br>${t('Participants')}: ${e.enrolled_count}<br>${t('Classes left')}: ${e.classes_remaining}`;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('langToggleBtn').addEventListener('click', () => {
      setLang(currentLang === 'he' ? 'en' : 'he');
    });
    setLang(currentLang);
    initializeApp();
    // Populate monthOptions datalist with last 12 months
    const monthOptions = document.getElementById('monthOptions');
    if (monthOptions) {
        const now = new Date();
        let options = '';
        for (let i = 0; i < 12; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStr = d.toISOString().slice(0, 7);
            options += `<option value="${monthStr}">${monthStr}</option>`;
        }
        monthOptions.innerHTML = options;
    }
});

// Initialize the application
function initializeApp() {
    setupEventListeners();
    loadInitialData();
    setCurrentWeekStart();
    loadCalendarData();
}

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Calendar navigation
    document.getElementById('prevWeek').addEventListener('click', () => navigateWeek(-1));
    document.getElementById('nextWeek').addEventListener('click', () => navigateWeek(1));
    document.getElementById('today').addEventListener('click', goToToday);
    const viewSelect = document.getElementById('calendarViewSelect');
    if (viewSelect) {
        viewSelect.addEventListener('change', (e) => {
            calendarView = e.target.value;
            const titleEl = document.getElementById('calendarTitle');
            const key = calendarView === 'week' ? 'Weekly Calendar' : 'Daily Calendar';
            titleEl.dataset.i18n = key;
            titleEl.textContent = translations[currentLang][key] || key;
            goToToday();
        });
    }

    // Modal controls
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Add course
    document.getElementById('addCourseBtn').addEventListener('click', async () => {
        showModal('addCourseModal');
        try {
            // Ensure coaches are loaded for the teacher picker
            if (!Array.isArray(allCoaches) || allCoaches.length === 0) {
                await loadCoaches();
            }
        } catch (e) { console.warn('Could not pre-load coaches', e); }
        setupCourseTeacherPicker();
    });
    document.getElementById('addCourseForm').addEventListener('submit', handleAddCourse);

    // Add student
    document.getElementById('addStudentBtn').addEventListener('click', () => showModal('addStudentModal'));
    document.getElementById('addStudentForm').addEventListener('submit', handleAddStudent);

    // Student search
    document.getElementById('studentSearch').addEventListener('input', filterStudents);

    // Coaches tab controls (if present)
    const coachSearchEl = document.getElementById('coachSearch');
    if (coachSearchEl) coachSearchEl.addEventListener('input', filterCoaches);
    const addCoachBtn = document.getElementById('addCoachBtn');
    if (addCoachBtn) addCoachBtn.addEventListener('click', () => {
        showModal('addCoachModal');
        setTimeout(() => document.getElementById('coachFirstName')?.focus(), 0);
    });
    const addCoachForm = document.getElementById('addCoachForm');
    if (addCoachForm) addCoachForm.addEventListener('submit', handleAddCoach);

    // Course search
    document.getElementById('courseSearch').addEventListener('input', filterCourses);

    // Payment search
    document.getElementById('paymentSearch').addEventListener('input', filterPayments);

    // Analysis period change
    document.getElementById('analysisPeriod').addEventListener('change', loadAnalysis);
    document.getElementById('refreshAnalysis').addEventListener('click', loadAnalysis);

    // Add payment
    document.getElementById('addPaymentBtn').addEventListener('click', () => showModal('addPaymentModal'));
    if (document.getElementById('addPaymentFormMain')) {
        document.getElementById('addPaymentFormMain').addEventListener('submit', handleAddPayment);
    }
    if (document.getElementById('addPaymentFormStudent')) {
        document.getElementById('addPaymentFormStudent').addEventListener('submit', handleAddPayment);
    }
    console.log('addPaymentForm submit event listener attached');
    
    // Setup payment search functionality
    setupPaymentStudentSearch();
    setupPaymentCourseSearch();

    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Event delegation for animation and tooltip
    const container = document.getElementById('calendarContainer');
    container.addEventListener('click', function(e) {
        const el = e.target.closest('.calendar-event');
        if (el) {
            console.log('Calendar event CLICKED:', el.getAttribute('data-course-name'), el.getAttribute('data-course-id'));
            e.stopPropagation();
            el.classList.add('calendar-event-animate');
            setTimeout(() => {
                window.location.href = `/course/${el.getAttribute('data-course-id')}`;
            }, 180);
        }
    });
    container.addEventListener('mouseover', function(e) {
        const el = e.target.closest('.calendar-event');
        if (el) {
            console.log('Calendar event MOUSEOVER:', el.getAttribute('data-course-name'), el.getAttribute('data-course-id'));
            createCalendarTooltip();
            const name = el.getAttribute('data-course-name');
            const coach = el.getAttribute('data-coach');
            const meetings = el.getAttribute('data-meetings-left');
            calendarTooltip.innerHTML = `<strong>${name}</strong><br>Coach: ${coach}<br>Time: ${el.getAttribute('data-time')}<br>Meetings left: ${meetings}`;
            calendarTooltip.style.display = 'block';
            const rect = el.getBoundingClientRect();
            calendarTooltip.style.left = (rect.left + window.scrollX + rect.width/2 - 100) + 'px';
            calendarTooltip.style.top = (rect.top + window.scrollY - 60) + 'px';
        }
    });
    container.addEventListener('mouseout', function(e) {
        const el = e.target.closest('.calendar-event');
        if (el && calendarTooltip) {
            console.log('Calendar event MOUSEOUT:', el.getAttribute('data-course-name'), el.getAttribute('data-course-id'));
            calendarTooltip.style.display = 'none';
        }
    });

    // Export payments
    document.getElementById('exportPayments').addEventListener('click', exportPaymentsToExcel);
}

function loadInitialData() {
    loadCourses();
    loadStudents();
    loadEnrollments();
}

async function loadEnrollments() {
    try {
        const response = await fetch('/api/enrollments');
        allEnrollments = await response.json();
    } catch (error) {
        console.error('Error loading enrollments:', error);
        allEnrollments = [];
    }
}

function switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Show active content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    // Load data for the tab
    if (tabName === 'home') {
        loadCalendarData();
    } else if (tabName === 'courses') {
        // Always reload all data for summary
        Promise.all([
            loadCourses(),
            loadStudents(),
            loadEnrollments()
        ]).then(renderCoursesSummary);
    } else if (tabName === 'students') {
        renderStudents();
    } else if (tabName === 'payments') {
        // Ensure data is loaded so the search dropdowns work
        Promise.all([
            loadStudents(),
            loadCourses(),
            loadPayments()
        ]).then(() => {
            populatePaymentForm();
        });
    } else if (tabName === 'analysis') {
        loadAnalysis();
    } else if (tabName === 'other') {
        // Coaches tab
        loadCoaches();
    }
}

// Calendar Functions
function setCurrentWeekStart() {
    const today = new Date();
    if (calendarView === 'week') {
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek;
        currentWeekStart = new Date(today.setDate(diff));
    } else {
        currentWeekStart = today;
    }
}

function navigateWeek(direction) {
  // Flip behavior in Hebrew (RTL)
  const multiplier = (currentLang === 'he') ? -1 : 1;
  const step = calendarView === 'week' ? 7 : 1;
  currentWeekStart.setDate(currentWeekStart.getDate() + (direction * step * multiplier));
  loadCalendarData();
}

function goToToday() {
    setCurrentWeekStart();
    loadCalendarData();
}

function renderCalendar() {
    // Set the month/year header
    const monthHeader = document.getElementById('calendarMonthHeader');
    if (monthHeader) {
      const locale = (currentLang === 'he') ? 'he-IL' : 'en-US';
      if (calendarView === 'week') {
        const parts = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
          .formatToParts(currentWeekStart)
          .reduce((acc, p) => (acc[p.type] = p.value, acc), {});
        monthHeader.innerHTML = `<b>${parts.month}</b> <span class="font-normal">${parts.year}</span>`;
      } else {
        const formatted = new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric', year: 'numeric' }).format(currentWeekStart);
        monthHeader.innerHTML = `<b>${formatted}</b>`;
      }
    }

    createCalendarTooltip();
    const container = document.getElementById('calendarContainer');
    const weekStart = new Date(currentWeekStart);
    const daysToShow = calendarView === 'week' ? 7 : 1;
    
    // Generate time slots from 09:00 until midnight
    const timeSlots = [];
    const startHour = 9;
    const endHour = 24;
    for (let hour = startHour; hour < endHour; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    timeSlots.push('00:00');
    
    let html = `<div class="calendar-timeline-view" style="--days-to-show:${daysToShow};">`;
    
    // Header row with day names (localized)
    html += '<div class="calendar-header">';
    html += '<div class="timeline-header"></div>'; // Empty space for timeline column
    const locale = (currentLang === 'he') ? 'he-IL' : 'en-US';
    for (let dayIndex = 0; dayIndex < daysToShow; dayIndex++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(weekStart.getDate() + dayIndex);
        const dayName = currentDate.toLocaleDateString(locale, { weekday: 'long' });
        const dayNumber = currentDate.getDate();
        html += `<div class="day-header"><span class="day-name">${dayName}</span><span class="day-date">${dayNumber}</span></div>`;
    }
    html += '</div>';
    
    // Calendar body with timeline
    html += '<div class="calendar-body">';
    
    // Timeline column
    html += '<div class="timeline-column">';
    timeSlots.forEach(time => {
        html += `<div class="time-slot">${time}</div>`;
    });
    html += '</div>';
    
    // Day columns
    for (let dayIndex = 0; dayIndex < daysToShow; dayIndex++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(weekStart.getDate() + dayIndex);
        const dateStr = currentDate.toISOString().split('T')[0];

        html += `<div class="day-column ${isToday(currentDate) ? 'today' : ''}">`;

        // Time slots for this day
        timeSlots.forEach(time => {
            const dayEvents = getEventsForDateAndTime(dateStr, time);
            // Remove the dividing line between hour rows if any event continues
            const slotContinues = dayEvents.some(ev => !ev.isEnd);
            const multi = dayEvents.length > 1;
            // When multiple events occur in the same slot, lay them out side‑by‑side
            const containerStyle = multi ? 'flex-direction:row; align-items:stretch;' : '';
            html += `<div class="time-slot-content${slotContinues ? ' no-border' : ''}" style="${containerStyle}">`;
            if (dayEvents.length > 0) {
                const count = dayEvents.length;
                dayEvents.forEach((event, index) => {
                    // Rounded corners and borders on start/end to visually connect segments as one pill
                    const radiusClasses = event.isStart && event.isEnd
                        ? 'rounded-xl'
                        : event.isStart
                            ? 'rounded-t-xl'
                            : event.isEnd
                                ? 'rounded-b-xl'
                                : 'rounded-none';
                    const shadowClasses = (event.isStart || event.isEnd) ? 'shadow hover:shadow-lg' : 'shadow-none';

                    const borderTop    = event.isStart ? `border-top: 4px solid ${event.color};` : 'border-top: none;';
                    const borderBottom = event.isEnd   ? `border-bottom: 4px solid ${event.color};` : 'border-bottom: none;';
                    const borderSides  = `border-left: 4px solid ${event.color}; border-right: 4px solid ${event.color};`;

                    // Side-by-side layout sizing when multiple events share a slot
                    const widthPct = multi ? (100 / count) : 100;
                    const sideBySide = multi ? `width: calc(${widthPct}% - 4px); margin-inline-end: 4px;` : 'width:100%;';

                    html += `<div class="bg-white ${radiusClasses} ${shadowClasses} transition p-2 flex items-center justify-center calendar-event"
                        data-course-id="${event.id}"
                        data-course-name="${event.title}"
                        data-coach="${event.teacher}"
                        data-meetings-left="${event.classes_remaining}"
                        data-time="${event.time}"
                        style="${borderTop} ${borderBottom} ${borderSides} min-width:0; ${sideBySide} cursor:pointer; height:${event.segmentDuration}px; background:white; box-sizing:border-box;"
                        onclick="window.location.href='/course/${event.id}'"
                    >
                        ${event.isStart ? `<span class="font-bold text-sm text-gray-900 w-full block whitespace-nowrap overflow-hidden text-ellipsis text-center" style="line-height:1.2;">${event.title}</span>` : ''}
                    </div>`;
                });
            }
            html += `</div>`;
        });
        
        html += '</div>';
    }
    
    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;

    // Ensure day columns in the header line up with the scrollable body.
    // In RTL, the scrollbar is on the left, so pad the header on the left.
    const bodyEl = container.querySelector('.calendar-body');
    const headerEl = container.querySelector('.calendar-header');
    if (bodyEl && headerEl) {
        const scrollbarWidth = bodyEl.offsetWidth - bodyEl.clientWidth;
        const dir = document.getElementById('mainBody')?.getAttribute('dir') || 'ltr';
        // reset both sides first
        headerEl.style.paddingRight = '0px';
        headerEl.style.paddingLeft = '0px';
        if (scrollbarWidth > 0) {
            if (dir === 'rtl') {
                headerEl.style.paddingLeft = `${scrollbarWidth}px`;
            } else {
                headerEl.style.paddingRight = `${scrollbarWidth}px`;
            }
        }
    }
}

function getEventsForDateAndTime(dateStr, timeSlot) {
    if (!window.calendarEvents) return [];

    const [slotHour] = timeSlot.split(':');
    let hourValue = parseInt(slotHour, 10);
    if (timeSlot === '00:00' && hourValue === 0) {
        hourValue = 24;
    }
    const slotMinutes = hourValue * 60; // timeSlot like '13:00'
    return window.calendarEvents
        .filter(event => event.date === dateStr)
        .filter(event => {
            const [h, m] = event.time.split(':').map(Number);
            const start = h * 60 + m;
            return slotMinutes >= start && slotMinutes < start + event.duration;
        })
        .map(event => {
            const [h, m] = event.time.split(':').map(Number);
            const start = h * 60 + m;
            const minutesIntoEvent = slotMinutes - start;
            const remaining = event.duration - minutesIntoEvent;
            const blockDuration = Math.min(remaining, 60);
            const isStart = minutesIntoEvent === 0;
            const isEnd = remaining <= 60; // last segment for this event
            return { ...event, segmentDuration: blockDuration, isStart, isEnd };
        });
}

function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function getEventsForDate(dateStr) {
    // This will be populated when calendar data is loaded
    return window.calendarEvents ? window.calendarEvents.filter(event => event.date === dateStr) : [];
}

async function loadCalendarData() {
    try {
        const startDate = currentWeekStart.toISOString().split('T')[0];
        const url = calendarView === 'week'
            ? `/api/calendar/weekly?start_date=${startDate}`
            : `/api/calendar/daily?date=${startDate}`;
        const response = await fetch(url);
        const data = await response.json();
        window.calendarEvents = data;
        renderCalendar(); // Re-render to show events
    } catch (error) {
        console.error('Error loading calendar data:', error);
    }
}

// Course Functions
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        allCourses = await response.json();
        renderCourses();
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function renderCourses() {
  const container = document.getElementById('coursesList');

  if (allCourses.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No courses found. Add your first course!</div>';
    return;
  }

  container.innerHTML = allCourses.map(course => `
    <div class="course-card cursor-pointer" onclick="window.location.href='/course/${course.id}'">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <!-- color dot + title -->
          <div class="flex items-center mb-2 gap-2">
            <span class="w-4 h-4 rounded-full" style="background-color: ${course.color}"></span>
            <h3 class="text-lg font-semibold text-gray-900">${course.name}</h3>
          </div>

          <!-- details with icon/text spacing -->
          <div class="text-sm text-gray-600 space-y-1">
            <p class="flex items-center gap-2"><i class="fas fa-user"></i><span>${course.teacher}</span></p>
            <p class="flex items-center gap-2"><i class="fas fa-clock"></i><span>${course.time}</span></p>
            <p class="flex items-center gap-2"><i class="fas fa-calendar"></i><span>${formatDate(course.start_date)} - ${formatDate(course.end_date)}</span></p>
          </div>
        </div>

        <!-- actions with spacing -->
        <div class="flex gap-2">
          <button onclick="event.stopPropagation(); deleteCourse(${course.id})"
                  class="btn btn-danger btn-sm inline-flex items-center gap-2"
                  aria-label="Delete course">
            <i class="fas fa-trash"></i><span></span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}


function filterCourses() {
  const searchTerm = document.getElementById('courseSearch').value.toLowerCase();
  const filteredCourses = allCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm) ||
    course.teacher.toLowerCase().includes(searchTerm)
  );

  const container = document.getElementById('coursesList');

  if (filteredCourses.length === 0) {
    if (searchTerm === '') {
      container.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No courses found. Add your first course!</div>';
    } else {
      container.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No courses found matching your search.</div>';
    }
    return;
  }

  container.innerHTML = filteredCourses.map(course => `
    <div class="course-card cursor-pointer" onclick="window.location.href='/course/${course.id}'">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <!-- color dot + title -->
          <div class="flex items-center mb-2 gap-2">
            <span class="w-4 h-4 rounded-full" style="background-color: ${course.color}"></span>
            <h3 class="text-lg font-semibold text-gray-900">${course.name}</h3>
          </div>

          <!-- details with icon/text spacing -->
          <div class="text-sm text-gray-600 space-y-1">
            <p class="flex items-center gap-2"><i class="fas fa-user"></i><span>${course.teacher}</span></p>
            <p class="flex items-center gap-2"><i class="fas fa-clock"></i><span>${course.time}</span></p>
            <p class="flex items-center gap-2"><i class="fas fa-calendar"></i><span>${formatDate(course.start_date)} - ${formatDate(course.end_date)}</span></p>
          </div>
        </div>

        <!-- actions with spacing -->
        <div class="flex gap-2">
          <button onclick="event.stopPropagation(); deleteCourse(${course.id})"
                  class="btn btn-danger btn-sm inline-flex items-center gap-2"
                  aria-label="Delete course">
            <i class="fas fa-trash"></i><span></span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}


async function handleAddCourse(e) {
    e.preventDefault();
    // Collect selected weekdays (Sunday=0, Monday=1, etc.)
    const selectedWeekdays = [];
    for (let i = 0; i <= 6; i++) {
        const checkbox = document.getElementById(`weekday${i}`);
        if (checkbox.checked) {
            selectedWeekdays.push(i);
        }
    }
    if (selectedWeekdays.length === 0) {
        alert('Please select at least one weekday');
        return;
    }
    // Get selected color from radio group
    const color = document.querySelector('input[name="courseColor"]:checked').value;
    const teacherInput = document.getElementById('courseTeacher');
    const teacherName = teacherInput.value.trim();
    // Require picking an existing coach
    const coachMatch = (allCoaches || []).find(c => (`${c.first_name} ${c.last_name}`.trim().toLowerCase() === teacherName.toLowerCase()));
    if (!coachMatch) {
        alert('Please select a coach from the list.');
        teacherInput.focus();
        return;
    }

    const formData = {
      name: document.getElementById('courseName').value,
      teacher: `${coachMatch.first_name} ${coachMatch.last_name}`.trim(),
      start_date: document.getElementById('courseStartDate').value,
      time: document.getElementById('courseTime').value,
      duration: parseInt(document.getElementById('courseDuration').value),
      sessions_count: parseInt(document.getElementById('courseSessionsCount').value),
      // sessions_per_week is derived on the server from weekdays
      weekdays: selectedWeekdays.join(','),
      color: color
    };
    try {
        const response = await fetch('/api/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            closeAllModals();
            document.getElementById('addCourseForm').reset();
            // Uncheck all weekdays
            for (let i = 0; i <= 6; i++) {
                document.getElementById(`weekday${i}`).checked = false;
            }
            // Reset color to default (first radio)
            document.getElementById('courseColor1').checked = true;
            await loadCourses();
            await loadEnrollments();
            renderCoursesSummary();
            renderCalendar();
        } else {
            alert('Error creating course');
        }
    } catch (error) {
        console.error('Error creating course:', error);
        alert('Error creating course');
    }
}

async function deleteCourse(courseId) {
    console.log('Attempting to delete course:', courseId);
    const course = allCourses.find(c => c.id === courseId);
    if (!course) {
        console.error('Course not found:', courseId);
        return;
    }
    
    const courseName = course.name || 'this course';
    if (!confirm(`Are you sure you want to delete "${courseName}"?\n\nThis will also delete:\n• All student enrollments in this course\n• All payments for this course\n• All course meetings and attendance records\n\nThis action cannot be undone.`)) return;
    
    console.log('User confirmed deletion of course:', courseName);
    
    try {
        console.log('Sending DELETE request to:', `/api/courses/${courseId}`);
        const response = await fetch(`/api/courses/${courseId}`, {
            method: 'DELETE'
        });
        
        console.log('Delete response status:', response.status);
        
        if (response.ok) {
            console.log('Course deleted successfully, reloading data...');
            await loadCourses();
            await loadEnrollments();
            renderCoursesSummary();
            renderCalendar();
        } else {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error || 'Error deleting course';
            console.error('Delete failed:', errorMessage);
            alert(`Error deleting course: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course: ' + error.message);
    }
}

// Student Functions
async function loadStudents() {
    try {
        const response = await fetch('/api/students');
        allStudents = await response.json();
        renderStudents();
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

// Coaches view (aggregated from courses/enrollments/payments)
async function loadCoaches() {
    try {
        const resp = await fetch('/api/coaches');
        allCoaches = await resp.json();
        renderCoaches();
    } catch (err) {
        console.error('Error loading coaches:', err);
        allCoaches = [];
        renderCoaches();
    }
}

function renderCoaches() {
    const container = document.getElementById('coachesList');
    if (!container) return;
    if (!Array.isArray(allCoaches) || allCoaches.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-500 py-8">No coaches found. Add your first coach!</div>';
        return;
    }
    container.innerHTML = allCoaches.map(coach => `
      <div class="student-card cursor-pointer" onclick="window.location.href='/coach/${coach.id}'">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">${coach.first_name} ${coach.last_name}</h3>
            <div class="text-sm text-gray-600 space-y-1">
              <p class="flex items-center gap-2"><i class="fas fa-phone"></i><span>${coach.phone || ''}</span></p>
            </div>
          </div>

          <div class="flex gap-2">
            <button onclick="event.stopPropagation(); sendWhatsAppToCoach('${coach.phone || ''}')"
                    class="btn btn-success btn-sm inline-flex items-center gap-2" aria-label="WhatsApp">
              <i class="fab fa-whatsapp"></i><span></span>
            </button>
            <button onclick="event.stopPropagation(); deleteCoach(${coach.id})"
                    class="btn btn-danger btn-sm inline-flex items-center gap-2" aria-label="Delete">
              <i class="fas fa-trash"></i><span></span>
            </button>
          </div>
        </div>
      </div>
    `).join('');
}

function filterCoaches() {
    const input = document.getElementById('coachSearch');
    if (!input) return;
    const term = input.value.toLowerCase();
    const filtered = (allCoaches || []).filter(c =>
        (c.first_name + ' ' + c.last_name).toLowerCase().includes(term) ||
        (c.phone || '').includes(term)
    );
    const container = document.getElementById('coachesList');
    if (filtered.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-500 py-8">No coaches found matching your search.</div>';
        return;
    }
    container.innerHTML = filtered.map(coach => `
      <div class="student-card cursor-pointer" onclick="window.location.href='/coach/${coach.id}'">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">${coach.first_name} ${coach.last_name}</h3>
            <div class="text-sm text-gray-600 space-y-1">
              <p class="flex items-center gap-2"><i class="fas fa-phone"></i><span>${coach.phone || ''}</span></p>
            </div>
          </div>
          <div class="flex gap-2">
            <button onclick="event.stopPropagation(); sendWhatsAppToCoach('${coach.phone || ''}')"
                    class="btn btn-success btn-sm inline-flex items-center gap-2" aria-label="WhatsApp">
              <i class="fab fa-whatsapp"></i><span></span>
            </button>
            <button onclick="event.stopPropagation(); deleteCoach(${coach.id})"
                    class="btn btn-danger btn-sm inline-flex items-center gap-2" aria-label="Delete">
              <i class="fas fa-trash"></i><span></span>
            </button>
          </div>
        </div>
      </div>
    `).join('');
}

// Helpers for coach actions
function viewCoachCourses(encodedName) {
    const name = decodeURIComponent(encodedName);
    switchTab('courses');
    const input = document.getElementById('courseSearch');
    if (input) {
        input.value = name;
        filterCourses();
    }
}

function addCourseForCoach(encodedName) {
    const name = decodeURIComponent(encodedName);
    showModal('addCourseModal');
    const teacherEl = document.getElementById('courseTeacher');
    if (teacherEl) teacherEl.value = name;
    setTimeout(() => teacherEl?.focus(), 0);
}

// Coach CRUD helpers
async function handleAddCoach(e) {
    e.preventDefault();
    const first = document.getElementById('coachFirstName').value.trim();
    const last = document.getElementById('coachLastName').value.trim();
    const phone = document.getElementById('coachPhone').value.trim();
    if (!first || !last || !phone) {
        alert('Please fill in all fields.');
        return;
    }
    try {
        const resp = await fetch('/api/coaches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name: first, last_name: last, phone })
        });
        if (resp.ok) {
            document.getElementById('addCoachForm').reset();
            closeAllModals();
            await loadCoaches();
        } else {
            const data = await resp.json().catch(() => ({}));
            alert(data.error || 'Error creating coach');
        }
    } catch (err) {
        console.error('Error creating coach:', err);
        alert('Error creating coach');
    }
}

async function deleteCoach(id) {
    if (!confirm('Are you sure you want to delete this coach?')) return;
    try {
        const resp = await fetch(`/api/coaches/${id}`, { method: 'DELETE' });
        if (resp.ok) {
            await loadCoaches();
        } else {
            alert('Error deleting coach');
        }
    } catch (err) {
        console.error('Error deleting coach:', err);
        alert('Error deleting coach');
    }
}

function sendWhatsAppToCoach(phone) { return sendWhatsAppToStudent(phone); }

function renderStudents() {
  const container = document.getElementById('studentsList');

  if (allStudents.length === 0) {
    container.innerHTML = '<div class="text-center text-gray-500 py-8">No students found. Add your first student!</div>';
    return;
  }

  container.innerHTML = allStudents.map(student => `
    <div class="student-card cursor-pointer" onclick="window.location.href='/student/${student.id}'">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900">${student.first_name} ${student.fathers_name}</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <p class="flex items-center gap-2"><i class="fas fa-phone"></i><span>${student.phone}</span></p>
            <p class="flex items-center gap-2">
              <i class="fas fa-id-card"></i><span>${t('ID')}: ${student.national_id ?? '—'}</span>
            </p>
            <p class="flex items-center gap-2">
              <i class="fas fa-birthday-cake"></i><span>${t('Age')}: ${student.age} ${t('years')}</span>
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <button onclick="event.stopPropagation(); sendWhatsAppToStudent('${student.phone}')"
                  class="btn btn-success btn-sm inline-flex items-center gap-2" aria-label="WhatsApp">
            <i class="fab fa-whatsapp"></i><span></span>
          </button>
          <button onclick="event.stopPropagation(); deleteStudent(${student.id})"
                  class="btn btn-danger btn-sm inline-flex items-center gap-2" aria-label="Delete">
            <i class="fas fa-trash"></i><span></span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}


function filterStudents() {
  const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
  const filteredStudents = allStudents.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm) ||
    student.fathers_name.toLowerCase().includes(searchTerm) ||
    student.phone.includes(searchTerm) ||
    (student.national_id || '').includes(searchTerm)
  );

  const container = document.getElementById('studentsList');
  if (filteredStudents.length === 0) {
    container.innerHTML = '<div class="text-center text-gray-500 py-8">No students found matching your search.</div>';
    return;
  }

  container.innerHTML = filteredStudents.map(student => `
    <div class="student-card cursor-pointer" onclick="window.location.href='/student/${student.id}'">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900">${student.first_name} ${student.fathers_name}</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <p class="flex items-center gap-2"><i class="fas fa-phone"></i><span>${student.phone}</span></p>
            <p class="flex items-center gap-2">
              <i class="fas fa-id-card"></i><span>${t('ID')}: ${student.national_id ?? '—'}</span>
            </p>
            <p class="flex items-center gap-2">
              <i class="fas fa-birthday-cake"></i><span>${t('Age')}: ${student.age} ${t('years')}</span>
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <button onclick="event.stopPropagation(); sendWhatsAppToStudent('${student.phone}')"
                  class="btn btn-success btn-sm inline-flex items-center gap-2" aria-label="WhatsApp">
            <i class="fab fa-whatsapp"></i><span></span>
          </button>
          <button onclick="event.stopPropagation(); deleteStudent(${student.id})"
                  class="btn btn-danger btn-sm inline-flex items-center gap-2" aria-label="Delete">
            <i class="fas fa-trash"></i><span></span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}


async function handleAddStudent(e) {
    e.preventDefault();
    
    const formData = {
        first_name: document.getElementById('studentFirstName').value,
        fathers_name: document.getElementById('studentFathersName').value,
        phone: document.getElementById('studentPhone').value,
        date_of_birth: document.getElementById('studentDateOfBirth').value,
        national_id: (document.getElementById('studentNationalId').value.trim() || null)
    };
    
    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            closeAllModals();
            document.getElementById('addStudentForm').reset();
            await loadStudents();
        } else {
            alert('Error creating student');
        }
    } catch (error) {
        console.error('Error creating student:', error);
        alert('Error creating student');
    }
}

async function deleteStudent(studentId) {
    console.log('Attempting to delete student:', studentId);
    const student = allStudents.find(s => s.id === studentId);
    if (!student) {
        console.error('Student not found:', studentId);
        return;
    }
    
    const studentName = `${student.first_name} ${student.fathers_name}`;
    if (!confirm(`Are you sure you want to delete "${studentName}"?\n\nThis will also delete:\n• All course enrollments for this student\n• All payment records for this student\n• All attendance records for this student\n\nThis action cannot be undone.`)) return;
    
    console.log('User confirmed deletion of student:', studentName);
    
    try {
        console.log('Sending DELETE request to:', `/api/students/${studentId}`);
        const response = await fetch(`/api/students/${studentId}`, {
            method: 'DELETE'
        });
        
        console.log('Delete response status:', response.status);
        
        if (response.ok) {
            console.log('Student deleted successfully, reloading data...');
            await loadStudents();
        } else {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error || 'Error deleting student';
            console.error('Delete failed:', errorMessage);
            alert(`Error deleting student: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student: ' + error.message);
    }
}

// Course Modal Functions
async function showCourseModal(courseId) {
    currentCourseId = courseId;
    const course = allCourses.find(c => c.id === courseId);
    
    if (!course) return;
    
    document.getElementById('courseModalTitle').textContent = course.name;
    document.getElementById('courseModalCoach').textContent = course.teacher;
    document.getElementById('courseModalTime').textContent = course.time;
    
    await loadCourseStudents(courseId);
    showModal('courseModal');
}

async function loadCourseStudents(courseId) {
    try {
        const response = await fetch(`/api/courses/${courseId}/students`);
        const students = await response.json();
        
        const container = document.getElementById('courseStudentsList');
        if (students.length === 0) {
            container.innerHTML = '<p class="text-gray-500">No students enrolled in this course.</p>';
            return;
        }
        
        container.innerHTML = students.map(student => `
            <div class="flex justify-between items-center p-2 border-b border-gray-200 cursor-pointer" onclick="window.location.href='/student/${student.id}'">
                <div>
                    <div class="font-semibold">${student.first_name} ${student.fathers_name}</div>
                    <div class="text-sm text-gray-600">${student.phone}</div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="event.stopPropagation(); removeStudentFromCourse(${student.id})" class="btn btn-danger btn-sm" title="Remove from course">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading course students:', error);
    }
}

// Student Profile Functions
async function showStudentProfile(studentId) {
    // Ensure the Students tab is active so the modal is visible
    switchTab('students');
    currentStudentId = studentId;
    try {
        const [studentResponse, paymentsResponse] = await Promise.all([
            fetch(`/api/students/${studentId}`),
            fetch(`/api/students/${studentId}/payments`)
        ]);
        const student = await studentResponse.json();
        const payments = await paymentsResponse.json();
        document.getElementById('studentProfileTitle').textContent = `${student.first_name} ${student.fathers_name}`;
        const content = document.getElementById('studentProfileContent');
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-semibold mb-3">Student Information</h4>
                    <div class="space-y-2 text-sm">
                        <p><strong>Name:</strong> ${student.first_name} ${student.fathers_name}</p>
                        <p><strong>Phone:</strong> ${student.phone}</p>
                        <p><strong>National ID:</strong> ${student.national_id}</p>
                        <p><strong>Age:</strong> ${student.age} years</p>
                        <p><strong>Date of Birth:</strong> ${formatDate(student.date_of_birth)}</p>
                    </div>
                </div>
                <div>
                    <h4 class="font-semibold mb-3">Payment History</h4>
                    <div class="max-h-40 overflow-y-auto">
                        ${payments.length > 0 ? 
                            payments.map(payment => `<div class="text-sm p-2 bg-gray-100 rounded mb-1">${payment.month}</div>`).join('') :
                            '<p class="text-gray-500">No payments recorded</p>'
                        }
                    </div>
                    <button onclick="addPayment('${student.id}')" class="btn btn-primary mt-2">
                        <i class="fas fa-plus mr-1"></i>Add Payment
                    </button>
                </div>
            </div>
            <div class="mt-6">
                <h4 class="font-semibold mb-3">Enrolled Courses</h4>
                <div id="studentCoursesList"></div>
            </div>
            <div class="mt-6 flex space-x-2">
                <button onclick="sendWhatsAppToStudent('${student.phone}')" class="btn btn-success">
                    <i class="fab fa-whatsapp mr-2"></i>Send WhatsApp Message
                </button>
                <button onclick="deleteStudent(${student.id})" class="btn btn-danger">
                    <i class="fas fa-trash mr-2"></i>Delete Student
                </button>
            </div>
        `;
        loadStudentCourses(studentId);
        showModal('studentProfileModal');
    } catch (error) {
        console.error('Error loading student profile:', error);
    }
}

async function loadStudentCourses(studentId) {
    try {
        const response = await fetch(`/api/students/${studentId}/courses`);
        const courses = await response.json();
        
        const container = document.getElementById('studentCoursesList');
        if (courses.length === 0) {
            container.innerHTML = '<p class="text-gray-500">Not enrolled in any courses.</p>';
            return;
        }
        
        container.innerHTML = courses.map(course => `
            <div class="p-2 border border-gray-200 rounded mb-2">
                <div class="font-semibold">${course.name}</div>
                <div class="text-sm text-gray-600">Coach: ${course.teacher}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading student courses:', error);
    }
}

// WhatsApp Functions
function sendWhatsAppToStudent(phone) {
    const message = prompt('Enter your message:');
    if (message) {
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Modal Functions
function showModal(modalId) {
    console.log('showModal called', modalId);
    document.getElementById(modalId).classList.remove('hidden');
    if (modalId === 'addPaymentModal') {
        // Reset payment form and clear selections
        if (document.getElementById('addPaymentFormMain')) {
            const form = document.getElementById('addPaymentFormMain');
            form.reset();
            // Remove previous event listener if any
            form.onsubmit = null;
            form.addEventListener('submit', handleAddPayment);
            console.log('addPaymentFormMain submit event listener attached (on modal open)');
        }
        if (document.getElementById('addPaymentFormStudent')) {
            const form = document.getElementById('addPaymentFormStudent');
            form.reset();
            form.onsubmit = null;
            form.addEventListener('submit', handleAddPayment);
            console.log('addPaymentFormStudent submit event listener attached (on modal open)');
        }
        // Ensure data for search dropdowns is loaded
        const needsStudents = !allStudents || allStudents.length === 0;
        const needsCourses  = !allCourses  || allCourses.length === 0;
        if (needsStudents || needsCourses) {
            Promise.all([
                needsStudents ? loadStudents() : Promise.resolve(),
                needsCourses  ? loadCourses()  : Promise.resolve()
            ]).then(() => {
                populatePaymentForm();
            });
        } else {
            populatePaymentForm();
        }
        selectedPaymentStudentId = null;
        selectedPaymentCourseId = null;
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}


// Utility Functions
function formatPaymentMethod(method) {
  if (!method) return '—';
  const m = String(method).toLowerCase();
  if (m === 'cash')     return t('Cash');
  if (m === 'check')    return t('Check');
  if (m === 'transfer') return t('Transfer');
  // fallback – capitalize first letter
  return m.charAt(0).toUpperCase() + m.slice(1);
}


// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  const locale = (currentLang === 'he') ? 'he-IL' : 'en-US';
  return date.toLocaleDateString(locale);
}


function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const icon = document.querySelector('#darkModeToggle i');
    if (document.body.classList.contains('dark')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Add missing functions
async function addPayment(studentId) {
    const month = prompt('Enter month (YYYY-MM format):');
    if (!month) return;
    
    const amount = prompt('Enter amount:');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        alert('Please enter a valid amount.');
        return;
    }
    
    const paymentMethod = prompt('Enter payment method (cash/check/transfer):');
    if (!paymentMethod || !['cash', 'check', 'transfer'].includes(paymentMethod.toLowerCase())) {
        alert('Please enter a valid payment method: cash, check, or transfer.');
        return;
    }
    
    // Get the first course for this student (you might want to show a course selector)
    try {
        const coursesResponse = await fetch(`/api/students/${studentId}/courses`);
        const courses = await coursesResponse.json();
        
        if (courses.length === 0) {
            alert('Student is not enrolled in any courses.');
            return;
        }
        
        const courseId = courses[0].id; // Use first course, or you could show a selector
        
        const response = await fetch('/api/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_id: parseInt(studentId),
                course_id: courseId,
                month: month,
                amount: parseFloat(amount),
                payment_method: paymentMethod.toLowerCase()
            })
        });
        
        if (response.ok) {
            showStudentProfile(studentId); // Refresh the profile
        } else {
            alert('Error adding payment');
        }
    } catch (error) {
        console.error('Error adding payment:', error);
        alert('Error adding payment');
    }
}

async function removeStudentFromCourse(studentId) {
    if (!confirm('Are you sure you want to remove this student from the course?')) return;
    
    try {
        const response = await fetch(`/api/enrollments/${studentId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadCourseStudents(currentCourseId);
        } else {
            alert('Error removing student from course');
        }
    } catch (error) {
        console.error('Error removing student from course:', error);
        alert('Error removing student from course');
    }
}

// Payment Functions
let allPayments = [];
let coachIncomeChart = null;
let courseIncomeChart = null;

async function loadPayments() {
    try {
        const response = await fetch('/api/payments');
        allPayments = await response.json();
        renderPayments();
    } catch (error) {
        console.error('Error loading payments:', error);
    }
}

function renderPayments() {
  const container = document.getElementById('paymentsList');
  if (allPayments.length === 0) {
    container.innerHTML = '<div class="text-center text-gray-500 py-8">No payments found. Add your first payment!</div>';
    return;
  }

  container.innerHTML = allPayments.map(payment => `
    <div class="payment-card">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900">${payment.student_name}</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <p class="flex items-center gap-2">
              <i class="fas fa-dumbbell"></i>
              <span>${t('Course') ? t('Course') + ': ' : 'Course: '}${payment.course_name}</span>
            </p>
            <p class="flex items-center gap-2">
              <i class="fas fa-user"></i>
              <span>${t('Coach') ? t('Coach') + ': ' : 'Coach: '}${payment.teacher_name}</span>
            </p>
            <p class="flex items-center gap-2">
              <i class="fas fa-calendar"></i>
              <span>${t('Month') ? t('Month') + ': ' : 'Month: '}${payment.month}</span>
            </p>
            <p class="flex items-center gap-2">
              <i class="fas fa-money-bill-wave"></i>
              <span>${t('Payment Method') ? t('Payment Method') + ': ' : 'Payment Method: '}${formatPaymentMethod(payment.payment_method)}</span>
            </p>
            <p class="flex items-center gap-2 payment-date">
              <i class="fas fa-clock"></i>
              <span>${t('Date') ? t('Date') + ': ' : 'Date: '}${payment.payment_date}</span>
            </p>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2">
          <div class="payment-amount">₪${payment.amount.toFixed(2)}</div>
          <div class="flex gap-2">
            <button onclick="generateInvoice(${payment.id})"
                    class="btn btn-success btn-sm inline-flex items-center gap-2">
              <i class="fas fa-file-invoice"></i><span>${t('Invoice')}</span>
            </button>
            <button onclick="deletePayment(${payment.id})"
                    class="btn btn-danger btn-sm inline-flex items-center gap-2" aria-label="Delete payment">
              <i class="fas fa-trash"></i><span></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}


function filterPayments() {
  const searchTerm = document.getElementById('paymentSearch').value.toLowerCase();
  const filtered = allPayments.filter(p =>
    p.student_name.toLowerCase().includes(searchTerm) ||
    p.course_name.toLowerCase().includes(searchTerm) ||
    p.teacher_name.toLowerCase().includes(searchTerm) ||
    (p.month || '').toLowerCase().includes(searchTerm) ||
    (p.payment_method || '').toLowerCase().includes(searchTerm)
  );

  const container = document.getElementById('paymentsList');
  if (filtered.length === 0) {
    container.innerHTML = '<div class="text-center text-gray-500 py-8">No payments found matching your search.</div>';
    return;
  }

  container.innerHTML = filtered.map(payment => `
    <div class="payment-card">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900">${payment.student_name}</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <p class="flex items-center gap-2">
              <i class="fas fa-dumbbell"></i>
              <span>${t('Course') ? t('Course') + ': ' : 'Course: '}${payment.course_name}</span>
            </p>
            <p class="flex items-center gap-2">
              <i class="fas fa-user"></i>
              <span>${t('Coach') ? t('Coach') + ': ' : 'Coach: '}${payment.teacher_name}</span>
            </p>
            <p class="flex items-center gap-2">
              <i class="fas fa-calendar"></i>
              <span>${t('Month') ? t('Month') + ': ' : 'Month: '}${payment.month}</span>
            </p>
            <p class="flex items-center gap-2">
              <i class="fas fa-money-bill-wave"></i>
              <span>${t('Payment Method') ? t('Payment Method') + ': ' : 'Payment Method: '}${formatPaymentMethod(payment.payment_method)}</span>
            </p>
            <p class="flex items-center gap-2 payment-date">
              <i class="fas fa-clock"></i>
              <span>${t('Date') ? t('Date') + ': ' : 'Date: '}${payment.payment_date}</span>
            </p>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2">
          <div class="payment-amount">₪${payment.amount.toFixed(2)}</div>
          <div class="flex gap-2">
            <button onclick="generateInvoice(${payment.id})"
                    class="btn btn-success btn-sm inline-flex items-center gap-2">
              <i class="fas fa-file-invoice"></i><span>${t('Invoice')}</span>
            </button>
            <button onclick="deletePayment(${payment.id})"
                    class="btn btn-danger btn-sm inline-flex items-center gap-2" aria-label="Delete payment">
              <i class="fas fa-trash"></i><span></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}


async function handleAddPayment(e) {
  e.preventDefault();
  const form = e.target;

  const month  = form.querySelector('#paymentMonth')?.value || document.getElementById('paymentMonth')?.value;
  const amount = form.querySelector('#paymentAmount')?.value || document.getElementById('paymentAmount')?.value;

  // read chosen student & course (already set via your search pickers)
  const studentId = selectedPaymentStudentId;
  const courseId  = selectedPaymentCourseId;

  // NEW: read payment method (supports either id or name to avoid duplicate-id issues)
  const methodEl = form.querySelector('#paymentMethod, select[name="payment_method"]')
                || document.getElementById('paymentMethod');
  const payment_method = methodEl ? methodEl.value : '';

  if (!studentId) return alert('Please select a participant from the dropdown.');
  if (!courseId)  return alert('Please select a course from the dropdown.');
  if (!month)     return alert('Please select a month.');
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    return alert('Please enter a valid amount.');
  }
  if (!payment_method) {
    return alert('Please select a payment method.');
  }

  const formData = {
    student_id: parseInt(studentId),
    course_id: parseInt(courseId),
    month: month,
    amount: parseFloat(amount),
    payment_method // <-- NEW
  };

  try {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      const newPayment = await response.json();
      closeAllModals();
      const formMain   = document.getElementById('addPaymentFormMain');
      const formStudent= document.getElementById('addPaymentFormStudent');
      if (formMain) formMain.reset();
      if (formStudent) formStudent.reset();
      selectedPaymentStudentId = null;
      selectedPaymentCourseId  = null;
      // Optimistically add the new payment card without a full reload
      if (Array.isArray(allPayments)) {
        allPayments.unshift(newPayment);
        renderPayments();
      } else {
        await loadPayments();
      }
      await loadAnalysis();
    } else {
      alert('Error creating payment');
    }
  } catch (err) {
    console.error('Error creating payment:', err);
    alert('Error creating payment');
  }
}


async function deletePayment(paymentId) {
    if (!confirm('Are you sure you want to delete this payment?')) return;
    
    try {
        const response = await fetch(`/api/payments/${paymentId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadPayments();
            await loadAnalysis();
        } else {
            alert('Error deleting payment');
        }
    } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Error deleting payment');
    }
}

async function generateInvoice(paymentId) {
  try {
    // Prefer real Green Invoice (server will error if not configured)
    const resp = await fetch(`/api/green-invoice/${paymentId}`, { method: 'POST' });
    const data = await resp.json();
    if (!resp.ok || data.error) {
      console.warn('Green Invoice failed or not configured:', data);
      return legacyPreviewInvoice(paymentId);
    }
    if (data.url) {
      window.open(data.url, '_blank');
      return;
    }
    if (data.pdf) {
      const w = window.open('');
      w.document.write(`<iframe width="100%" height="100%" src="data:application/pdf;base64,${data.pdf}"></iframe>`);
      return;
    }
    alert('Invoice created. Document ID: ' + (data.docId || 'unknown'));
  } catch (e) {
    console.error('Error creating Green Invoice', e);
    return legacyPreviewInvoice(paymentId);
  }
}

async function legacyPreviewInvoice(paymentId) {
  try {
    const response = await fetch(`/api/invoice/${paymentId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const invoice = await response.json();
    const methodDisplay = formatPaymentMethod(invoice.payment_method);
    const win = window.open('', '_blank');
    if (!win) return alert('Unable to open new tab. Please allow popups.');
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${invoice.invoice_number}</title>
      <style>body{font-family:Arial,sans-serif;margin:40px;background:#f9f9f9}.invoice-container{max-width:800px;margin:0 auto;background:#fff;padding:40px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}.invoice-header{text-align:center;margin-bottom:30px;border-bottom:2px solid #3B82F6;padding-bottom:20px}.invoice-header h1{color:#3B82F6;margin:0}.invoice-header h2{color:#666;margin:10px 0 0}.invoice-details p{margin:8px 0}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{border:1px solid #ddd;padding:12px;text-align:left}th{background:#f8f9fa;font-weight:bold}.total{font-weight:bold;font-size:1.2em;background:#f8f9fa}.print-btn{background:#3B82F6;color:#fff;border:none;padding:10px 20px;border-radius:4px;cursor:pointer;margin-top:20px}.print-btn:hover{background:#2563EB}</style>
      </head><body>
      <div class="invoice-container">
        <div class="invoice-header"><h1>INVOICE</h1><h2>${invoice.invoice_number}</h2></div>
        <div class="invoice-details">
          <p><strong>Date:</strong> ${invoice.payment_date}</p>
          <p><strong>Student:</strong> ${invoice.student_name}</p>
          <p><strong>Course:</strong> ${invoice.course_name}</p>
          <p><strong>Coach:</strong> ${invoice.teacher_name}</p>
          <p><strong>Payment Method:</strong> ${methodDisplay}</p>
          <p><strong>Month:</strong> ${invoice.month}</p>
        </div>
        <table><tr><th>Description</th><th>Amount</th></tr>
          <tr><td>Course Payment - ${invoice.course_name}</td><td>${invoice.amount_text}</td></tr>
          <tr class="total"><td>Total</td><td>${invoice.amount_text}</td></tr>
        </table>
        <button class="print-btn" onclick="window.print()">Print Invoice</button>
      </div>
      </body></html>`);
    win.document.close();
  } catch (err) {
    console.error('Legacy preview failed', err);
    alert('Error generating invoice');
  }
}

// Analysis Functions
async function loadAnalysis() {
    const period = document.getElementById('analysisPeriod').value;
    await Promise.all([
        loadCoachIncomeChart(period),
        loadCourseIncomeChart(period),
        loadAnalysisSummary(period)
    ]);
}

async function loadCoachIncomeChart(period) {
    try {
        // Reset the canvas
        const oldCanvas = document.getElementById('coachIncomeChart');
        const parent = oldCanvas.parentNode;
        const newCanvas = oldCanvas.cloneNode(false);
        parent.replaceChild(newCanvas, oldCanvas);
        
        const response = await fetch(`/api/analysis/coach-income?period=${period}`);
        const data = await response.json();
        
        const ctx = newCanvas.getContext('2d');
        
        if (coachIncomeChart) {
            coachIncomeChart.destroy();
        }
        
        coachIncomeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.teacher),
                datasets: [{
                    label: 'Income (₪)',
                    data: data.map(item => item.total_income),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₪' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Income: ₪' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading coach income chart:', error);
    }
}

async function loadCourseIncomeChart(period) {
    try {
        // Reset the canvas
        const oldCanvas = document.getElementById('courseIncomeChart');
        const parent = oldCanvas.parentNode;
        const newCanvas = oldCanvas.cloneNode(false);
        parent.replaceChild(newCanvas, oldCanvas);
        
        const response = await fetch(`/api/analysis/course-income?period=${period}`);
        const data = await response.json();
        
        const ctx = newCanvas.getContext('2d');
        
        if (courseIncomeChart) {
            courseIncomeChart.destroy();
        }
        
        courseIncomeChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(item => item.course_name),
                datasets: [{
                    data: data.map(item => item.total_income),
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return context.label + ': ₪' + context.parsed.toLocaleString() + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading course income chart:', error);
    }
}

async function loadAnalysisSummary(period) {
    try {
        const response = await fetch(`/api/analysis/summary?period=${period}`);
        const data = await response.json();
        
        document.getElementById('totalRevenue').textContent = '₪' + data.total_revenue.toLocaleString();
        document.getElementById('totalPayments').textContent = data.total_payments.toLocaleString();
        document.getElementById('averagePayment').textContent = '₪' + data.average_payment.toFixed(2);
    } catch (error) {
        console.error('Error loading analysis summary:', error);
    }
}

// Global flag to prevent multiple simultaneous exports
let isExporting = false;

async function exportPaymentsToExcel() {
    // Prevent multiple simultaneous exports
    if (isExporting) {
        return;
    }
    
    isExporting = true;
    
    try {
        // Show loading state
        const exportBtn = document.getElementById('exportPayments');
        const originalText = exportBtn.innerHTML;
        const originalClasses = exportBtn.className;
        
        exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Exporting...';
        exportBtn.disabled = true;
        exportBtn.className = originalClasses + ' btn-exporting';

        // Get current period filter
        const period = document.getElementById('analysisPeriod').value;

        // Fetch the Excel file with period filter
        const response = await fetch(`/api/payments/export?period=${period}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the blob from the response
        const blob = await response.blob();
        
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        // Get filename from response headers or use default
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'payments.xlsx';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }
        
        a.download = filename;
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success state
        exportBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Exported!';
        exportBtn.disabled = false;
        exportBtn.className = originalClasses + ' btn-exported';
        
        // Reset to original state after 2 seconds
        setTimeout(() => {
            exportBtn.innerHTML = originalText;
            exportBtn.className = originalClasses;
            isExporting = false;
        }, 2000);
        
    } catch (error) {
        console.error('Error exporting payments:', error);
        
        // Show error state briefly
        const exportBtn = document.getElementById('exportPayments');
        exportBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Error!';
        exportBtn.disabled = false;
        exportBtn.className = originalClasses + ' btn-danger';
        
        // Reset to original state after 3 seconds
        setTimeout(() => {
            exportBtn.innerHTML = originalText;
            exportBtn.className = originalClasses;
            isExporting = false;
        }, 3000);
        
        // Show error message
        alert('Error exporting payments: ' + error.message);
    }
}

async function populatePaymentForm() {
    // Setup participant and course search
    setupPaymentStudentSearch();
    setupPaymentCourseSearch();
}

// Update translation logic to handle data-i18n-placeholder for input placeholders
function applyTranslations() {
  const lang = currentLang; // was: getCurrentLang()

  // Text nodes (labels, headings, buttons, etc.)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const translated = translations[lang] && translations[lang][key];
    if (translated) el.textContent = translated; // leave as-is if missing
  });

  // Placeholders (inputs / textareas)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const translated = translations[lang] && translations[lang][key];
    if (translated) el.setAttribute('placeholder', translated);
  });

  // (Optional) aria-labels for icons/controls
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.dataset.i18nAriaLabel;
    const translated = translations[lang] && translations[lang][key];
    if (translated) el.setAttribute('aria-label', translated);
  });

  // (Optional) title tooltips
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.dataset.i18nTitle;
    const translated = translations[lang] && translations[lang][key];
    if (translated) el.setAttribute('title', translated);
  });
}


// --- Meetings Log ---
async function fetchMeetings(courseId) {
    const res = await fetch(`/api/courses/${courseId}/meetings`);
    return await res.json();
}

async function renderMeetingsLog(courseId, students) {
    const meetings = await fetchMeetings(courseId);
    const container = document.getElementById('meetingsList');
    container.innerHTML = '';
    meetings.forEach(meeting => {
        const meetingDiv = document.createElement('div');
        meetingDiv.className = 'mb-4 p-4 bg-gray-50 rounded shadow';
        meetingDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <span class="font-semibold" data-i18n="Date">Date</span>: ${meeting.date}
                    <span class="ml-4 font-semibold" data-i18n="Notes">Notes</span>: ${meeting.notes || ''}
                </div>
                <button class="btn btn-primary openAttendanceBtn" data-meeting-id="${meeting.id}" data-i18n="Attendance">Attendance</button>
            </div>
            <div class="attendanceForm mt-4 hidden"></div>
        `;
        container.appendChild(meetingDiv);
    });
    // Add event listeners for attendance buttons
    container.querySelectorAll('.openAttendanceBtn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const meetingId = this.getAttribute('data-meeting-id');
            const meeting = meetings.find(m => m.id == meetingId);
            const formDiv = this.closest('div').nextElementSibling;
            if (!formDiv.classList.contains('hidden')) {
                formDiv.classList.add('hidden');
                return;
            }
            // Render attendance form
            formDiv.innerHTML = `<form class="attendanceSaveForm">
                ${meeting.attendance.map(a => `
                    <div class="flex items-center mb-2">
                        <input type="checkbox" class="mr-2 attendanceCheckbox" data-student-id="${a.student_id}" ${a.present ? 'checked' : ''}>
                        <span>${a.student_name}</span>
                    </div>
                `).join('')}
                <button type="submit" class="btn btn-success mt-2" data-i18n="Save Attendance">Save Attendance</button>
            </form>`;
            formDiv.classList.remove('hidden');
            // Save attendance handler
            formDiv.querySelector('.attendanceSaveForm').onsubmit = async function(e) {
                e.preventDefault();
                const attendance = Array.from(formDiv.querySelectorAll('.attendanceCheckbox')).map(cb => ({
                    student_id: parseInt(cb.getAttribute('data-student-id')),
                    present: cb.checked
                }));
                await fetch(`/api/meetings/${meetingId}/attendance`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({attendance})
                });
                alert('Attendance saved!');
                formDiv.classList.add('hidden');
            };
        });
    });
}

async function addMeeting(courseId) {
    const date = prompt('Enter meeting date (YYYY-MM-DD):', new Date().toISOString().slice(0,10));
    if (!date) return;
    await fetch(`/api/courses/${courseId}/meetings`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({date})
    });
    await renderMeetingsLog(courseId);
}

// Hook into course page rendering
async function afterCoursePageRender(courseId, students) {
    if (document.getElementById('meetingsLogSection')) {
        await renderMeetingsLog(courseId, students);
        document.getElementById('addMeetingBtn').onclick = () => addMeeting(courseId);
    }
}

// --- Add Meeting Modal Logic ---
function showAddMeetingModal() {
    // Set default date to today
    document.getElementById('meetingDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('meetingNotes').value = '';
    // Populate students
    const container = document.getElementById('attendanceStudentsList');
    if (!enrolledStudents || enrolledStudents.length === 0) {
        container.innerHTML = '<p class="text-gray-500" data-i18n="No students enrolled in this course.">No students enrolled in this course.</p>';
    } else {
        container.innerHTML = enrolledStudents.map(student => `
            <div class="flex items-center mb-2">
                <input type="checkbox" class="mr-2 attendanceStudentCheckbox" data-student-id="${student.id}" checked>
                <span>${student.first_name} ${student.fathers_name}</span>
            </div>
        `).join('');
    }
    showModal('addMeetingModal');
}

function setupAddMeetingModalEvents() {
    document.getElementById('addMeetingBtn').onclick = showAddMeetingModal;
    document.getElementById('saveMeetingBtn').onclick = async function() {
        const date = document.getElementById('meetingDate').value;
        const notes = document.getElementById('meetingNotes').value;
        const attendance = Array.from(document.querySelectorAll('.attendanceStudentCheckbox')).map(cb => ({
            student_id: parseInt(cb.getAttribute('data-student-id')),
            present: cb.checked
        }));
        if (!date) {
            alert('Please select a date');
            return;
        }
        // Create meeting
        const res = await fetch(`/api/courses/${courseId}/meetings`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({date, notes})
        });
        if (!res.ok) {
            alert('Error creating meeting');
            return;
        }
        const meeting = await res.json();
        // Save attendance
        await fetch(`/api/meetings/${meeting.id}/attendance`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({attendance})
        });
        closeAllModals();
        await renderMeetingsLog(courseId, enrolledStudents);
    };
    // Close modal on cancel or X
    document.querySelectorAll('#addMeetingModal .close-modal').forEach(btn => {
        btn.onclick = closeAllModals;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('addMeetingModal')) {
        setupAddMeetingModalEvents();
    }
});

// Ensure global access for inline onclick handlers in Students tab
window.showStudentProfile = showStudentProfile;
window.deleteStudent = deleteStudent;
window.showEditStudentModal = showEditStudentModal;
// Add any other student-related functions used in inline onclicks here if needed

// Animation and navigation logic
window.animateAndGoToCourse = function(e, courseId, el) {
    e.stopPropagation();
    el.classList.add('calendar-event-animate');
    setTimeout(() => {
        window.location.href = `/course/${courseId}`;
    }, 180); // Match animation duration
};

// Tooltip logic
window.showCalendarTooltip = function(e, el) {
    createCalendarTooltip();
    const name = el.getAttribute('data-course-name');
    const coach = el.getAttribute('data-coach');
    const meetings = el.getAttribute('data-meetings-left');
    calendarTooltip.innerHTML =
  `<strong>${name}</strong><br>${t('Coach')}: ${coach}<br>${t('Time')}: ${el.getAttribute('data-time')}<br>${t('Classes left')}: ${meetings}`;
    calendarTooltip.style.display = 'block';
    // Position tooltip near mouse
    const rect = el.getBoundingClientRect();
    calendarTooltip.style.left = (rect.left + window.scrollX + rect.width/2 - 100) + 'px';
    calendarTooltip.style.top = (rect.top + window.scrollY - 60) + 'px';
};
window.hideCalendarTooltip = function() {
    if (calendarTooltip) calendarTooltip.style.display = 'none';
};

// Add CSS for animation and tooltip (inject if not present)
(function addCalendarAnimationCSS() {
    if (document.getElementById('calendar-anim-css')) return;
    const style = document.createElement('style');
    style.id = 'calendar-anim-css';
    style.innerHTML = `
    .calendar-event-animate {
        animation: calendarEventClickAnim 0.18s cubic-bezier(.4,2.2,.6,1) 1;
    }
    @keyframes calendarEventClickAnim {
        0% { transform: scale(1); box-shadow: 0 0 0 rgba(59,130,246,0.0); }
        60% { transform: scale(1.08); box-shadow: 0 4px 16px rgba(59,130,246,0.18); }
        100% { transform: scale(1); box-shadow: 0 0 0 rgba(59,130,246,0.0); }
    }
    .calendar-event-tooltip {
        background: #1f2937;
        color: #fff;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 0.95em;
        min-width: 180px;
        max-width: 260px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.18);
        pointer-events: none;
        opacity: 0.97;
        position: absolute;
        z-index: 99999;
        left: 0;
        top: 0;
        transition: opacity 0.15s;
    }
    `;
    document.head.appendChild(style);
})(); 

function renderCoursesSummary() {
    // Compute running courses
    const today = new Date();
    const runningCourses = allCourses.filter(course => {
        const start = new Date(course.start_date);
        const end = new Date(course.end_date);
        return start <= today && today <= end;
    }).length;
    // Total students
    const totalStudents = allStudents.length;
    // Total enrollments
    const totalEnrollments = allEnrollments.length;
    // Unique coaches
    const uniqueCoaches = new Set(allCourses.map(c => c.teacher)).size;
    // Update DOM
    document.getElementById('summaryRunningCourses').textContent = runningCourses;
    document.getElementById('summaryTotalStudents').textContent = totalStudents;
    document.getElementById('summaryTotalEnrollments').textContent = totalEnrollments;
    document.getElementById('summaryUniqueCoaches').textContent = uniqueCoaches;
}
// Patch loadCourses and loadStudents to call renderCoursesSummary after both are loaded
const _origLoadCourses = loadCourses;
loadCourses = async function() {
    await _origLoadCourses.apply(this, arguments);
    await loadEnrollments();
    renderCoursesSummary();
};
const _origLoadStudents = loadStudents;
loadStudents = async function() {
    await _origLoadStudents.apply(this, arguments);
    await loadEnrollments();
    renderCoursesSummary();
}; 


function setupPaymentStudentSearch() {
    const input = document.getElementById('paymentStudentInput');
    const dropdown = document.getElementById('paymentStudentDropdown');
    input.addEventListener('input', function() {
        const term = input.value.toLowerCase();
        if (!term) {
            dropdown.innerHTML = '';
            dropdown.classList.add('hidden');
            selectedPaymentStudentId = null;
            return;
        }
        const matches = allStudents.filter(s =>
            s.first_name.toLowerCase().includes(term) ||
            s.fathers_name.toLowerCase().includes(term) ||
            s.phone.includes(term) ||
            s.national_id.includes(term)
        );
        if (matches.length === 0) {
            dropdown.innerHTML = '<div class="p-2 text-gray-500">No matches found</div>';
            dropdown.classList.remove('hidden');
            selectedPaymentStudentId = null;
            return;
        }
        dropdown.innerHTML = matches.map(s =>
            `<div class='p-2 hover:bg-blue-100 cursor-pointer' data-id='${s.id}'>${s.first_name} ${s.fathers_name} <span class='text-xs text-gray-400'>${s.phone}</span></div>`
        ).join('');
        dropdown.classList.remove('hidden');
        Array.from(dropdown.children).forEach(child => {
            child.onclick = function() {
                input.value = this.textContent;
                selectedPaymentStudentId = this.getAttribute('data-id');
                dropdown.classList.add('hidden');
            };
        });
    });
    input.addEventListener('blur', function() {
        setTimeout(() => dropdown.classList.add('hidden'), 200);
    });
} 


function setupPaymentCourseSearch() {
    const input = document.getElementById('paymentCourseInput');
    const dropdown = document.getElementById('paymentCourseDropdown');
    input.addEventListener('input', function() {
        const term = input.value.toLowerCase();
        if (!term) {
            dropdown.innerHTML = '';
            dropdown.classList.add('hidden');
            selectedPaymentCourseId = null;
            return;
        }
        const matches = allCourses.filter(c =>
            c.name.toLowerCase().includes(term) ||
            c.teacher.toLowerCase().includes(term)
        );
        if (matches.length === 0) {
            dropdown.innerHTML = '<div class="p-2 text-gray-500">No matches found</div>';
            dropdown.classList.remove('hidden');
            selectedPaymentCourseId = null;
            return;
        }
        dropdown.innerHTML = matches.map(c =>
            `<div class='p-2 hover:bg-blue-100 cursor-pointer' data-id='${c.id}'>${c.name} <span class='text-xs text-gray-400'>${c.teacher}</span></div>`
        ).join('');
        dropdown.classList.remove('hidden');
        Array.from(dropdown.children).forEach(child => {
            child.onclick = function() {
                input.value = this.textContent;
                selectedPaymentCourseId = this.getAttribute('data-id');
                dropdown.classList.add('hidden');
            };
        });
    });
    input.addEventListener('blur', function() {
        setTimeout(() => dropdown.classList.add('hidden'), 200);
    });
}

// Coach picker for Add Course modal (typeahead dropdown)
function setupCourseTeacherPicker() {
    const input = document.getElementById('courseTeacher');
    const dropdown = document.getElementById('courseTeacherDropdown');
    if (!input || !dropdown) return;

    // Clear any previous selection text
    // input.value = '' // keep existing text if any

    const buildList = (term) => {
        const t = (term || '').toLowerCase();
        const items = (allCoaches || []).filter(c =>
            `${c.first_name} ${c.last_name}`.toLowerCase().includes(t) ||
            (c.phone || '').includes(t)
        );
        if (items.length === 0) {
            dropdown.innerHTML = '<div class="p-2 text-gray-500">No matches found</div>';
            dropdown.classList.remove('hidden');
            return;
        }
        dropdown.innerHTML = items.map(c => {
            const name = `${c.first_name} ${c.last_name}`.trim();
            return `<div class='p-2 hover:bg-blue-100 cursor-pointer' data-name='${name.replace(/'/g, "&#39;")}' data-id='${c.id}'>${name} <span class='text-xs text-gray-400'>${c.phone || ''}</span></div>`;
        }).join('');
        dropdown.classList.remove('hidden');
        Array.from(dropdown.children).forEach(child => {
            child.onclick = function() {
                input.value = this.getAttribute('data-name');
                dropdown.classList.add('hidden');
            };
        });
    };

    // Avoid duplicate listeners by cloning input listeners is heavy; use one-time flag
    if (!input.dataset.pickerBound) {
        input.addEventListener('input', function() {
            const term = input.value.trim();
            if (!term) {
                dropdown.innerHTML = '';
                dropdown.classList.add('hidden');
                return;
            }
            // Ensure we have latest coaches list
            if (!Array.isArray(allCoaches) || allCoaches.length === 0) {
                loadCoaches().then(() => buildList(term));
            } else {
                buildList(term);
            }
        });
        input.addEventListener('blur', function() {
            setTimeout(() => dropdown.classList.add('hidden'), 200);
        });
        input.dataset.pickerBound = '1';
    }
}
