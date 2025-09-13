function enableEdit() {
    document.querySelectorAll('.edit-field').forEach(function(el) { el.removeAttribute('readonly'); });
    document.getElementById('edit-actions').classList.remove('hidden');
    document.getElementById('edit-btn').classList.add('hidden');
}
function cancelEdit() {
    window.location.reload();
}
// Payment Modal Logic
function openAddPaymentModal(courseId, courseName) {
    document.getElementById('modalCourseId').value = courseId;
    document.getElementById('modalCourseName').textContent = courseName;
    document.getElementById('addPaymentModal').classList.remove('hidden');
}
function closeAddPaymentModal() {
    document.getElementById('addPaymentModal').classList.add('hidden');
    document.getElementById('addPaymentForm').reset();
}
document.getElementById('addPaymentForm').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
        student_id: form.student_id.value,
        course_id: form.course_id.value,
        month: form.month.value,
        amount: form.amount.value,
        payment_method: form.payment_method.value
    };
    const resp = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (resp.ok) {
        closeAddPaymentModal();
        window.location.reload();
    } else {
        alert('Failed to add payment.');
    }
};
// Edit form AJAX
document.getElementById('edit-student-form').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
        first_name: form.first_name.value,
        fathers_name: form.fathers_name.value,
        phone: form.phone.value,
        national_id: (form.national_id.value.trim() || null),
        date_of_birth: form.date_of_birth.value
    };
    const resp = await fetch(form.action, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (resp.ok) {
        window.location.reload();
    } else {
        alert('Failed to update student info.');
    }
};