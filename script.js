async function getSubjectName(code) {
  const courses = await fetchCourses();
  const subject = courses.find((subject) => subject.code === code);
  if(subject){
	return subject.name
  }
}

async function searchCourses(query) {
  const courses = await fetchCourses();
  return courses.filter((subject) => subject.code.includes(query) || subject.name.toLowerCase().includes(query.toLowerCase()));
}

async function fetchCourses() {
  const response = await fetch('courses.json');
  return await response.json();
}

async function displayResults() {
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get('code');
  if (code) {
	const input = document.getElementById('subject-query');
	input.value = code;
    const subjects = await searchCourses(code);
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
		  if (name){
			return `<li><a href="${window.location.pathname}?code=${code}">${name} - ${code}</a></li>`;
		  } else{
			  return "";
		  };
        }))).join('');
        const postreqLinks = (await Promise.all(subject.postReq.map(async (code) => {
          const name = await getSubjectName(code);
		  if (name){
			return `<li><a href="${window.location.pathname}?code=${code}">${name} - ${code}</a></li>`;
		  } else{
			  return "";
		  }
        }))).join('');
        const row = document.createElement('tr');
        row.innerHTML = `
          <td></td>
          <td><ul>${prereqLinks}</ul></td>
          <td>${subject.name} - ${subject.code}</td>
          <td><ul>${postreqLinks}</ul></td>
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
}

async function querySubject(code) {
  const input = document.getElementById('subject-query');
  if(!code){
	  code = input.value;
  }else{ 
	input.value = code;
  }
  window.location.href = `${window.location.pathname}?code=${code}`;
}

displayResults();
