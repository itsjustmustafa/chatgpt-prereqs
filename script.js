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

async function displayResults(subjects) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
  if (subjects.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
  } else {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th></th>
      <th>Prerequisites</th>
      <th>Subject</th>
      <th>Postrequisites</th>
      <th></th>
    `;
    table.appendChild(headerRow);
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Loading results...';
    resultsContainer.appendChild(loadingMessage);
    const progressBar = document.createElement('progress');
    progressBar.max = subjects.length;
    progressBar.value = 0;
    resultsContainer.appendChild(progressBar);
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      const prereqLinks = (await Promise.all(subject.preReq.map(async (code) => {
        const name = await getSubjectName(code);
        return `<li><a href="#" onclick="querySubject('${code}')">${name} - ${code}</a></li>`;
      }))).join('');
      const postreqLinks = (await Promise.all(subject.postReq.map(async (code) => {
        const name = await getSubjectName(code);
        return `<li><a href="#" onclick="querySubject('${code}')">${name} - ${code}</a></li>`;
      }))).join('');
      const row = document.createElement('tr');
      row.innerHTML = `
        <td></td>
        <td><ul>${prereqLinks}</ul></td>
        <td>${subject.name} - ${subject.code}</td>
        <td><ul>${postreqLinks}</ul></td>
        <td></
        <td></td>
      `;
      table.appendChild(row);
      progressBar.value = i + 1;
    }
    resultsContainer.removeChild(loadingMessage);
    resultsContainer.removeChild(progressBar);
    resultsContainer.appendChild(table);
  }
}


async function querySubject(code) {
  searchCourses(code).then(displayResults);
}

async function getSubjectName(code) {
  const courses = await getCourses();
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
