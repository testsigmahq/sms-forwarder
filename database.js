import SQLite from 'react-native-sqlite-storage';

const database_name = 'pointrealy34.db';
const database_version = '1.0';
const database_displayname = 'Sample Database';
const database_size = 500000000;
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
        // console.log('Database opened');
    },

    errorCB: (err) => {
        console.log('Error occurred while initializing the database:', err);
    },
    createAuthCodesTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS authCodes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          serverAuthCode TEXT NOT NULL
        );`,
                [],
                () => {
                    console.log('Table "authCodes" created successfully.');
                },
                (err) => {
                    console.log('Error creating "authCodes" table:', err);
                }
            );
        });
    },
    insertAuthCode: (serverAuthCode) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT OR REPLACE INTO authCodes (id, serverAuthCode) VALUES (1, ?);',
                [serverAuthCode],
                (txObj, resultSet) => {
                    console.log('AuthCode inserted or replaced successfully.');
                },
                (txObj, error) => {
                    console.log('Inserting AuthCode - userId:', id, 'serverAuthCode:', serverAuthCode);
                }
            );
        });
    },
    fetchAuthCodeById: (id) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT serverAuthCode FROM authCodes WHERE id = ?;',
                    [id],
                    (txObj, resultSet) => {
                        if (resultSet.rows.length > 0) {
                            const authCode = resultSet.rows.item(0).serverAuthCode;
                            resolve(authCode);
                        } else {
                            resolve(null);
                        }
                    },
                    (txObj, error) => {
                        console.log('Error fetching AuthCode by id:', error);
                        reject(error);
                    }
                );
            });
        });
    },
    createFilterTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS filters (id INTEGER PRIMARY KEY AUTOINCREMENT, filter_name TEXT, status TEXT,  forward_all BOOLEAN)',
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
    createResultTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS results (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, sender TEXT, receiver TEXT, timing TEXT, status TEXT,date INTEGER)',
                [],
                () => {
                    console.log('Table "results" created successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "results":', err);
                }
            );
        });
    },
    insertResults: (message, sender, receiver, timing, status,date) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO results (message, sender, receiver, timing, status,date) VALUES (?, ?, ?, ?, ?, ?)',
                    [message, sender, receiver, timing, status,date],
                    (_, { rowsAffected }) => {
                        console.log('Data inserted successfully');
                        resolve(rowsAffected); // Resolve the Promise with the number of affected rows
                    },
                    (err) => {
                        console.log('Error occurred while inserting data:', err);
                        reject(err); // Reject the Promise with the error
                    }
                );
            });
        });
    },
    createUsersTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, loginId TEXT, password TEXT, emailAddress TEXT, host TEXT, port INTEGER, showAuth BOOLEAN, showSSL BOOLEAN, showTLS BOOLEAN)',
                [],
                () => {
                    console.log('Table "Users" created successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "Users":', err);
                }
            );
        });
    },
    insertUser: (loginId, password, emailAddress, host, port, showAuth, showSSL, showTLS) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT OR REPLACE INTO Users (id, loginId, password, emailAddress, host, port, showAuth, showSSL, showTLS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [1, loginId, password, emailAddress, host, port, showAuth, showSSL, showTLS],
                    (_, { rowsAffected }) => {
                        console.log('User inserted or replaced successfully');
                        resolve(rowsAffected); // Resolve the Promise with the number of affected rows
                    },
                    (err) => {
                        console.log('Error occurred while inserting or replacing user:', err);
                        reject(err); // Reject the Promise with the error
                    }
                );
            });
        });
    },
    fetchUserById: (id) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM Users WHERE id = ?',
                    [id],
                    (_, { rows }) => {
                        const user = rows.item(0);
                        if (user) {
                            console.log('User fetched successfully:');
                            console.log('User:', user);
                            resolve(user);
                        } else {
                            reject('User not found');
                        }
                    },
                    (err) => {
                        console.log('Error occurred while fetching user:', err);
                        reject(err);
                    }
                );
            });
        });
    },

    updateUserById: (id, loginId, password, emailAddress, host, port, showAuth, showSSL, showTLS) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'UPDATE Users SET loginId = ?, password = ?, emailAddress = ?, host = ?, port = ?, showAuth = ?, showSSL = ?, showTLS = ? WHERE id = ?',
                    [loginId, password, emailAddress, host, port, showAuth, showSSL, showTLS, id],
                    (_, { rowsAffected }) => {
                        console.log(`User with ID ${id} updated successfully`);
                        resolve(rowsAffected);
                    },
                    (err) => {
                        console.log(`Error occurred while updating user with ID ${id}:`, err);
                        reject(err);
                    }
                );
            });
        });
    },


    // Function to read the contents of the "results" table
    readResults: () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM results',
                    [],
                    (_, { rows }) => {
                        const results = rows.raw();
                        resolve(results);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        });
    },

    insertFilter: (filterName, status,forward_all) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO filters (filter_name, status, forward_all) VALUES (?, ?, ?)',
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
    updateFilterForStatus: (id, status) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'UPDATE filters SET status = ? WHERE id = ?',
                    [status, id],
                    () => {
                        console.log(`filter with ID ${id} updated successfully, with value of ${status}`);
                        resolve();
                    },
                    (err) => {
                        console.log(`Error occurred while updating filter with ID ${id}:`, err);
                        reject(err);
                    }
                );
            });
        });
    },
    updateFilterForName: (id, filter_name) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'UPDATE filters SET filter_name = ? WHERE id = ?',
                    [filter_name, id],
                    () => {
                        console.log(`filter with ID ${id} updated successfully, with value of ${name}`);
                        resolve();
                    },
                    (err) => {
                        console.log(`Error occurred while updating filter with ID ${id}:`, err);
                        reject(err);
                    }
                );
            });
        });
    },
    updateFilterForCondition: (id, forward) =>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'UPDATE filters SET forward_all = ? WHERE id = ?',
                    [forward, id],
                    () => {
                        console.log(`filter with ID ${id} updated successfully, with value of ${status}`);
                        resolve();
                    },
                    (err) => {
                        console.log(`Error occurred while updating filter with ID ${id}:`, err);
                        reject(err);
                    }
                );
            });
        });
    },
    fetchAllFilters: () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM filters',
                    [],
                    (tx, results) => {
                        const len = results.rows.length;
                        const filters = [];

                        if (len > 0) {
                            // console.log(`Total filters found: ${len}`);
                            for (let i = 0; i < len; i++) {
                                const row = results.rows.item(i);
                                filters.push({
                                    id: row.id,
                                    filterName: row.filter_name,
                                    status: row.status,
                                    date:row.date,
                                });
                            }
                        } else {
                            // console.log('No filters found.');
                        }

                        resolve(filters);
                    },
                    (err) => {
                        console.log('Error occurred while fetching filters:', err);
                        reject(err);
                    }
                );
            });
        });
    },
    filterById: (filterId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM filters WHERE id = ?',
                    [filterId],
                    (tx, queryResult) => {
                        if (queryResult.rows.length > 0) {
                            const record = queryResult.rows.item(0);
                            console.log('Filter fetched successfully:');
                            console.log('Filter:', record);
                            resolve(record);
                        } else {
                            console.log('Filter not found.');
                            resolve(null);
                        }
                    },
                    (err) => {
                        console.log('Error occurred while fetching the filter:', err);
                        reject(err);
                    }
                );
            });
        });
    },

    fetchFiltersByStatus: (status) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM filters WHERE status = ?',
                    [status],
                    (tx, results) => {
                        const len = results.rows.length;
                        const filters = [];

                        if (len > 0) {
                            console.log(`Total filters found: ${len}`);
                            for (let i = 0; i < len; i++) {
                                const row = results.rows.item(i);
                                filters.push({
                                    id: row.id,
                                    filterName: row.filter_name,
                                    status: row.status,
                                });
                            }
                        } else {
                            console.log('No filters found.');
                        }

                        resolve(filters);
                    },
                    (err) => {
                        console.log('Error occurred while fetching filters:', err);
                        reject(err);
                    }
                );
            });
        });
    },

    createEmailTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS emails (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, filter_id INTEGER, FOREIGN KEY (filter_id) REFERENCES filters(id) ON DELETE CASCADE)',
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
                'CREATE TABLE IF NOT EXISTS phone_numbers (id INTEGER PRIMARY KEY AUTOINCREMENT, phone_number TEXT, filter_id INTEGER, FOREIGN KEY (filter_id) REFERENCES filters(id) ON DELETE CASCADE)',
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
                'CREATE TABLE IF NOT EXISTS url (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, type TEXT, key TEXT, filter_id INTEGER, FOREIGN KEY (filter_id) REFERENCES filters(id) ON DELETE CASCADE)',
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
                'CREATE TABLE IF NOT EXISTS sender_numbers (id INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT, sendStatus TEXT, filter_id INTEGER, FOREIGN KEY (filter_id) REFERENCES filters(id) ON DELETE CASCADE)',
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

    deleteSenderById: (id) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'DELETE FROM sender_numbers WHERE id = ?',
                    [id],
                    (_, result) => {
                        console.log('Deleted sender_numbers with id:', id);
                        resolve();
                    },
                    (_, error) => {
                        console.log('Error:', error);
                        reject(error);
                    }
                );
            });
        });
    },
    deleteResults: () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'DELETE FROM results',
                    [],
                    (_, result) => {
                        console.log('Deleted all rows from "results" table');
                        resolve();
                    },
                    (_, error) => {
                        console.log('Error:', error);
                        reject(error);
                    }
                );
            });
        });
    },

    fetchAllSender: () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM sender_numbers',
                    [],
                    (_, result) => {
                        const rows = result.rows;
                        const senderNumbers = [];

                        for (let i = 0; i < rows.length; i++) {
                            senderNumbers.push(rows.item(i));
                        }

                        console.log('Retrieved all rows from "sender_numbers" table:', senderNumbers);
                        resolve(senderNumbers);
                    },
                    (_, error) => {
                        console.log('Error:', error);
                        reject(error);
                    }
                );
            });
        });
    },


    fetchAllText: () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM texts',
                    [],
                    (_, result) => {
                        const rows = result.rows;
                        const texts = [];

                        for (let i = 0; i < rows.length; i++) {
                            texts.push(rows.item(i));
                        }

                        console.log('Retrieved all rows from "texts" table:', texts);
                        resolve(texts);
                    },
                    (_, error) => {
                        console.log('Error:', error);
                        reject(error);
                    }
                );
            });
        });
    },


    deleteTextById: (id) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'DELETE FROM texts WHERE id = ?',
                    [id],
                    (_, result) => {
                        console.log('Deleted texts with id:', id);
                        resolve();
                    },
                    (_, error) => {
                        console.log('Error:', error);
                        reject(error);
                    }
                );
            });
        });
    },

    createSettings: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, activate TEXT, notification TEXT, save TEXT)',
                [],
                () => {
                    console.log('Table "settings" created successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "settings":', err);
                }
            );
        });
    },
    insertSenderNumber: (sender, sendStatus, filterId) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO sender_numbers (sender, sendStatus, filter_id) VALUES (?, ?, ?)',
                [sender, sendStatus, filterId],
                (_, result) => {
                    console.log('Sender number inserted successfully');
                    console.log('Inserted row ID:', result.insertId);
                },
                (err) => {
                    console.log('Error occurred while inserting sender number:', err);
                }
            );
        });
    },


    createTextTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS texts (id INTEGER PRIMARY KEY AUTOINCREMENT, messageText TEXT, sendStatus TEXT, filter_id INTEGER, FOREIGN KEY (filter_id) REFERENCES filters(id) ON DELETE CASCADE)',
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

    updateTextTable: (id, text, sendStatus) => {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE texts SET messageText = ? , sendStatus = ? WHERE id = ? ',
                [text, sendStatus, id],
                () => {
                    console.log('Table "texts" updated successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "texts":', err);
                }
            );
        });
    },

    updateSenderNumber: (id, sender, sendStatus) => {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE sender_numbers SET sender = ? , sendStatus = ? WHERE id = ? ',
                [sender, sendStatus, id],
                () => {
                    console.log('Table "number" updated successfully');
                },
                (err) => {
                    console.log('Error occurred while creating the table "number":', err);
                }
            );
        });
    },

    insertText: (messageText, sendStatus, filterId) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO texts (messageText, sendStatus, filter_id) VALUES (?, ?, ?)',
                [messageText, sendStatus, filterId],
                (_, { insertId }) => {
                    console.log(`Text inserted successfully with ID: ${insertId}`);
                },
                (err) => {
                    console.log('Error occurred while inserting text:', err);
                }
            );
        });
        },

    createChangeContentTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS change_contents (id INTEGER PRIMARY KEY AUTOINCREMENT, oldWord TEXT, newWord TEXT, filter_id INTEGER, FOREIGN KEY (filter_id) REFERENCES filters(id) ON DELETE CASCADE)',
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
    insertChangeContent: (oldWord, newWord, filterId) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO change_contents (oldWord, newWord, filter_id) VALUES (?, ?, ?)',
                [oldWord, newWord, filterId],
                (_, { insertId }) => {
                    console.log(`Inserted row with id ${insertId,filterId} successfully`);
                },
                (err) => {
                    console.log('Error occurred while inserting into the "change_contents" table:', err);
                }
            );
        });
    },

    fetchChangeContents: (filterId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM change_contents WHERE filter_id = ?',
                    [filterId],
                    (_, result) => {
                        const rows = result.rows;
                        const changeContents = [];
                        for (let i = 0; i < rows.length; i++) {
                            changeContents.push(rows.item(i));
                        }
                        console.log('Fetched change_contents:', changeContents);
                        resolve(changeContents);
                    },
                    (_, error) => {
                        console.log('Error:', error);
                        reject(error);
                    }
                );
            });
        });
    },

    fetchFilters: (filterId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM filters WHERE id = ?',
                    [filterId],
                    (_, result) => {
                        const rows = result.rows;
                        const changeContents = [];
                        for (let i = 0; i < rows.length; i++) {
                            changeContents.push(rows.item(i));
                        }
                        console.log('Fetched change_contents:', changeContents);
                        resolve(changeContents);
                    },
                    (_, error) => {
                        console.log('Error:', error);
                        reject(error);
                    }
                );
            });
        });
    },

    deleteChangeContentsById: (id) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'DELETE FROM change_contents WHERE id = ?',
                    [id],
                    (_, result) => {
                        console.log('Deleted change_contents with id:', id);
                        resolve();
                    },
                    (_, error) => {
                        console.log('Error:', error);
                        reject(error);
                    }
                );
            });
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
                                        // console.log('Record:', row);

                                        if (tableName === 'emails') {
                                            records.emails.push({ id: row.id, type:"Email", text: row.email });
                                        } else if (tableName === 'phone_numbers') {
                                            records.phoneNumbers.push({ id: row.id,type: "PhoneNumber", text: row.phone_number });
                                        } else if (tableName === 'url') {
                                            records.urls.push({ id: row.id, type:"URL", text: row.url, requestMethod:row.type, key:row.key });
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
    fetchAllByRule: (filterId) => {
        const tables = ['sender_numbers', 'texts'];

        const records = {
            senderNumbers: [],
            texts: [],
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

                                        if (tableName === 'sender_numbers') {
                                            records.senderNumbers.push({ id: row.id, sender: row.sender, sendStatus: row.sendStatus });
                                        } else if (tableName === 'texts') {
                                            records.texts.push({ id: row.id, messageText: row.messageText, sendStatus: row.sendStatus });
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

    deleteEmailById: (emailId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'DELETE FROM emails WHERE id = ?',
                    [emailId],
                    () => {
                        console.log(`Email with ID ${emailId} deleted successfully`);
                        resolve();
                    },
                    (err) => {
                        console.log(`Error occurred while deleting email with ID ${emailId}:`, err);
                        reject(err);
                    }
                );
            });
        });
    },

    deleteUrlById: (urlId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'DELETE FROM url WHERE id = ?',
                    [urlId],
                    () => {
                        console.log(`URL with ID ${urlId} deleted successfully`);
                        resolve();
                    },
                    (err) => {
                        console.log(`Error occurred while deleting URL with ID ${urlId}:`, err);
                        reject(err);
                    }
                );
            });
        });
    },

    deletePhoneNumberById: (phoneNumberId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'DELETE FROM phone_numbers WHERE id = ?',
                    [phoneNumberId],
                    () => {
                        console.log(`Phone number with ID ${phoneNumberId} deleted successfully`);
                        resolve();
                    },
                    (err) => {
                        console.log(`Error occurred while deleting phone number with ID ${phoneNumberId}:`, err);
                        reject(err);
                    }
                );
            });
        });
    },
    deleteFilter: (id) =>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'DELETE FROM filters WHERE id = ?',
                    [id],
                    () => {
                        console.log(`filter with ID ${id} deleted successfully`);
                        resolve();
                    },
                    (err) => {
                        console.log(`Error occurred while deleting filter with ID ${id}:`, err);
                        reject(err);
                    }
                );
            });
        });
    },

    updateEmailById: (emailId, newEmail) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'UPDATE emails SET email = ? WHERE id = ?',
                    [newEmail, emailId],
                    () => {
                        console.log(`Email with ID ${emailId} updated successfully`);
                        resolve();
                    },
                    (err) => {
                        console.log(`Error occurred while updating email with ID ${emailId}:`, err);
                        reject(err);
                    }
                );
            });
        });
    },

    updatePhoneNumberById: (phoneNumberId, newPhoneNumber) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'UPDATE phone_numbers SET phone_number = ? WHERE id = ?',
                    [newPhoneNumber, phoneNumberId],
                    () => {
                        console.log(`Phone number with ID ${phoneNumberId} updated successfully`);
                        resolve();
                    },
                    (err) => {
                        console.log(`Error occurred while updating phone number with ID ${phoneNumberId}:`, err);
                        reject(err);
                    }
                );
            });
        });
    },


    updateUrlById: (urlId, newUrl, newType, newKey) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'UPDATE url SET url = ?, type = ?, key = ? WHERE id = ?',
                    [newUrl, newType, newKey, urlId],
                    () => {
                        console.log(`URL with ID ${urlId} updated successfully`);
                        resolve();
                    },
                    (err) => {
                        console.log(`Error occurred while updating URL with ID ${urlId}:`, err);
                        reject(err);
                    }
                );
            });
        });
    },





};

export default Database;
