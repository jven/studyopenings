class ServerWrapper {
  static loadRepertoire() {
    return fetch('/loadrepertoire', {method: 'POST'}).then(res => res.json());
  }

  static saveRepertoire(repertoire) {
    return fetch(
      '/saverepertoire', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(repertoire)
      }).then(res => res.json());
  }
}