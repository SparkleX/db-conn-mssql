import { MssqlConnection } from "../MssqlConnection";
import { Connection } from "db-conn";
import { MssqlDriver } from "../MssqlDriver";
import * as tds from "tedious";

const driver = new  MssqlDriver();

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

async function initDatabase(conn: Connection):Promise<void> {
	let rt = null;
	try {
		rt = await conn.execute("drop database test");
	}catch(e) {
	}
	rt = await conn.execute("create database test");
	rt = await conn.execute("use test");
	rt = await conn.execute("create table TEST( ID INTEGER not null,primary key (ID))");
}

test("Connect", async () => {

	const conn: Connection = await driver.connect(config);
	await initDatabase(conn);
	let rt = await conn.execute(`insert into TEST(ID) values(1)`);
	expect(rt.affectedRows).toStrictEqual(1);

	const data = await conn.executeQuery(`select * from TEST`);
	expect(data).toStrictEqual([{ID:1}]);

	await conn.close();
});
test("Failed connect 1", async () => {
	try {
		const conn: Connection = await driver.connect({});
		fail();
	}catch(e) {
		//expect(e.message).toBe(true);
	}
});
test("Failed connect 2", async () => {
	try {
		const conn: Connection = await driver.connect({
			authentication: {
				type: "default",
				options: {
					userName: "sa",
					password: "****",
				},
			},
			options: {
				trustServerCertificate: true,
			},
			server: "localhost",
		  });
		  fail();
	}catch(e) {
		//expect(e).toBe(true);
	}
});


test("Faied execute", async () => {
	const conn: Connection = await driver.connect(config);
	try {
		let rt = await conn.execute("hello");
		fail();
	}catch(e) {
		//expect(e).toBe(true);
	}
	await conn.close();
});
test("commit", async () => {
	const conn: Connection = await driver.connect(config);
	await conn.setAutoCommit(false);
	await conn.commit();
	await conn.close();
});
test("commit failed", async () => {
	const conn: Connection = await driver.connect(config);
	(conn as any).client.close();
	try {
		await conn.commit();
		fail();
	}catch(e) {
		//expect(e).toBe(true);
	}
});
test("rollback", async () => {
	const conn: Connection = await driver.connect(config);
	await initDatabase(conn);
	await conn.setAutoCommit(false);
	await conn.execute(`insert into test("ID") values(1)`);
	await conn.rollback();
	const rt = await conn.execute(`select * from test`);
	expect(rt.data!.length).toBe(0);
	await conn.close();
});

test("rollback failed", async () => {
	const conn: Connection = await driver.connect(config);
	(conn as any).client.close();
	try {
		await conn.rollback();
		fail();
	}catch(e) {
		//expect(e).toBe(true);
	}
});


test("Params", async () => {
	const conn: Connection = await driver.connect(config);
	await initDatabase(conn);
	let rt = await conn.execute(`insert into TEST(ID) values(@a)`, {a:1});
	expect(rt.affectedRows).toStrictEqual(1);
	const data = await conn.executeQuery(`select * from "TEST"`);
	expect(data).toStrictEqual([{ID:1}]);
	await conn.close();
});
