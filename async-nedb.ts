import * as NeDBDataStore from "NeDB";

export default class AsyncNeDBDataStore<
    T extends Object
> extends NeDBDataStore {
    constructor();
    constructor(path: string);
    constructor(options: any);
    constructor(args?: any) {
        super(args);
    }

    public loadDatabaseAsync(): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => super.loadDatabase((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        ));
    }

    public ensureIndexAsync(options: Object): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => super.ensureIndex(<any>options, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        ));
    }

    public removeIndexAsync(fieldName: string): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => super.removeIndex(fieldName, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        ));
    }

    public insertAsync(newDoc: T): Promise<T & { _id?: string; }> {
        return new Promise<T & { _id?: string; }>(
            (resolve, reject) => super.insert(newDoc, (err, document) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(document);
                }
            }
        ));
    }

    public countAsync(query: any): Promise<number> {
        return new Promise<number>(
            (resolve, reject) => super.count(query, (err, n) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(n);
                }
            }
        ));
    }

    public findAsync(query: any): Promise<Array<T & { _id?: string; }>>;
    public findAsync(query: any, projection: T): Promise<Array<T & { _id?: string; }>>;
    public findAsync(query: any, projection?: T): Promise<Array<T & { _id?: string; }>> {
        if (projection) {
            return new Promise<Array<T & { _id?: string; }>>(
                (resolve, reject) => super.find<T>(
                    query, projection, (err, documents) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(documents);
                        }
                    }
                )
            );
        } else {
            return new Promise<Array<T & { _id?: string; }>>(
                (resolve, reject) => super.find<T>(query, (err, documents) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(documents);
                    }
                }
            ));
        }
    }


    public findOneAsync(query: any): Promise<T & { _id?: string; }>;
    public findOneAsync(query: any, projection: T): Promise<T & { _id?: string; }>;
    public findOneAsync(query: any, projection?: T): Promise<T & { _id?: string; }> {
        if (projection) {
            return new Promise<T & { _id?: string; }>(
                (resolve, reject) => super.findOne<T>(
                    query, projection, (err, document) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(document);
                        }
                    }
                )
            );
        } else {
            return new Promise<T & { _id?: string; }>(
                (resolve, reject) => super.findOne<T>(query, (err, document) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(document);
                    }
                }
            ));
        }
    }

    public updateAsync(
        query: any, updateQuery: any
    ): Promise<{
        numberOfUpdated: number, affectedDocuments: any, upsert: boolean
    }>;
    public updateAsync(
        query: any, updateQuery: any, options?: any
    ): Promise<{
        numberOfUpdated: number, affectedDocuments: any, upsert: boolean
    }> {
        return new Promise(
            (resolve, reject) => super.update<T>(
                query, updateQuery, options || {},
                (err, numberOfUpdated, affectedDocuments, upsert) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ numberOfUpdated, affectedDocuments, upsert });
                    }
                }
            )
        );
    }

    public removeAsync(query: any): Promise<number>;
    public removeAsync(query: any, options: any): Promise<number>;
    public removeAsync(query: any, options?: any): Promise<number> {
        if (options) {
            return new Promise(
                (resolve, reject) => super.remove(query, options, (err, n) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(n);
                    }
                }
            ));
        } else {
            return new Promise(
                (resolve, reject) => super.remove(query, (err, n) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(n);
                    }
                }
            ));
        }
    }
}
