(function () {
  'use strict';

  // --- Minimal i18n (EN/HE) ---
  const translations = {
    en: {
      'Sports Club Management': 'Sports Club Management',
      'Course Profile': 'Course Profile',
      'Back': 'Back',
      'Coach': 'Coach',
      'Sessions': 'Sessions',
      'Meetings Left': 'Meetings Left',
      'Enrolled Students': 'Enrolled Students',
      'Start': 'Start',
      'End': 'End',
      'Enroll Students': 'Enroll Students',
      'Search students...': 'Search students...',
      'No students enrolled yet.': 'No students enrolled yet.',
      'Meetings Log': 'Meetings Log',
      'meetings': 'meetings',
      'Add Meeting': 'Add Meeting',
      'No notes': 'No notes',
      'Edit': 'Edit',
      'Delete': 'Delete',
      'attended': 'attended',
      'total students': 'total students',
      'No meetings scheduled yet.': 'No meetings scheduled yet.',
      'Click "Add Meeting" to schedule the first session.': 'Click "Add Meeting" to schedule the first session.',
      'Add Meeting & Attendance': 'Add Meeting & Attendance',
      'Edit Meeting & Attendance': 'Edit Meeting & Attendance',
      'Date': 'Date',
      'Notes': 'Notes',
      'Mark Attendance': 'Mark Attendance',
      'Cancel': 'Cancel',
      'Save Changes': 'Save Changes',
      'Available Students': 'Available Students',
      'Search available students...': 'Search available students...',
      'No available students to enroll.': 'No available students to enroll.',
      'Enroll Selected': 'Enroll Selected',
      'Unenroll student': 'Unenroll student',
      'Phone:': 'Phone:',
      'Age:': 'Age:',
      // runtime messages
      'Are you sure you want to unenroll {name} from this course?':
        'Are you sure you want to unenroll {name} from this course?',
      'Student not found in this course.': 'Student not found in this course.',
      'Failed to add meeting.': 'Failed to add meeting.',
      'Failed to update meeting.': 'Failed to update meeting.',
      'Failed to load available students.': 'Failed to load available students.',
      'Please select at least one student to enroll.': 'Please select at least one student to enroll.',
      'Failed to enroll students. Please try again.': 'Failed to enroll students. Please try again.',
      'Failed to unenroll student. Please try again.': 'Failed to unenroll student. Please try again.'
      , 'Are you sure you want to delete this meeting?': 'Are you sure you want to delete this meeting?'
    },
    he: {
      'Sports Club Management': 'Sports Club Management',
      'Course Profile': 'פרופיל קורס',
      'Back': 'חזרה',
      'Coach': 'מאמן',
      'Sessions': 'מפגשים',
      'Meetings Left': 'מפגשים שנותרו',
      'Enrolled Students': 'תלמידים רשומים',
      'Start': 'התחלה',
      'End': 'סיום',
      'Enroll Students': 'רשום תלמידים',
      'Search students...': 'חפש תלמידים...',
      'No students enrolled yet.': 'אין תלמידים רשומים עדיין.',
      'Meetings Log': 'יומן מפגשים',
      'meetings': 'מפגשים',
      'Add Meeting': 'הוסף מפגש',
      'No notes': 'ללא הערות',
      'Edit': 'ערוך',
      'Delete': 'מחק',
      'attended': 'נוכחו',
      'total students': 'סה״כ תלמידים',
      'No meetings scheduled yet.': 'אין מפגשים מתוכננים עדיין.',
      'Click "Add Meeting" to schedule the first session.': 'לחץ על "הוסף מפגש" כדי לקבוע את המפגש הראשון.',
      'Add Meeting & Attendance': 'הוסף מפגש ונוכחות',
      'Edit Meeting & Attendance': 'עריכת מפגש ונוכחות',
      'Date': 'תאריך',
      'Notes': 'הערות',
      'Mark Attendance': 'סימון נוכחות',
      'Cancel': 'ביטול',
      'Save Changes': 'שמירת שינויים',
      'Available Students': 'תלמידים זמינים',
      'Search available students...': 'חפש תלמידים זמינים...',
      'No available students to enroll.': 'אין תלמידים זמינים לרישום.',
      'Enroll Selected': 'רשום נבחרים',
      'Unenroll student': 'הסר תלמיד',
      'Phone:': 'טלפון:',
      'Age:': 'גיל:',
      // runtime messages
      'Are you sure you want to unenroll {name} from this course?':
        'האם אתה בטוח שברצונך להסיר את {name} מהקורס?',
      'Student not found in this course.': 'התלמיד לא נמצא בקורס זה.',
      'Failed to add meeting.': 'נכשל בהוספת מפגש.',
      'Failed to update meeting.': 'נכשל בעדכון המפגש.',
      'Failed to load available students.': 'טעינת תלמידים נכשלה.',
      'Please select at least one student to enroll.': 'בחר לפחות תלמיד אחד לרישום.',
      'Failed to enroll students. Please try again.': 'רישום התלמידים נכשל. נסה שוב.',
      'Failed to unenroll student. Please try again.': 'הסרת התלמיד נכשלה. נסה שוב.'
      , 'Are you sure you want to delete this meeting?': 'האם למחוק את המפגש?' 
    }
  };

  const ctx = window.COURSE_CTX || {};
  const courseId = ctx.courseId;
  const courseName = ctx.courseName || '';
  const students = ctx.students || [];
  const enrolledStudentIds = ctx.enrolledStudentIds || [];

  // language state
  let currentLang = localStorage.getItem('lang') || 'he';
  const t = (key) => (translations[currentLang] && translations[currentLang][key]) || key;
  const tfmt = (key, params = {}) => {
    let s = t(key);
    Object.keys(params).forEach(k => { s = s.replaceAll(`{${k}}`, params[k]); });
    return s;
  };

  function applyTranslations() {
    // lang & direction
    document.documentElement.lang = currentLang;
    document.documentElement.dir = (currentLang === 'he') ? 'rtl' : 'ltr';

    // title
    if (courseName) {
      document.title = `${courseName} - ${t('Course Profile')}`;
    }

    // inner text
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    // placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', t(key));
    });

    // titles/tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.setAttribute('title', t(key));
    });

    // language toggle button caption
    const btn = document.getElementById('langToggleBtn');
    if (btn) btn.textContent = (currentLang === 'he') ? 'English' : 'עברית';
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
  }

  // init translations on load + toggle
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('langToggleBtn');
    if (btn) btn.addEventListener('click', () => setLang(currentLang === 'he' ? 'en' : 'he'));
    applyTranslations();
  });

  // ---------- Utilities ----------
  const $ = (id) => document.getElementById(id);

  /* ---------- Add Meeting ---------- */
  window.openAddMeetingModal = function () {
    $('addMeetingModal').classList.remove('hidden');
  };

  window.closeAddMeetingModal = function () {
    $('addMeetingModal').classList.add('hidden');
    const f = $('addMeetingForm');
    if (f) f.reset();
  };

  const addMeetingForm = $('addMeetingForm');
  if (addMeetingForm) {
    addMeetingForm.onsubmit = async function (e) {
      e.preventDefault();
      const form = e.target;
      const data = {
        date: form.date.value,
        notes: form.notes.value,
        attendance: Array.from(
          form.querySelectorAll('input[name="attendance"]:checked')
        ).map((cb) => parseInt(cb.value))
      };

      const resp = await fetch(`/api/courses/${courseId}/meetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: data.date,
          notes: data.notes,
          attendance: data.attendance
        })
      });

      if (resp.ok) {
        window.closeAddMeetingModal();
        window.location.reload();
      } else {
        alert(t('Failed to add meeting.'));
      }
    };
  }

  /* ---------- Edit Meeting ---------- */
  window.openEditMeetingModal = function (meetingId, date, notes, attendanceList) {
    $('editMeetingId').value = meetingId;
    $('editMeetingDate').value = date;
    $('editMeetingNotes').value = notes || '';

    const container = $('editAttendanceList');
    container.innerHTML = '';

    for (const student of students) {
      const att = (attendanceList || []).find((a) => a.student_id === student.id);
      const checked = att && att.present ? 'checked' : '';
      container.innerHTML += `
        <div class="flex items-center mb-2">
          <input type="checkbox" id="edit-attend-${student.id}" name="attendance" value="${student.id}" class="mr-2" ${checked}>
          <label for="edit-attend-${student.id}">${student.first_name} ${student.fathers_name}</label>
        </div>`;
    }

    $('editMeetingModal').classList.remove('hidden');
  };

  window.closeEditMeetingModal = function () {
    $('editMeetingModal').classList.add('hidden');
    const f = $('editMeetingForm');
    if (f) f.reset();
  };

  const editMeetingForm = $('editMeetingForm');
  if (editMeetingForm) {
    editMeetingForm.onsubmit = async function (e) {
      e.preventDefault();
      const form = e.target;
      const meetingId = form.meeting_id.value;

      const data = {
        attendance: Array.from(
          form.querySelectorAll('input[name="attendance"]:checked')
        ).map((cb) => ({ student_id: parseInt(cb.value), present: true }))
      };

      // Mark unchecked students as not present
      for (const s of students) {
        if (!data.attendance.find((a) => a.student_id === s.id)) {
          data.attendance.push({ student_id: s.id, present: false });
        }
      }

      const resp = await fetch(`/api/meetings/${meetingId}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendance: data.attendance })
      });

      if (resp.ok) {
        window.closeEditMeetingModal();
        window.location.reload();
      } else {
        alert(t('Failed to update meeting.'));
      }
    };
  }

  /* ---------- Delete Meeting ---------- */
  window.deleteMeeting = async function (meetingId) {
    if (!confirm(t('Are you sure you want to delete this meeting?') || 'Are you sure you want to delete this meeting?')) return;
    try {
      const resp = await fetch(`/api/meetings/${meetingId}`, { method: 'DELETE' });
      if (resp.ok) {
        // remove card from DOM
        const card = document.querySelector(`[data-meeting-id="${meetingId}"]`);
        if (card && card.parentNode) card.parentNode.removeChild(card);
        // optionally update counter
        // location.reload();
      } else {
        alert('Failed to delete meeting.');
      }
    } catch (e) {
      console.error('Delete meeting failed', e);
      alert('Failed to delete meeting.');
    }
  }

  /* ---------- Enroll / Unenroll Students ---------- */
  window.openEnrollStudentsModal = function () {
    loadAvailableStudents();
    $('enrollStudentsModal').classList.remove('hidden');
  };

  window.closeEnrollStudentsModal = function () {
    $('enrollStudentsModal').classList.add('hidden');
  };

  async function loadAvailableStudents() {
    try {
      const resp = await fetch('/api/students');
      const allStudents = await resp.json();

      const availableStudents = allStudents.filter(
        (s) => !enrolledStudentIds.includes(s.id)
      );

      const container = $('availableStudentsList');
      container.innerHTML = '';

      if (availableStudents.length === 0) {
        container.innerHTML =
          `<p class="text-gray-500 text-center py-4">${t('No available students to enroll.')}</p>`;
        return;
      }

      availableStudents.forEach((student) => {
        container.innerHTML += `
          <div class="flex items-center mb-2 available-student-item" data-name="${(student.first_name + ' ' + student.fathers_name).toLowerCase()}">
            <input type="checkbox" id="enroll-${student.id}" name="enroll_students" value="${student.id}" class="mr-2">
            <label for="enroll-${student.id}" class="flex-1">
              <div class="font-medium">${student.first_name} ${student.fathers_name}</div>
              <div class="text-sm text-gray-500">${t('Phone:')} ${student.phone} | ${t('Age:')} ${student.age}</div>
            </label>
          </div>`;
      });

      setupAvailableStudentSearch();
    } catch (err) {
      console.error('Failed to load students:', err);
      alert(t('Failed to load available students.'));
    }
  }

  function setupAvailableStudentSearch() {
    const searchInput = $('availableStudentSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
      const term = this.value.toLowerCase().trim();
      document.querySelectorAll('.available-student-item').forEach((item) => {
        const name = item.getAttribute('data-name') || '';
        item.style.display = name.includes(term) ? 'flex' : 'none';
      });
    });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        this.value = '';
        this.dispatchEvent(new Event('input'));
      }
    });
  }

  window.enrollSelectedStudents = async function () {
    const selected = Array.from(
      document.querySelectorAll('input[name="enroll_students"]:checked')
    ).map((cb) => parseInt(cb.value));

    if (selected.length === 0) {
      alert(t('Please select at least one student to enroll.'));
      return;
    }

    try {
      for (const studentId of selected) {
        const resp = await fetch('/api/enrollments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ course_id: courseId, student_id: studentId })
        });
        if (!resp.ok) throw new Error(`Failed to enroll student ${studentId}`);
      }

      window.closeEnrollStudentsModal();
      window.location.reload();
    } catch (err) {
      console.error('Failed to enroll students:', err);
      alert(t('Failed to enroll students. Please try again.'));
    }
  };

  window.unenrollStudent = async function (studentId, studentName) {
    if (!confirm(tfmt('Are you sure you want to unenroll {name} from this course?', { name: studentName }))) {
      return;
    }

    try {
      const resp = await fetch(`/api/courses/${courseId}/students`);
      const enrolled = await resp.json();
      const enrollment = enrolled.find((s) => s.id === studentId);

      if (!enrollment) {
        alert(t('Student not found in this course.'));
        return;
      }

      const del = await fetch(`/api/enrollments/${enrollment.enrollment_id}`, {
        method: 'DELETE'
      });

      if (del.ok) {
        window.location.reload();
      } else {
        throw new Error('Failed to unenroll student');
      }
    } catch (err) {
      console.error('Failed to unenroll student:', err);
      alert(t('Failed to unenroll student. Please try again.'));
    }
  };

  /* ---------- Student Search (left column) ---------- */
  function setupStudentSearch() {
    const searchInput = $('studentSearch');
    const studentsList = $('studentsList');
    const studentItems = document.querySelectorAll('.student-item');
    const studentCount = $('studentCount');

    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
      const term = this.value.toLowerCase().trim();
      let visible = 0;

      studentItems.forEach((item) => {
        const name = item.getAttribute('data-name') || '';
        if (name.includes(term)) {
          item.style.display = 'flex';
          visible++;
        } else {
          item.style.display = 'none';
        }
      });

      if (studentCount) studentCount.textContent = visible;

      const noResultsMsg = $('noResultsMsg');
      if (visible === 0 && term !== '') {
        if (!noResultsMsg) {
          const msg = document.createElement('li');
          msg.id = 'noResultsMsg';
          msg.className = 'text-gray-500 italic';
          msg.textContent = (currentLang === 'he')
            ? 'אין תלמידים תואמים לחיפוש.'
            : 'No students found matching your search.';
          studentsList.appendChild(msg);
        }
      } else if (noResultsMsg) {
        noResultsMsg.remove();
      }
    });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        this.value = '';
        this.dispatchEvent(new Event('input'));
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupStudentSearch);
  } else {
    setupStudentSearch();
  }
})();
