import * as React from 'react';
import { useState, useEffect, createRef } from "react";
import { StyleSheet, View } from 'react-native';
import {Platform, Linking} from 'react-native';
import { Button, Input, Layout, Text } from "@ui-kitten/components";
import Storage from 'expo-storage';
import { DataTable } from 'react-native-paper';
import Constants from "expo-constants";

export default function StatisticsPage({navigation}) {
  const [expenses, setExpenses] = useState([])
  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
        //Your refresh code gets here 
      Storage.getItem({ key: `data`}).then((value)=>{
        if (value === null){
          console.log("Setting Initial Data");
          Storage.setItem({ key: `data`, value: JSON.stringify([]) });
          value = []
        }
        console.log("Getting Initial Data", value)
        setExpenses(JSON.parse(value));
        console.log(JSON.parse(value));
      }).catch((err)=>{console.log(err);});
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);


  function breakdownPerType(){
    let output = {}
    for (let i in expenses){
      if (output[expenses[i].type] === undefined){
        output[expenses[i].type] = {spendValue:0, savings: 0, value:0}
      }
      output[expenses[i].type].spendValue += expenses[i].spendValue
      output[expenses[i].type].savings += expenses[i].savings
      output[expenses[i].type].value += expenses[i].value
    }
    
    let arrayOutput = []
    for (let type in output){
      arrayOutput.push({type:type, data:output[type]})
    }
    console.log("arrayOutput", arrayOutput)
    return arrayOutput
  }
  return (
    <View style={styles.container}>
      <Text style={{margin: 24,  marginBottom:0, marginTop:0, fontSize: 20, fontWeight: 'bold', textAlign: 'center',}}>
      Breakdown of Spending
      </Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Type</DataTable.Title>
          <DataTable.Title>Supposed to spend</DataTable.Title>
          <DataTable.Title>Savings</DataTable.Title>
          <DataTable.Title>Actually Spent</DataTable.Title>
        </DataTable.Header>

        {
          breakdownPerType().map((x)=>
          <DataTable.Row>
            <DataTable.Cell>{(x.type)}</DataTable.Cell>
            <DataTable.Cell>${(x.data.spendValue)}</DataTable.Cell>
            <DataTable.Cell>${(x.data.savings)}</DataTable.Cell>
            <DataTable.Cell>${(x.data.value)}</DataTable.Cell>
          </DataTable.Row>
          )
        }

      </DataTable>
      
      <View style={{marginLeft: 'auto', marginRight: 'auto', position: 'absolute', bottom:30, width:"100%"}}>
        <Button onPress={()=> {
          navigation.navigate("Landing", {cookie:1})
        }} color="#696969" style={{ backgroundColor: "#696969", marginTop:0, width:80,
          marginLeft: 'auto', marginRight: 'auto',
          }}>
          Back
        </Button>
        <Button onPress={()=> {
          //navigation.navigate("Settings", {cookie:1})
          Storage.setItem({ key: `data`, value: JSON.stringify([]) });
          navigation.navigate("Landing", {cookie:1})
        }} style={{ marginTop:10, width: 160, marginLeft: 'auto', marginRight: 'auto',}}
          status="basic"
        >
          Reset data
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 0,
  },
  paragraph: {
    margin: 5,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
