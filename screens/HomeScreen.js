import * as WebBrowser from 'expo-web-browser';
import Touchable from 'react-native-platform-touchable';
import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  AsyncStorage
} from 'react-native';

import Swipeout from 'react-native-swipeout';

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listItems: [],
      formValue: ""
    }
    this.handleFormValueChange = this.handleFormValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.markDone = this.markDone.bind(this);
  }


  componentDidMount() {
    _retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('listItems');
        if (value !== null) {
          console.log(value);
          const listItems = JSON.parse(value);
          this.setState({listItems})
        }
      } catch (error) {
        // Error retrieving data
      }
    };
    _retrieveData();
  }

  componentDidUpdate() {
    _storeData = async () => {
      try {
        const listItems = JSON.stringify(this.state.listItems)
        await AsyncStorage.setItem('listItems', listItems);
      } catch (error) {
        // Error saving data
      }
    };
    _storeData();
  }

  handleFormValueChange (formValue) {
    this.setState({ formValue });
  }

  handleSubmit() {
    let listItems = [...this.state.listItems];
    const getRandomId = () => {
      return Math.random() * (99999 - 10000) + 10000;
    }
    const newItem = {
      name: this.state.formValue,
      id: getRandomId(),
      checked: false
    }
    listItems.push(newItem);
    this.setState({listItems, formValue: ""})
  }

    deleteItem = id => {
      console.log('id: ' + id)
    // Get index of object in array
     const index = this.state.listItems.findIndex(item => item.id === id);
      console.log(index)
      // delete object from array without mutating it
       let listItems = [...this.state.listItems];
       listItems.splice(index, 1);
       this.setState({listItems});
    }

     markDone (id) {
      // Get index of object in array
       const index = this.state.listItems.findIndex(item => item.id === id);
  
        // set state of object in array without mutating it
         let listItems = [...this.state.listItems];
         let item = {...listItems[index]};
         item.checked = !item.checked; 
         listItems[index] = item;
         this.setState({listItems});
      }
    

  render() {

  
  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={
              __DEV__
                ? require('../assets/images/groceries.png')
                : require('../assets/images/groceries.png')
            }
            style={styles.logo}
          />
        </View>
        <View>
          <TextInput 
          style={styles.inputField} 
          value={this.state.formValue}
          onChangeText={this.handleFormValueChange}
          onSubmitEditing={this.handleSubmit}
          />
          {/*
          <TouchableOpacity
            style={styles.submitButton}
            onPress={this.handleSubmit}
          >
            <Text style={styles.submitButtonText}>Add to list</Text>
          </TouchableOpacity>*/}
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
      

        <View style={styles.helpContainer}>
          <TouchableOpacity>
            {this.state.listItems.map(item => {
              return (
                <Swipeout right={
                  [{
                    text: 'Delete',
                    backgroundColor: 'red',
                    onPress: () => { this.deleteItem(item.id) }
                  }]
                }
                autoClose={true}
                backgroundColor= 'transparent'
                key={item.id}>
                  <Touchable  
                  style={styles.listItem}
                  onPress={e => this.markDone(item.id)}>

                      <Text style={item.checked ? styles.checked : styles.listItemText}>{item.name}</Text>

                </Touchable>
              </Swipeout>
              )
            })}
            
          </TouchableOpacity>
        </View>
      </ScrollView>
   
    </View>
  );
  }
}
HomeScreen.navigationOptions = {
  header: null,
};



const styles = StyleSheet.create({
  inputField: {
    borderWidth: 1,
    borderColor: '#d6d7da',
    height: 40,
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 15,
    paddingLeft: 10
  },
  submitButton: {
    height: 40,
    marginLeft: 25,
    marginRight: 25,
    backgroundColor: '#435E82',
    color: 'white'
  },
  submitButtonText: {
    color: 'white',
    height: 40,
    lineHeight: 40,
    textAlign: 'center'
  },
  listItem: {
    width: 100 + '%',
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
    borderBottomWidth: 1,
    borderColor: '#d6d7da',
  },
  listItemText: {
    fontSize: 20
  },
  checked: {
    color: '#777',
    textDecorationLine: 'line-through',
    fontSize: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 25,
    marginLeft: -10,
  }

});
