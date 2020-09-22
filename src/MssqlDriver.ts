import { Driver, Connection } from "db-conn";
import { MssqlConnection } from ".";
import * as tds from "tedious";

export class MssqlDriver implements Driver {
	public async connect(config: tds.ConnectionConfig): Promise<Connection> {
		return new Promise((resolve, reject) => {
			try {
				if (!config.options) {
					config.options = {};
				}
				config.options!.useColumnNames = true;
				const client = new tds.Connection(config);
				(client as any).connect();
				client.on("connect", function (err) {
					if (err) {
						reject(err);
						return;
					}
					const conn: Connection = new MssqlConnection(client);
					resolve(conn);
				});
				client.on("error", function (err) {
					if (err) {
						reject(err);
						return;
					}
				});
			}catch(err) {
				reject(err);
			}
		});
	}
}
