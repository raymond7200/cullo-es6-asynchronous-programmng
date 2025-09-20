// ----- Part 1: ES6 Classes -----
class Student {
  constructor(id, name, age, courseId) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.courseId = courseId;
  }
  introduce(courseTitle) {
    return `Hi, my name is ${this.name}, I am ${this.age} years old, and I am enrolled in ${courseTitle}.`;
  }
}

class Instructor {
  constructor(id, name, subject) {
    this.id = id;
    this.name = name;
    this.subject = subject;
  }
  teach() {
    return `I am ${this.name} and I teach ${this.subject}.`;
  }
}

// Utility selectors
const output = document.getElementById('output');
const DATA_PATH = 'data/students.json';

// ----- Part 2: Fetch Data -----
function fetchDataWithThen() {
  return fetch(DATA_PATH)
    .then(res => res.json())
    .then(data => {
      console.log("Data from .then:", data);
      return data;
    })
    .catch(err => console.error("Fetch error:", err));
}

async function fetchDataWithAsync() {
  try {
    const res = await fetch(DATA_PATH);
    const data = await res.json();
    console.log("Data from async/await:", data);
    return data;
  } catch (err) {
    console.error("Async fetch error:", err);
  }
}

// Build Objects
function buildObjects(data) {
  return {
    students: data.students.map(s => new Student(s.id, s.name, s.age, s.courseId)),
    instructors: data.instructors.map(i => new Instructor(i.id, i.name, i.subject)),
    courses: data.courses
  };
}

// Helper functions
function findCourse(courses, id) { return courses.find(c => c.id === id); }
function findInstructor(instructors, id) { return instructors.find(i => i.id === id); }

// ----- Part 3 & 4: Render -----
function render({ students, instructors, courses }) {
  output.innerHTML = '';

  // Students
  const sCard = document.createElement('div');
  sCard.className = 'card';
  sCard.innerHTML = '<h2>Students:</h2>';
  const sList = document.createElement('ul');
  sList.className = 'list';
  students.forEach(s => {
    const course = findCourse(courses, s.courseId);
    const li = document.createElement('li');
    li.innerHTML = `${s.name} (${s.age}) - ${course.title}${s.age > 21 ? ' *' : ''}`;
    if (s.age > 21) li.classList.add('highlight');
    sList.appendChild(li);
  });
  sCard.appendChild(sList);
  output.appendChild(sCard);

  // Courses
  const cCard = document.createElement('div');
  cCard.className = 'card';
  cCard.innerHTML = '<h2>Courses:</h2>';
  const cList = document.createElement('ul');
  cList.className = 'list';
  courses.forEach(c => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${c.title}:</strong> <span class="course-desc">${c.description}</span>`;
    cList.appendChild(li);
  });
  cCard.appendChild(cList);
  output.appendChild(cCard);

  // Instructors
  const iCard = document.createElement('div');
  iCard.className = 'card';
  iCard.innerHTML = '<h2>Instructors:</h2>';
  const iList = document.createElement('ul');
  iList.className = 'list';
  instructors.forEach(i => {
    const li = document.createElement('li');
    li.textContent = `${i.name} - ${i.subject}`;
    iList.appendChild(li);
  });
  iCard.appendChild(iList);
  output.appendChild(iCard);

  // Relationships
  const rCard = document.createElement('div');
  rCard.className = 'card';
  rCard.innerHTML = '<h2>Relationships:</h2>';
  const rList = document.createElement('ul');
  rList.className = 'list';
  students.forEach(s => {
    const course = findCourse(courses, s.courseId);
    const instructor = findInstructor(instructors, course.instructorId);
    const li = document.createElement('li');
    li.innerHTML = `${s.name} → ${course.title} → ${course.description} (Taught by ${instructor.name})`;
    rList.appendChild(li);
  });
  rCard.appendChild(rList);
  output.appendChild(rCard);
}

// ----- Fetch and Render -----
fetchDataWithThen().then(data => {
  const built = buildObjects(data);
  console.log("Created Students:", built.students);
  console.log("Created Instructors:", built.instructors);
  render(built);
});

(async () => {
  const data = await fetchDataWithAsync();
  const built = buildObjects(data);
  console.log("Async Students:", built.students);
  console.log("Async Instructors:", built.instructors);
})();