import { SqlError } from "db-conn";

export class MssqlSqlError extends SqlError {
	public constructor(message: string, source?: any) {
		super(`${message}: ${source?.message}`);
	}
}