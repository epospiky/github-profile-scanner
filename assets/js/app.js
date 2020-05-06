
//create github api object

class Github {
  constructor() {
    this.client_id =  '1f2eba3956892c926572';
    this.client_secret = '94525340e776a5c0079d2c4565180faa8f141027';
    this.repo_count = 5;
    this.sort_repos = 'created: asc';
  };

  async getData(user) {
    const res = await fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`);
    const repoRes = await fetch(`https://api.github.com/users/${user}/repos?per_page=${this.repo_count}&sort=${this.sort_repos}&client_id=${this.client_id}&client_secret=${this.client_secret}`);
    const data = await res.json();
    const repoData = await repoRes.json();
    return {
      data: data,
      repoData: repoData
    };
  };
};


//create ui object

class Ui {
  constructor() {
    this.input = document.querySelector('.search-user');
    this.output = document.querySelector('.output-data');
    this.alertContainer = document.querySelector('.alert-container');
  }

  showProfile(user) {
    const d = new Date(`${user.created_at.split('T')[0]}`);
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    this.output.innerHTML = 
      `
      <section id="user-box">
        <div class="profile-container">
          <h2 class="username">${user.login}</h2>
          <div class="profile-box">
            <div class="profile-img-box">
              <img src="${user.avatar_url}" class="profile-img" alt="profile image">
            </div>
            <div class="details-box">
              <div class="badges">
                <div class="badge green-badge"><p>Followers: ${user.followers}</p></div>
                <div class="badge red-badge"><p>Following: ${user.following}</p></div>
                <div class="badge blue-badge"><p>Public repos: ${user.public_repos}</p></div>
                <div class="badge orange-badge"><p>Public Gists: ${user.public_gists}</p></div>
              </div>
              <div class="basic-info">
                <ul class="info-list">
                  <li><b>Full Name: </b>${user.name}</li>
                  <li><b>Website/blog: </b><a href="${user.blog}">${user.blog}</a></li>
                  <li><b>Location: </b>${user.location}</li>
                  <li><b>Joined: </b>${day} ${month} ${year}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      `
  };

  showRepos(repos) {
    const section = document.createElement('section');
    section.id = 'repo-box';
    const div = document.createElement('div');
    div.className = 'repo-container';
    const h2 = document.createElement('h2');
    h2.className = 'repo-heading';
    h2.innerText = 'Latest Repos'
    const ul = document.createElement('ul');
    ul.className = 'repo-list';
    repos.forEach(repo => {
      ul.innerHTML += 
      `
      <li>${repo.name} <span class="repo-badges">
      <span class="badge green-badge"><p>Stars: ${repo.stargazers_count}</p></span>
      <span class="badge blue-badge"><p>Forks: ${repo.forks}</p></span>
      <span class="badge red-badge"><p>Issues: ${repo.open_issues}</p></span>
      </span></li>
      `
    });
    div.appendChild(h2);
    div.appendChild(ul);
    section.appendChild(div);
    this.output.appendChild(section);
  };

  clearScreen() {
    this.output.innerHTML = '<div class="empty"><i class="fab fa-github fa-7x"></i><br><p>Scan Github User Profiles</p></div>';
  };

  showAlert(message) {
    // const alertContainer = document.querySelector('.alert-container');
    this.alertContainer.innerHTML = `<div class="alert"><p class="alert-message">User ${message}</p></div>`;
    this.alertContainer.style.display = 'flex';
    setTimeout(() => {
      this.alertContainer.innerHTML = '';
      this.alertContainer.style.display = 'none';
    }, 3000);
   
  };

  removeAlert() {
    this.alertContainer.style.display = 'none';
  };

};

//instanciate both objects

const github = new Github();
const ui = new Ui();

//call event listeners

ui.input.addEventListener('keyup', (e) => {

  if(e.target.value !== '') {
    github.getData(e.target.value)
    .then(profile => {
      if (profile.data.message) {
        ui.showAlert(profile.data.message);
      } else {
        ui.removeAlert();
        ui.showProfile(profile.data);
        ui.showRepos(profile.repoData);
      }
    })
    .catch(err => {
      ui.showAlert(err);
    });
  } else {
    ui.clearScreen();
  };

});
