async function getCourses() {
  try {
    const response = await fetch('./courses.json');
    return await response.json();
  } catch (error) {
	console.log("getCourses has an error!!!");
    console.error(error);
  }
}

async function searchCourses(subject) {
  const courses = await getCourses();
  const results = courses.filter(course =>
    course.name.toLowerCase().includes(subject.toLowerCase()) ||
    course.code.includes(subject)
  );
  return results;
}

function displayResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
  } else {
    resultsContainer.innerHTML = `
      <table>
        <tr>
          <th>Subject</th>
          <th>Code</th>
          <th>Prerequisites</th>
          <th>Postrequisites</th>
        </tr>
    `;
    results.forEach(result => {
      const prereqs = result.preReq.map(code => getSubjectName(code)).join(', ');
      const postreqs = result.postReq.map(code => getSubjectName(code)).join(', ');
      resultsContainer.innerHTML += `
        <tr>
          <td>${result.name}</td>
          <td>${result.code}</td>
          <td>${prereqs}</td>
          <td>${postreqs}</td>
        </tr>
      `;
    });
    resultsContainer.innerHTML += '</table>';
  }
}

function getSubjectName(code) {
  const courses = getCourses();
  const subject = courses.find(course => course.code === code);
  return subject ? subject.name : code;
}


document.getElementById('course-form').addEventListener('submit', event => {
  event.preventDefault();
  const subject = document.getElementById('subject').value;
  searchCourses(subject).then(results => {
    displayResults(results);
  });
});
