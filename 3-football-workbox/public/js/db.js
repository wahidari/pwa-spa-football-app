// Declare DB
const dbPromised = idb.open("football", 1, upgradeDb => {
  upgradeDb.createObjectStore("teams", { keyPath: "id" });
});

// Insert team to db by id
function dbInsertTeam(idTeam){
  // console.log(teamData); // cek var global dari api.js
  let team = teamData.teams.filter(el => el.id == idTeam)[0];
  dbPromised.then(db => {
    const transaction = db.transaction("teams", "readwrite");
    transaction.objectStore("teams").add(team);
    return transaction;
  }).then(() => {
    console.log("Team berhasil di simpan.");
  }).catch(err => {
    console.error(`Team gagal disimpan ! ${err}`);
  });
};

// Delete team db by id
function dbDeleteTeam(idTeam) {
  dbPromised.then(db => {
    const transaction = db.transaction("teams", "readwrite");
    transaction.objectStore("teams").delete(idTeam);
    return transaction;
  }).then(() => {
    console.log(`${idTeam} Team berhasil di hapus.`);
    showSavedTeams();
  }).catch(err => {
    console.error(`Team gagal dihapus ! ${err}`);
  });
};

// get saved teams from db
function dbGetSavedTeams() {
  return new Promise((resolve, reject) => {
    dbPromised
    .then(db => {
      const transaction = db.transaction("teams", "readonly");
      return transaction.objectStore("teams").getAll();
    })
    .then(teams => {
      if (teams !== undefined) {
        resolve(teams);
      } else {
        reject(new Error("Favorite not Found"));
      }
    });
  });
};