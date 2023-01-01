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

async function displayResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
  } else {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th>Subject</th>
      <th>Code</th>
      <th>Prerequisites</th>
      <th>Postrequisites</th>
    `;
    table.appendChild(headerRow);
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Loading results...';
    resultsContainer.appendChild(loadingMessage);
    const progressBar = document.createElement('progress');
    progressBar.max = results.length;
    progressBar.value = 0;
    resultsContainer.appendChild(progressBar);
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const prereqLinks = (await Promise.all(result.preReq.map(async (code) => {
        const subject = await getSubjectName(code);
        return `<a href="#" onclick="querySubject('${code}')">${subject}</a>`;
      }))).join(', ');
      const postreqLinks = (await Promise.all(result.postReq.map(async (code) => {
        const subject = await getSubjectName(code);
        return `<a href="#" onclick="querySubject('${code}')">${subject}</a>`;
      }))).join(', ');
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${result.name}</td>
        <td>${result.code}</td>
        <td>${prereqLinks}</td>
        <td>${postreqLinks}</td>
      `;
      table.appendChild(row);
      progressBar.value = i + 1;
    }
    resultsContainer.removeChild(loadingMessage);
    resultsContainer.removeChild(progressBar);
    resultsContainer.appendChild(table);
  }
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
