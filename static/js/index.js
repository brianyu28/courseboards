$(document).ready(function() {
    $('#join-student').click(function() {
        var course = $('#student-course').val();
        window.location.href = Flask.url_for('student', {'course': course});
    });
});
