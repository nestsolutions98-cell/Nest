const courseId = {{ course_id }};
let courseData = null;
let allStudents = [];
let enrolledStudents = [];
let selectedStudentId = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadCourseDetails();
    loadAllStudents();
    setupEventListeners();
});

function setupEventListeners() {
    // Modal controls
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Student search in modal
    document.getElementById('studentSearchInCourse').addEventListener('input', filterAvailableStudents);

    // WhatsApp functionality
    document.getElementById('sendWhatsAppMessageBtn').addEventListener('click', sendWhatsAppToAllStudents);

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

function setupCoursePageEventListeners() {
    // Enrolled student search - set up after course details are rendered
    const searchInput = document.getElementById('enrolledStudentSearch');
    if (searchInput) {
        console.log('Setting up search event listener for enrolled students');
        searchInput.addEventListener('input', filterEnrolledStudents);
    } else {
        console.error('Search input not found');
    }
}

async function loadCourseDetails() {
    try {
        const response = await fetch(`/api/courses/${courseId}`);
        courseData = await response.json();
        renderCourseDetails();
        await loadEnrolledStudents();
    } catch (error) {
        console.error('Error loading course details:', error);
    }
}

function renderCourseDetails() {
    if (!courseData) return;

    const weekdays = courseData.weekdays.split(',').map(day => {
        const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days[parseInt(day)];
    }).join(', ');

    const content = document.getElementById('courseContent');
    content.innerHTML = `
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">${courseData.name}</h1>
                    <div class="text-lg text-gray-600">
                        <p><i class="fas fa-user mr-2"></i>Coach: ${courseData.teacher}</p>
                        <p><i class="fas fa-clock mr-2"></i>Time: ${courseData.time}</p>
                        <p><i class="fas fa-calendar mr-2"></i>Start Date: ${formatDate(courseData.start_date)}</p>
                        <p><i class="fas fa-calendar-check mr-2"></i>End Date: ${formatDate(courseData.end_date)}</p>
                        <p><i class="fas fa-calendar-week mr-2"></i>Weekdays: ${weekdays}</p>
                        <p><i class="fas fa-chart-line mr-2"></i>Sessions: ${courseData.sessions_count}</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="showAddStudentModal()" class="btn btn-primary">
                        <i class="fas fa-plus mr-2"></i>Add Student
                    </button>
                    <button onclick="showWhatsAppModal()" class="btn btn-success">
                        <i class="fab fa-whatsapp mr-2"></i>Send Message
                    </button>
                    <button onclick="showEditCourseModal()" class="btn btn-secondary">
                        <i class="fas fa-edit mr-2"></i>Edit
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Enrolled Students</h2>
            
            <div class="mb-4">
                <input type="text" id="enrolledStudentSearch" placeholder="Search enrolled students..." 
                       class="form-input w-full max-w-md">
            </div>
            
            <div id="enrolledStudentsList">
                <!-- Enrolled students will be loaded here -->
            </div>
        </div>
    `;
    setupCoursePageEventListeners();
}

async function loadEnrolledStudents() {
    try {
        const response = await fetch(`/api/courses/${courseId}/students`);
        enrolledStudents = await response.json();
        renderEnrolledStudents();
    } catch (error) {
        console.error('Error loading enrolled students:', error);
    }
}

function renderEnrolledStudents() {
    const container = document.getElementById('enrolledStudentsList');

    if (enrolledStudents.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No students enrolled in this course.</p>';
        return;
    }

    container.innerHTML = enrolledStudents.map(student => `
        <div class="student-card">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">${student.first_name} ${student.fathers_name}</h3>
                    <div class="text-sm text-gray-600 space-y-1">
                        <p><i class="fas fa-phone mr-2"></i>${student.phone}</p>
                        <p><i class="fas fa-id-card mr-2"></i>ID: ${student.national_id}</p>
                        <p><i class="fas fa-birthday-cake mr-2"></i>Age: ${student.age} years</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="showStudentProfile(${student.id})" class="btn btn-primary btn-sm">
                        <i class="fas fa-user mr-1"></i>Profile
                    </button>
                    <button onclick="sendWhatsAppToStudent('${student.phone}')" class="btn btn-success btn-sm">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                    <button onclick="removeStudentFromCourse(${student.id})" class="btn btn-danger btn-sm">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterEnrolledStudents() {
    console.log('Filter function called');
    const searchTerm = document.getElementById('enrolledStudentSearch').value.toLowerCase();
    console.log('Search term:', searchTerm);
    const filteredStudents = enrolledStudents.filter(student =>
        student.first_name.toLowerCase().includes(searchTerm) ||
        student.fathers_name.toLowerCase().includes(searchTerm) ||
        student.phone.includes(searchTerm) ||
        student.national_id.includes(searchTerm)
    );

    console.log('Filtered students:', filteredStudents.length);

    const container = document.getElementById('enrolledStudentsList');

    if (filteredStudents.length === 0) {
        if (searchTerm === '') {
            container.innerHTML = '<p class="text-gray-500">No students enrolled in this course.</p>';
        } else {
            container.innerHTML = '<p class="text-gray-500">No students found matching your search.</p>';
        }
        return;
    }

    container.innerHTML = filteredStudents.map(student => `
        <div class="student-card">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">${student.first_name} ${student.fathers_name}</h3>
                    <div class="text-sm text-gray-600 space-y-1">
                        <p><i class="fas fa-phone mr-2"></i>${student.phone}</p>
                        <p><i class="fas fa-id-card mr-2"></i>ID: ${student.national_id}</p>
                        <p><i class="fas fa-birthday-cake mr-2"></i>Age: ${student.age} years</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="showStudentProfile(${student.id})" class="btn btn-primary btn-sm">
                        <i class="fas fa-user mr-1"></i>Profile
                    </button>
                    <button onclick="sendWhatsAppToStudent('${student.phone}')" class="btn btn-success btn-sm">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                    <button onclick="removeStudentFromCourse(${student.id})" class="btn btn-danger btn-sm">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function loadAllStudents() {
    try {
        const response = await fetch('/api/students');
        allStudents = await response.json();
    } catch (error) {
        console.error('Error loading all students:', error);
    }
}

function showAddStudentModal() {
    filterAvailableStudents();
    showModal('addStudentModal');
}

function filterAvailableStudents() {
    const searchTerm = document.getElementById('studentSearchInCourse').value.toLowerCase();
    const enrolledIds = enrolledStudents.map(s => s.id);
    const availableStudents = allStudents.filter(student =>
        !enrolledIds.includes(student.id) &&
        (student.first_name.toLowerCase().includes(searchTerm) ||
         student.fathers_name.toLowerCase().includes(searchTerm) ||
         student.phone.includes(searchTerm) ||
         student.national_id.includes(searchTerm))
    );

    renderAvailableStudents(availableStudents);
}

function renderAvailableStudents(students) {
    const container = document.getElementById('availableStudentsList');

    if (students.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No available students found.</p>';
        return;
    }

    container.innerHTML = students.map(student => `
        <div class="student-card cursor-pointer hover:bg-blue-50" onclick="selectStudent(${student.id})">
            <div class="flex items-center">
                <input type="radio" name="selectedStudent" value="${student.id}" class="mr-3">
                <div>
                    <h4 class="font-semibold">${student.first_name} ${student.fathers_name}</h4>
                    <p class="text-sm text-gray-600">${student.phone}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function selectStudent(studentId) {
    selectedStudentId = studentId;
    document.querySelectorAll('input[name="selectedStudent"]').forEach(radio => {
        radio.checked = radio.value == studentId;
    });
}

async function enrollSelectedStudent() {
    if (!selectedStudentId) {
        alert('Please select a student first');
        return;
    }

    try {
        const response = await fetch('/api/enrollments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                course_id: courseId,
                student_id: selectedStudentId
            })
        });

        if (response.ok) {
            closeAllModals();
            selectedStudentId = null;
            await loadEnrolledStudents();
        } else {
            alert('Error enrolling student');
        }
    } catch (error) {
        console.error('Error enrolling student:', error);
        alert('Error enrolling student');
    }
}

async function removeStudentFromCourse(studentId) {
    if (!confirm('Are you sure you want to remove this student from the course?')) return;

    try {
        // Find the enrollment ID first
        const response = await fetch(`/api/courses/${courseId}/students`);
        const students = await response.json();
        const student = students.find(s => s.id === studentId);

        if (student && student.enrollment_id) {
            const deleteResponse = await fetch(`/api/enrollments/${student.enrollment_id}`, {
                method: 'DELETE'
            });

            if (deleteResponse.ok) {
                await loadEnrolledStudents();
            } else {
                alert('Error removing student from course');
            }
        }
    } catch (error) {
        console.error('Error removing student from course:', error);
        alert('Error removing student from course');
    }
}

async function showStudentProfile(studentId) {
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
                            payments.map(payment => `<div class=\"text-sm p-2 bg-gray-100 rounded mb-1\">${payment.month}</div>`).join('') :
                            '<p class="text-gray-500">No payments recorded</p>'
                        }
                    </div>
                </div>
            </div>
            <div class="mt-6">
                <h4 class="font-semibold mb-3">Enrolled Courses</h4>
                <div id="studentCoursesList"></div>
            </div>
        `;
        await loadStudentCourses(studentId);
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

function sendWhatsAppToStudent(phone) {
    const message = prompt('Enter your message:');
    if (message) {
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
}

function showWhatsAppModal() {
    showModal('whatsappModal');
}

async function sendWhatsAppToAllStudents() {
    const message = document.getElementById('whatsappMessage').value;
    if (!message) {
        alert('Please enter a message');
        return;
    }

    enrolledStudents.forEach(student => {
        const whatsappUrl = `https://wa.me/${student.phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    closeAllModals();
    document.getElementById('whatsappMessage').value = '';
}

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// --- Meetings Log ---
async function fetchMeetings(courseId) {
    const res = await fetch(`/api/courses/${courseId}/meetings`);
    return await res.json();
}

async function renderMeetingsLog(courseId) {
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
                <button class="btn btn-blue flex items-center gap-1 openAttendanceBtn" data-meeting-id="${meeting.id}" data-i18n="Attendance">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    Attendance
                </button>
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

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('meetingsLogSection')) {
        renderMeetingsLog(courseId);
        document.getElementById('addMeetingBtn').onclick = () => addMeeting(courseId);
    }
});

function showEditCourseModal() {
    document.getElementById('editCourseName').value = courseData.name;
    document.getElementById('editCourseTeacher').value = courseData.teacher;
    document.getElementById('editCourseTime').value = courseData.time;
    document.getElementById('editCourseSessions').value = courseData.sessions_count;
    document.getElementById('editCourseWeekdays').value = courseData.weekdays;
    document.getElementById('editCourseColor').value = courseData.color;
    document.getElementById('editCourseModal').classList.remove('hidden');
}

function closeEditCourseModal() {
    document.getElementById('editCourseModal').classList.add('hidden');
}

async function saveCourseEdits() {
    const updated = {
      name: document.getElementById('editCourseName').value,
      teacher: document.getElementById('editCourseTeacher').value,
      time: document.getElementById('editCourseTime').value,
      sessions_count: document.getElementById('editCourseSessions').value,
      // sessions_per_week is derived on the server from weekdays
      weekdays: document.getElementById('editCourseWeekdays').value,
      color: document.getElementById('editCourseColor').value
    };
    try {
        const resp = await fetch(`/api/courses/${courseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });
        if (resp.ok) {
            courseData = await resp.json();
            closeEditCourseModal();
            renderCourseDetails();
        } else {
            alert('Failed to update course');
        }
    } catch (e) {
        alert('Error updating course');
    }
}