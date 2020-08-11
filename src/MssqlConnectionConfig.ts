export interface MssqlConnectionConfig {
	host?     : string,
	port?     : number,
	user?     : string,
	password? : string,
	useCesu8? : boolean,
	databaseName?: string
}