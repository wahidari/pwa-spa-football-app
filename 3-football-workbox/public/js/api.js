const API_KEY = '4d6b88a4e8c342abb41ceb599b4f39b0';
const LEAGUE_ID = 2021;
const base_url = "https://api.football-data.org/v2";
const standings_url = `${base_url}/competitions/${LEAGUE_ID}/standings?standingType=TOTAL`;
const teams_url = `${base_url}/competitions/${LEAGUE_ID}/teams`;

// var global untuk menyimpan team di file db.js
let teamData;

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
};

// Blok kode untuk menambahkan heeader API_KEY
function fetchApi(url) {
  return fetch(url, {
    headers: {
      'X-Auth-Token': API_KEY
    }
  });
};

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
};

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
};

// Blok untuk menampilkan data standing ke home page
function showStandings(data) {
  showLoader();
  let htmlTable = ''
  data.standings.forEach(standing => {
    let rowTable = ''
    standing.table.forEach(result => {
      rowTable += `
      <tr>
        <td class="center">${result.position}</td>
        <td><img src="${result.team.crestUrl}" alt="Club Logo" width="30" height="30"></td>
        <td>${result.team.name}</td>
        <td class="center">${result.playedGames}</td>
        <td class="center">${result.won}</td>
        <td class="center">${result.draw}</td>
        <td class="center">${result.lost}</td>
        <td class="center">${result.points}</td>
      </tr>`
    });

    htmlTable += `
      <h5 class="header center" style="margin-bottom: 16px;">Premier League Standing</h5>
      <h6 class="center red-text" style="margin-bottom: 16px;">Season End : ${data.season.endDate}</h6>
      <div class="card">
      <div class="card-content">
      <table class="responsive-table striped">
      <thead>
        <tr>
          <th class="center">Position</th>
          <th></th>
          <th>Team Name</th>
          <th class="center">Played</th>
          <th class="center">Won</th>
          <th class="center">Draw</th>
          <th class="center">Lost</th>
          <th class="center">Points</th>
        </tr>
      </thead>
      <tbody>` + rowTable + `</tbody>
      </table>
      </div>
      </div>`
  });
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById("standings").innerHTML = htmlTable;
  hideLoader();
};

// Blok untuk menampilkan data team ke team page
function showTeams(data) {
  let htmlCard = '';
  htmlCard += `
    <div class="row">
      <h5 class="center">Premier League Teams</h5>
      `;
  data.teams.forEach(team => {
    htmlCard += `
      <div class="col s12 m6 l6">
        <div class="card">
          <div class="card-content">
            <div class="center"><img width="128" height="128" alt="Club Logo" src="${team.crestUrl}"></div>
            <div class="center flow-text">${team.shortName}</div>
            <div class="center">Venue : ${team.venue}</div>
            <div class="center">Founded : ${team.founded}</div>
            <div class="center"><a href="${team.website}" target="_blank">Official Website</a></div>
          </div>
          <div class="card-action center">
              <a class="waves-effect waves-light btn-small teal" onclick="saveTeam(${team.id}, \'${team.shortName}\')">Add to Favorite</a>
          </div>
        </div>
      </div>
    `;
  });

  htmlCard += "</div>";
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById("teams").innerHTML = htmlCard;
};

// Blok untuk mengirim data team insert ke db
function saveTeam(id, name) {
  dbInsertTeam(id);
  M.toast({
    html: `Successfully Added ${name} To Favorite`,
  });
}

// Blok untuk load data ke home
function getStandings() {
  showLoader();
  // Cek cache
  if ('caches' in window) {
    caches.match(standings_url)
    .then(response => {
      if (response) {
        response.json().then(data => {
          showStandings(data)
        });
      };
    });
  };

  // Blok kode untuk melakukan request data json
  fetchApi(standings_url)
  .then(status)
  .then(json)
  .then(data => {
    showStandings(data);
  })
  .catch(error);

  hideLoader();
};

// Blok untuk teams
function getTeams() {
  showLoader();
  if ('caches' in window) {
    caches.match(teams_url)
    .then(response => {
      if (response) {
        response.json().then(data => {
          teamData = data;
          showTeams(data);
        });
      };
    });
  };

  // Blok kode untuk melakukan request data json
  fetchApi(teams_url)
  .then(status)
  .then(json)
  .then(data => {
    teamData = data;
    showTeams(data);
  })
  .catch(error);

  hideLoader();
};

// Load saved team
function showSavedTeams() {
  dbGetSavedTeams().then(teams => {
    // Menyusun komponen card artikel secara dinamis
    let htmlCard = '';
    htmlCard += `
      <div class="row">
        <h5 class="center">Favorite Teams</h5>
        `;
    teams.forEach(team => {
      htmlCard += `
        <div class="col s12 m6 l6">
          <div class="card">
            <div class="card-content">
              <div class="center"><img width="128" height="128" alt="Club Logo" src="${team.crestUrl}"></div>
              <div class="center flow-text">${team.shortName}</div>
              <div class="center">Venue : ${team.venue}</div>
              <div class="center">Founded : ${team.founded}</div>
              <div class="center"><a href="${team.website}" target="_blank">Official Website</a></div>
            </div>
            <div class="card-action center">
                <a href="#confirmModal${team.id}" class="waves-effect waves-light btn-small red modal-trigger deleteModal">Delete From Favorite</a>
            </div>
          </div>
        </div>

        <!-- Modal Structure -->
        <div id="confirmModal${team.id}" class="modal">
          <div class="modal-content center">
            <img width="64" height="64" alt="Club Logo" src="${team.crestUrl}">
            <h5 class="text-header center">Remove ${team.shortName} ?</h5>
            <p class="grey-text lighten-2 center">This will remove ${team.shortName} from your favorite lists.</p>
          </div>
          <div class="modal-footer">
            <a href="#" class="modal-close waves-effect btn-flat grey white-text cancelButton">Cancel</a>
            <a href="#" class="modal-close waves-effect btn-flat red white-text" onClick="dbDeleteTeam(Number(${team.id}))">Delete</a>
          </div>
        </div>
      `;
    });
    // Cek tidak ada favorite
    if (teams.length == 0) {
      htmlCard += '<h6 class="center-align red-text">No favorite team found !</6>';
    };
    htmlCard += "</div>";

    // Sisipkan komponen card ke dalam elemen dengan id #favorite
    document.getElementById("favorite").innerHTML = htmlCard;

    // Inisialisasi modal delete
    let elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
  });
};

function showLoader () {
  let htmlLoader = `
    <div class="preloader-wrapper medium active">
      <div class="spinner-layer spinner-green-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>`;
  document.getElementById("loader").innerHTML = htmlLoader;
};

function hideLoader () {
  document.getElementById("loader").innerHTML = '';
};