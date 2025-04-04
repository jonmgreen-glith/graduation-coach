import React, { useState, useEffect } from 'react';
import ChatBox from './ChatBox';
import courseData from '../database/coursesDB.json';
import graduationRequirements from '../database/graduationRequirements.json';
import studentData from '../database/studentData.json';

function MainPage() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [activeTab, setActiveTab] = useState('graduationRequirements');
  const [graduationData, setGraduationData] = useState({});
  const [studentRecords, setStudentRecords] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(''); // New state for selected student

  useEffect(() => {
    setGraduationData(graduationRequirements);
    setStudentRecords(studentData);

    const firstStudent = Object.keys(studentData.student)[0];
    setSelectedStudent(firstStudent);
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const checkRequirementMet = (grade, subject) => {
    const student = studentRecords.student?.[selectedStudent]?.grade[grade]?.subject[subject]?.courses || [];
    return student.length > 0;
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setSelectedCourse('');
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Select Student: </label>
        <select value={selectedStudent} onChange={handleStudentChange}>
          {Object.keys(studentData.student).map((studentName) => (
            <option key={studentName} value={studentName}>
              {studentName}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('graduationRequirements')}>Graduation Requirements</button>
        <button onClick={() => setActiveTab('courses')} style={{ marginRight: '10px' }}>Courses</button>
      </div>

      {activeTab === 'graduationRequirements' && graduationData.grade && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>Grade</th>
              <th>Required Subjects</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(graduationData.grade).map(([grade, subjects]) => (
              <tr key={grade}>
                <td>Grade {grade}</td>
                <td>
                  {Object.entries(subjects).map(([subject, count]) => (
                    <span key={subject} style={{ color: checkRequirementMet(grade, subject) ? 'black' : 'red' }}>
                      {subject} ({count})
                    </span>
                  )).reduce((prev, curr) => [prev, ', ', curr])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'courses' && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Course</th>
              <th>Recommended Grade</th>
              <th>Prerequisite Courses</th>
            </tr>
          </thead>
          <tbody>
            {courseData.subjects.flatMap((subject, subjectIndex) =>
              subject.courses.map((course, courseIndex) => {
                const index = `${subjectIndex}-${courseIndex}`;
                return (
                  <React.Fragment key={index}>
                    <tr onClick={() => toggleExpand(index)} style={{ cursor: 'pointer', backgroundColor: expandedIndex === index ? '#f0f0f0' : 'transparent' }}>
                      <td>{subject.name}</td>
                      <td>{course.name}</td>
                      <td>{course.prerequisites.grade}</td>
                      <td>{course.prerequisites.courses && course.prerequisites.courses.length ? course.prerequisites.courses.join(', ') : 'None'}</td>
                    </tr>
                    {expandedIndex === index && (
                      <tr>
                        <td colSpan="4">
                          <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', borderRadius: '5px', background: '#fff' }}>
                            <h3>{course.name}</h3>
                            <p><strong>Prerequisites:</strong> {course.prerequisites.courses.length ? course.prerequisites.courses.join(', ') : 'None'}</p>
                            <p><strong>Description:</strong> {course.description}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Find a Course</h3>
        <label>Subject: </label>
        <select value={selectedSubject} onChange={handleSubjectChange}>
          <option value="">Select Subject</option>
          {courseData.subjects.map((subject) => (
            <option key={subject.name} value={subject.name}>{subject.name}</option>
          ))}
        </select>

        {selectedSubject && (
          <>
            <label style={{ marginLeft: '10px' }}>Course: </label>
            <select value={selectedCourse} onChange={handleCourseChange}>
              <option value="">Select Course</option>
              {courseData.subjects.find(s => s.name === selectedSubject)?.courses.map((course) => (
                <option key={course.name} value={course.name}>{course.name}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {selectedCourse && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff' }}>
          <h3>{selectedCourse}</h3>
          <p><strong>Prerequisites:</strong> {courseData.subjects.find(s => s.name === selectedSubject)?.courses.find(c => c.name === selectedCourse)?.prerequisites.courses.join(', ') || 'None'}</p>
          <p><strong>Description:</strong> {courseData.subjects.find(s => s.name === selectedSubject)?.courses.find(c => c.name === selectedCourse)?.description}</p>
        </div>
      )}

      <ChatBox />
    </div>
  );
}

export default MainPage;