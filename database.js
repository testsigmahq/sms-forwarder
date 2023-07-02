import SQLite from 'react-native-sqlite-storage';

const database_name = 'sample.db';
const database_version = '1.0';
const database_displayname = 'Sample Database';
const database_size = 200000;
let db;

const Database = {
    initDB: () => {
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
            Database.openCB,
            Database.errorCB
        );
    },

    openCB: () => {
        console.log('Database opened');
    },

    errorCB: (err) => {
        console.log('Error occurred while initializing the database:', err);
    },

    createTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, phoneNumber TEXT, active INTEGER)',
                [],
                () => {
                    console.log('Table "data" created successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "data":', err);
                }
            );

            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, requestMethod TEXT, url TEXT, key TEXT, dataId INTEGER, FOREIGN KEY (dataId) REFERENCES data(id))',
                [],
                () => {
                    console.log('Table "urls" created successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "urls":', err);
                }
            );
        });
    },

    insertData: (email, phoneNumber, urls) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO data (email, phoneNumber, active) VALUES (?, ?, ?)',
                [email, phoneNumber, 1],
                (_, result) => {
                    const dataId = result.insertId;

                    urls.forEach((url) => {
                        tx.executeSql(
                            'INSERT INTO urls (requestMethod, url, key, dataId) VALUES (?, ?, ?, ?)',
                            [url.requestMethod, url.url, url.key, dataId],
                            () => {
                                console.log('URL inserted successfully');
                            },
                            (err) => {
                                console.log('Error occurred while inserting URL:', err);
                            }
                        );
                    });
                },
                (err) => {
                    console.log('Error occurred while inserting data:', err);
                }
            );
        });
    },

    updateData: (id, email, phoneNumber, urls) => {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE data SET email = ?, phoneNumber = ? WHERE id = ?',
                [email, phoneNumber, id],
                () => {
                    console.log('Data updated successfully');
                },
                (err) => {
                    console.log('Error occurred while updating data:', err);
                }
            );

            tx.executeSql(
                'DELETE FROM urls WHERE dataId = ?',
                [id],
                () => {
                    urls.forEach((url) => {
                        tx.executeSql(
                            'INSERT INTO urls (requestMethod, url, key, dataId) VALUES (?, ?, ?, ?)',
                            [url.requestMethod, url.url, url.key, id],
                            () => {
                                console.log('URL inserted successfully');
                            },
                            (err) => {
                                console.log('Error occurred while inserting URL:', err);
                            }
                        );
                    });
                },
                (err) => {
                    console.log('Error occurred while deleting URLs:', err);
                }
            );
        });
    },

    getAllData: (callback) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT data.id, data.email, data.phoneNumber, urls.requestMethod, urls.url, urls.key FROM data LEFT JOIN urls ON data.id = urls.dataId',
                [],
                (tx, results) => {
                    const data = [];
                    const len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        const row = results.rows.item(i);
                        const existingData = data.find((d) => d.id === row.id);
                        if (existingData) {
                            existingData.urls.push({
                                requestMethod: row.requestMethod,
                                url: row.url,
                                key: row.key,
                            });
                        } else {
                            data.push({
                                id: row.id,
                                email: row.email,
                                phoneNumber: row.phoneNumber,
                                urls: [
                                    {
                                        requestMethod: row.requestMethod,
                                        url: row.url,
                                        key: row.key,
                                    },
                                ],
                            });
                        }
                    }
                    callback(data);
                },
                (err) => {
                    console.log('Error occurred while retrieving data:', err);
                }
            );
        });
    },
};

export default Database;
