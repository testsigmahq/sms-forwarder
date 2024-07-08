import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, Dimensions, StyleSheet, TouchableOpacity, Button, TextInput} from 'react-native';
import { Input } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import {useDispatch} from "react-redux";
import SimData from 'react-native-sim-data'
import Database from "../../repository/database";
import {getCurrentTime} from "../../utils/data";
const MoreSettings = ({saveClicked,id,filterIdForCreate}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const simInfo = SimData.getSimInfo();
        console.log(getCurrentTime("INFO") + "SIM card info:", simInfo);
    }, []);
    const [inputValue, setInputValue] = useState();
    const [inputValueUpdated, setInputValueUpdated] = useState(false);

    React.useEffect(() => {
        if (saveClicked) {
            onSave();
        }
    }, [saveClicked]);

    function onSave() {
        if(filterIdForCreate){
            Database.insertFilter(inputValue || `Filter ${filterIdForCreate}`, "active",0)
                .then((filter) => {
                    console.log(getCurrentTime("INFO") + 'Inserted filter:', filter.id);
                })
                .catch((error) => {
                    console.log(getCurrentTime("ERROR") + 'Error occurred:', error);
                });
        }
    }
    useEffect(()=>{
        if(id) {
            Database.filterById(id).then((res)=>setInputValue(res.filter_name));
        }
    },[]);
    const handleChangeText = (value) => {
        setInputValue(value);
        setInputValueUpdated(true);
    };
    useEffect(() => {
        if (inputValueUpdated) {
            updateDatabase();
        }
    }, [inputValueUpdated]);

    const updateDatabase = () => {
        if (id) {
            Database.updateFilterForName(id, inputValue)
                .then(() => {
                    console.log(getCurrentTime("INFO") + 'Filter name updated successfully.');
                })
                .catch((error) => {
                    console.log(getCurrentTime("ERROR") + 'Error occurred:', error);
                });
        }
        setInputValueUpdated(false);
    };

    const [open1, setOpen1] = useState(false);
    const [items1, setItems1] = useState([
        { label: 'SIM 1', value: 'SIM 1' },
        { label: 'SIM 2', value: 'SIM 2' },
    ]);
    const [value1, setValue1] = useState(null);

    const [showNotification, setShowNotification] = useState(false);
    const [saveResults, setSaveResults] = useState(false);

    const toggleNotification = () => {
        setShowNotification(!showNotification);
    };

    const toggleSaveResults = () => {
        setSaveResults(!saveResults);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ margin: 20, fontWeight: '500', fontSize: 18 }}>More Settings</Text>
            <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Filter Name"
                    value={inputValue}
                    onChangeText={handleChangeText}
                    style={styles.input}
                />
            </View>
            <View style={[styles.blackCard,{zIndex:2}]}>
                <Text style={styles.text}>SIM Number</Text>
                <View style={styles.line} />
                <View style={{ alignSelf: "center", marginVertical: 15 }}>
                    <DropDownPicker
                        style={[styles.dropDown]}
                        dropDownDirection="AUTO"
                        placeholder={'All numbers'}
                        items={items1}
                        open={open1}
                        value={value1}
                        setOpen={setOpen1}
                        setValue={setValue1}
                        setItems={setItems1}
                        stickyHeader={true}
                        containerStyle={{
                            width: deviceWidth * 0.87,
                        }}
                        defaultNull
                    />
                </View>
            </View>

            <View style={[styles.blackCard, { marginTop: 10 }]}>
                <Text style={styles.text}>Options</Text>
                <View style={styles.line} />
                <TouchableOpacity style={styles.optionContainer} onPress={toggleNotification}>
                    <Text style={{ fontSize: 16 }}>Show result Notification</Text>
                    <View style={[styles.toggleButton, showNotification && styles.toggleButtonActive]}>
                        <View style={[styles.toggleKnob, showNotification && styles.toggleKnobActive]} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionContainer} onPress={toggleSaveResults}>
                    <Text style={{ fontSize: 16 }}>Save Results</Text>
                    <View style={[styles.toggleButton, saveResults && styles.toggleButtonActive]}>
                        <View style={[styles.toggleKnob, saveResults && styles.toggleKnobActive]} />
                    </View>
                </TouchableOpacity>
                <View style={{ margin: 10 }}>
                    <Button title="WORKING TIME" color={'#1AA874'}></Button>
                </View>
            </View>

        </SafeAreaView>
    );
};

const deviceWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    inputContainer: {
        marginHorizontal: 10,
    },
    inputBox: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    inputBoxInner: {
        borderBottomWidth: 0,
    },
    blackCard: {
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 0.5,
        borderRadius: 4,
        width: deviceWidth*0.95,
        alignSelf: 'flex-start',
        margin: 10,
        marginTop: 18,
    },
    line: {
        borderColor: '#000',
        borderWidth: 0.2,
        width:deviceWidth*0.9,
        alignSelf:"center"
    },
    text: {
        fontSize: 20,
        fontWeight: '400',
        alignSelf: 'center',
        margin: 5,
    },
    dropDown: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        alignContent: 'center',
        borderRadius: 5,
        borderStyle :"dashed",
        borderColor: 'black',
        borderWidth: 1.5,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    toggleButton: {
        width: 28,
        height: 17,
        borderRadius: 8,
        backgroundColor: '#ccc',
        justifyContent: 'center',
    },
    toggleButtonActive: {
        backgroundColor: '#B1D8B7',
    },
    toggleKnob: {
        width: 15,
        height: 15,
        borderRadius: 7,
        alignSelf: 'flex-start',
        backgroundColor: '#fff',

    },
    toggleKnobActive: {
        alignSelf: 'flex-end',
        backgroundColor: 'green',

    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default MoreSettings;
