const conn = new Mongo();
db = conn.getDB("globalCollections");

db.createUser({
  user: "appUser",
  pwd: "password",
  roles: [{ role: "readWrite", db: "globalCollections" }],
  passwordDigestor: "server"
});