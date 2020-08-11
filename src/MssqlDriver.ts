import { Driver, SQLException, Connection } from "db-conn";
import { MssqlConnection, MssqlConnectionConfig } from ".";
import { MssqlSqlError } from "./MssqlSqlError";
import * as tds from "tedious";

var config = {
  authentication: {
	type:"default",
	options: {
		userName:"sa",
		password:"12345678"		
	}
  },
  options: {
	trustServerCertificate: true,
  },
  server: "10.58.81.109"
};

export class MssqlDriver implements Driver {
	public async connect(config: tds.ConnectionConfig): Promise<Connection> {
		const client = new tds.Connection(config);
		
		return new Promise((resolve, reject) => {
			client.on('connect', function(err) {
				console.debug(err);
			  }
			);			
			client.connect(function (err: any) {
				if (err) {
					reject(new MssqlSqlError("hdb connect failed", err));
					return;
				}
				const conn: Connection = new MssqlConnection(client)
				resolve(conn);
			});
		});
	}

}