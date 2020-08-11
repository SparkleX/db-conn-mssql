import { Connection, SqlError, Result } from "db-conn";
import { MssqlConnectionConfig } from "./MssqlConnectionConfig";
import { MssqlSqlError } from "./MssqlSqlError";
const hdb  = require("hdb");

import * as tds from "tedious";

export class MssqlConnection implements Connection {
	private client: any;
	public constructor(client: any) {
		this.client = client;
	}
	public async close(): Promise<void> {
		this.client.end();
		delete this.client;
	}
	public async execute(sql: string, params?: object | any[] | undefined): Promise<Result> {
		if (params === undefined) {
			params = [];
		}
		return new Promise((resolve, reject) => {
			this.client.prepare(sql, function (err: any, statement: any){
				if (err) {
					reject(new MssqlSqlError("statement prepare error", err));
					return;
				}
				statement.exec(params, function (err: any, rows: any) {
					if (err) {
						reject(new MssqlSqlError("statement exec error", err));
						return;
					}
					const rt : Result = {};
					if(isNaN(rows) == false) {
						rt.affectedRows = rows;
					}
					if(Array.isArray(rows)) {
						rt.data = rows;
					}
					statement.drop(function(err: any){
						/* istanbul ignore next */
						if (err) {
							reject(new MssqlSqlError("statement drop error", err));
							return;
						}
						resolve(rt);
					});					
				});
			});
		});
	}
	public async executeQuery(sql: string, params?: object | any[] | undefined): Promise<object[]> {
		const rt: Result = await this.execute(sql, params);
		if(rt.data === undefined) {
			throw new MssqlSqlError("No data returned");
		}
		return rt.data;
	}
	public async setAutoCommit(autoCommit: boolean): Promise<void> {
		this.client.setAutoCommit(autoCommit);
	}
	public async commit(): Promise<void> {
		const that = this;
		return new Promise((resolve, reject) => {
			that.client.commit(function(err: any){
				if(err) {
					reject(new MssqlSqlError("commit failed", err));
					return;
				}
				resolve();
			});
		});
	}
	public async rollback(): Promise<void> {
		const that = this;
		return new Promise((resolve, reject) => {
			that.client.rollback(function(err: any){
				if(err) {
					reject(new MssqlSqlError("rollback failed", err));
					return;
				}
				resolve();
			});
		});
	}
}
