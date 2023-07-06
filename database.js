import SQLite from 'react-native-sqlite-storage';

const database_name = 'SMSPointss.db';
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

    createResultTable: () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS results (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, sender TEXT, receiver TEXT, timing TEXT, status TEXT)',
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
    insertResults: (message, sender, receiver, timing, status) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO results (message, sender, receiver, timing, status) VALUES (?, ?, ?, ?, ?)',
                    [message, sender, receiver, timing, status],
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
    updateFilter: (id, status) =>{
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
                'CREATE TABLE IF NOT EXISTS change_contents (id INTEGER PRIMARY KEY AUTOINCREMENT, oldWord TEXT, newWord TEXT, filter_id INTEGER, FOREIGN KEY (filter_id) REFERENCES filters(id))',
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
