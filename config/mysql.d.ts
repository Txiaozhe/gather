/**
 * 
 */

export declare function getConn(cb: (err: Error, conn: any) => {})

export declare function asyncGetConn(): Promise<T>;

export declare function asyncQuery(sql: string, params: [any], conn: PoolConnection): Promise<T>;
