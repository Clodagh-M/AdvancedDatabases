const localDB = new PouchDB('movies_local');
const remoteDB = new PouchDB('http://admin:mtu12345@127.0.0.1:5984/schema_a_movies');

localDB.sync(remoteDB, { live: true, retry: true })
  .on('change', info => console.log('sync change', info))
  .on('paused', err  => console.log('sync paused',  err))
  .on('error',  err  => console.log('sync error',   err));


function createMovie() {
  const id = document.getElementById('createId').value.trim();
  const title = document.getElementById('createTitle').value.trim();
  const actors = document.getElementById('createActors').value.split(',').map(s => s.trim()).filter(Boolean);
  const genres = document.getElementById('createGenres').value.split(',').map(s => s.trim()).filter(Boolean);

  if (!id || !title) { alert('ID and Title are required'); return; }

  localDB.put({ _id: id, title, actors, genres })
    .then(() => alert('Created locally (sync in progress)'))
    .catch(err => alert('Create failed: ' + err.message));
}

function readMovie() {
  const id = document.getElementById('readId').value.trim();
  localDB.get(id)
    .then(doc => { document.getElementById('output').textContent = JSON.stringify(doc, null, 2); })
    .catch(err => { document.getElementById('output').textContent = 'Not found: ' + err.message; });
}

function updateMovie() {
  const id = document.getElementById('updateId').value.trim();
  const newGenres = document.getElementById('updateGenres').value.split(',').map(s => s.trim()).filter(Boolean);

  localDB.get(id)
    .then(doc => { doc.genres = newGenres; return localDB.put(doc); })
    .then(() => alert('Updated locally (sync in progress)'))
    .catch(err => alert('Update failed: ' + err.message));
}

function deleteMovie() {
  const id = document.getElementById('deleteId').value.trim();
  localDB.get(id)
    .then(doc => localDB.remove(doc))
    .then(() => alert('Deleted locally (sync in progress)'))
    .catch(err => alert('Delete failed: ' + err.message));
}