import { SQLException } from "db-conn";

export class MssqlException extends SQLException {
	public constructor(message: string, source?: any) {
		super(`${message}: ${source?.message}`);
	}
}