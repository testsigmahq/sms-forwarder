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
                'CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, phoneNumber TEXT, url TEXT)',
                [],
                () => {
                    console.log('Table created successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table:', err);
                }
            );
        });
    },

    insertData: (email, phoneNumber, url) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO data (email, phoneNumber, url) VALUES (?, ?, ?)',
                [email, phoneNumber, JSON.stringify(url)],
                () => {
                    console.log('Data inserted successfully');
                },
                (err) => {
                    console.log('Error occurred while inserting data:', err);
                }
            );
        });
    },

    getAllData: (callback) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM data',
                [],
                (tx, results) => {
                    const data = [];
                    const len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        data.push(results.rows.item(i));
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
