# Microsoft SQL Server driver of db-conn(JDBC)

1) based on tedious, pure javascript
2) Typescript async/await
---
Connect
```
var config:tds.ConnectionConfig = {
	authentication: {
		type: "default",
		options: {
			userName: "sa",
			password: "12345678",
		},
	},
	options: {
		trustServerCertificate: true,
	},
	server: "localhost",
};
const driver = new  MssqlDriver();
const conn: Connection = await driver.connect(config);
const rt = await conn.execute(`select * from test`);
console.debug(rt.data);
await conn.close();
```