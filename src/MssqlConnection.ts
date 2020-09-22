import { Connection, Result } from "db-conn";
import * as tds from "tedious";

export class MssqlConnection implements Connection {
	private client: tds.Connection;
	public constructor(client: any) {
		this.client = client;
	}
	public async close(): Promise<void> {
		this.client.close()
		delete this.client;
	}
	public async execute(sql: string, params?: object | any[] | undefined): Promise<Result> {
		if (params === undefined) {
			params = [];
		}
		let rt: Result = {data:[],affectedRows:0};
		return new Promise((resolve, reject) => {
			const request = new tds.Request(sql, function(err, rowCount) {
				if(err) {
					reject(err);
					return;
				}
				rt.affectedRows = rowCount;
			});
			request.on('error', function (err) { 
				reject(err);
			});
			request.on('row', function (columns) { 
				const object: any = {};
				for(const key in columns) {
					object[key] = columns[key].value;
				}
				rt.data!.push(object);
			});
			request.on("requestCompleted", function () { 
				resolve(rt);
			});

			if(Array.isArray(params)) {

			} else {
				this.addParameterObject(request, params as object);
			}
			this.client.execSql(request);
		});
	}
	private addParameterObject(request: tds.Request, params: object) {
		for(const name in params) {
			const value = (params as any)[name];
			const type = isNaN(value)?tds.TYPES.NVarChar:tds.TYPES.Int;
			request.addParameter(name, type ,value);
		}		
	}
	public async executeQuery(sql: string, params?: object | any[] | undefined): Promise<object[]> {
		const rt: Result = await this.execute(sql, params);
		return rt.data!;
	}
	public async setAutoCommit(autoCommit: boolean): Promise<void> {
		return new Promise((resolve, reject) => {
			if(autoCommit) {
				resolve();
			} else {
				this.client.beginTransaction(err => {
					if(err) {
						reject(err);
						return;
					}
					resolve();
				});
			}			
		});
	}
	public async commit(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client.commitTransaction(function(err) {
				if(err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}

	public async rollback(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client.rollbackTransaction(function(err) {
				if(err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}
}
