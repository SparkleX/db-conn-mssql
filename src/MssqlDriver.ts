import { Driver, SQLException, Connection } from "db-conn";
import { MssqlConnection } from ".";
import { MssqlException } from "./MssqlException";
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
						reject(new MssqlException("", err));
						return;
					}
					const conn: Connection = new MssqlConnection(client);
					resolve(conn);
				});
			}catch(err) {
				reject(new MssqlException("", err));
			}
		});
	}
}
