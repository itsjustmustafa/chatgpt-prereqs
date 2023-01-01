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
    results.forEach(result => {
      const prereqs = result.preReq.join(', ');
      const postreqs = result.postReq.join(', ');
      resultsContainer.innerHTML += `
        <h2>${result.name}</h2>
        <p>Code: ${result.code}</p>
        <p>Prerequisites: ${prereqs}</p>
        <p>Postrequisites: ${postreqs}</p>
      `;
    });
  }
}

document.getElementById('course-form').addEventListener('submit', event => {
  event.preventDefault();
  const subject = document.getElementById('subject').value;
  searchCourses(subject).then(results => {
    displayResults(results);
  });
});
