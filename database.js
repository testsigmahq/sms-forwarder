import SQLite from 'react-native-sqlite-storage';

const database_name = 'SMSPoint.db';
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
    createFilterTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS filters (id INTEGER PRIMARY KEY AUTOINCREMENT, filter_name TEXT, status TEXT)',
                [],
                () => {
                    console.log('Table "filters" created successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "filters":', err);
                }
            );
        });
    },
    insertFilter: (filterName, status) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO filters (filter_name, status) VALUES (?, ?)',
                    [filterName, status],
                    (tx, insertResult) => {
                        const { insertId } = insertResult;
                        if (insertId) {
                            tx.executeSql(
                                'SELECT * FROM filters WHERE id = ?',
                                [insertId],
                                (tx, queryResult) => {
                                    const record = queryResult.rows.item(0);
                                    console.log('Filter inserted successfully:');
                                    console.log('Filter:', record);
                                    resolve(record);
                                },
                                (err) => {
                                    console.log('Error occurred while fetching the inserted filter:', err);
                                    reject(err);
                                }
                            );
                        }
                    },
                    (err) => {
                        console.log('Error occurred while inserting filter:', err);
                        reject(err);
                    }
                );
            });
        });
    },

    createEmailTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS emails (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, filter_id INTEGER, FOREIGN KEY (filter_id) REFERENCES filters(id))',
                [],
                () => {
                    console.log('Table "emails" created successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "emails":', err);
                }
            );
        });
    },

    insertEmails: (emails, filterId) => {
        db.transaction((tx) => {
            emails.forEach((email) => {
                tx.executeSql(
                    'INSERT INTO emails (email, filter_id) VALUES (?, ?)',
                    [email, filterId],
                    () => {
                        console.log(`Email "${email}" inserted successfully into the "emails" table`);
                    },
                    (err) => {
                        console.log(`Error occurred while inserting email "${email}" into the "emails" table:`, err);
                    }
                );
            });
        });
    },

    createPhoneNumberTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS phone_numbers (id INTEGER PRIMARY KEY AUTOINCREMENT, phone_number TEXT, filter_id INTEGER, FOREIGN KEY (filter_id) REFERENCES filters(id))',
                [],
                () => {
                    console.log('Table "phone_numbers" created successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "phone_numbers":', err);
                }
            );
        });
    },

    insertPhoneNumbers: (phoneNumbers, filterId) => {
        phoneNumbers.forEach((phoneNumber) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO phone_numbers (phone_number, filter_id) VALUES (?, ?)',
                    [phoneNumber, filterId],
                    () => {
                        console.log(`Phone number "${phoneNumber}" inserted successfully into the "phone_numbers" table`);
                    },
                    (err) => {
                        console.log(`Error occurred while inserting phone number "${phoneNumber}" into the "phone_numbers" table:`, err);
                    }
                );
            });
        });
    },

    createUrlTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS url (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, type TEXT, key TEXT, filter_id INTEGER, FOREIGN KEY (filter_id) REFERENCES filters(id))',
                [],
                () => {
                    console.log('Table "url" created successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "url":', err);
                }
            );
        });
    },

    insertUrls: (urls, filterId) => {
        db.transaction((tx) => {
            urls.forEach((url) => {
                tx.executeSql(
                    'INSERT INTO url (url, type, key, filter_id) VALUES (?, ?, ?, ?)',
                    [url.url, url.requestMethod, url.key, filterId],
                    () => {
                        console.log('URL inserted successfully');
                    },
                    (err) => {
                        console.log('Error occurred while inserting URL:', err);
                    }
                );
            });
        });
    },


    createSenderNumberTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS sender_numbers (id INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT, sendStatus TEXT, filter_id INTEGER, FOREIGN KEY (filter_id) REFERENCES filters(id))',
                [],
                () => {
                    console.log('Table "sender_numbers" created successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "sender_numbers":', err);
                }
            );
        });
    },

    createTextTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS texts (id INTEGER PRIMARY KEY AUTOINCREMENT, messageText TEXT, sendStatus TEXT, filter_id INTEGER, FOREIGN KEY (filter_id) REFERENCES filters(id))',
                [],
                () => {
                    console.log('Table "texts" created successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "texts":', err);
                }
            );
        });
    },

    createChangeContentTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS change_contents (id INTEGER PRIMARY KEY AUTOINCREMENT, messageTemplate TEXT, oldWord TEXT, newWord TEXT, filter_id INTEGER, FOREIGN KEY (filter_id) REFERENCES filters(id))',
                [],
                () => {
                    console.log('Table "change_contents" created successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "change_contents":', err);
                }
            );
        });
    },


    fetchAllRecords: (filterId) => {
        const tables = ['emails', 'phone_numbers', 'url'];

        const records = {
            emails: [],
            phoneNumbers: [],
            urls: [],
        };

        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                    tables.forEach((tableName) => {
                        tx.executeSql(
                            `SELECT id, * FROM ${tableName} WHERE filter_id = ?`,
                            [filterId],
                            (tx, results) => {
                                const len = results.rows.length;
                                if (len > 0) {
                                    console.log(`Records from table "${tableName}":`);
                                    for (let i = 0; i < len; i++) {
                                        const row = results.rows.item(i);
                                        console.log('Record:', row);

                                        if (tableName === 'emails') {
                                            records.emails.push({ id: row.id, email: row.email });
                                        } else if (tableName === 'phone_numbers') {
                                            records.phoneNumbers.push({ id: row.id, phoneNumber: row.phone_number });
                                        } else if (tableName === 'url') {
                                            records.urls.push({ id: row.id, url: row.url });
                                        }
                                    }
                                } else {
                                    console.log(`No records found in table "${tableName}".`);
                                }
                            },
                            (err) => {
                                console.log(`Error occurred while fetching records from table "${tableName}":`, err);
                                reject(err);
                            }
                        );
                    });
                },
                (error) => {
                    console.log('Transaction error:', error);
                    reject(error);
                },
                () => {
                    console.log('Transaction completed');
                    resolve(records);
                });
        });
    },



};

export default Database;
