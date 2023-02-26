import * as React from 'react';
import { useState, useEffect, createRef } from "react";
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import {Platform, Linking} from 'react-native';
import { Button, Input, Layout, Text } from "@ui-kitten/components";
import Storage from 'expo-storage';
import { DataTable } from 'react-native-paper';
import Constants from "expo-constants";
import {
  PieChart,
} from 'react-native-chart-kit';

const MyPieChart = ({data, property, header}) => {
  console.log("piechart", data)
  let keys = ["online", "fb", "retail", "travel"]
  let tempdata=data
  for (let type in keys){
    if (tempdata[keys[type]] === undefined){
      tempdata[keys[type]] = {[property]:1}
      console.log(tempdata)
    }
      //data[keys[type]] = {[property]:1}
      //console.log(data)
    //}
  }
  return (
    <>
      <Text style={{margin: 24,  marginBottom:0, marginTop:10, fontSize: 20, fontWeight: 'bold', textAlign: 'center',}}>{header}</Text>
      <PieChart
        data={[
          {
            name: 'Online',
            population: tempdata.online[property],
            color: '#4ade80',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'F&B',
            population: tempdata.fb[property],
            color: '#fde047',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Retail',
            population: tempdata.retail[property],
            color: '#60a5fa',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Travel',
            population: tempdata.travel[property],
            color: '#f87171',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
        ]}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
         //for the absolute number remove if you want percentage
      />
    </>
  );
};


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
    return output
  }
  function breakdownPerTypeArray(){
    let output = breakdownPerType()
    let arrayOutput = []
    for (let type in output){
      arrayOutput.push({type:type, data:output[type]})
    }
    console.log("arrayOutput", arrayOutput)
    return arrayOutput
  }
  return (
    <ScrollView style={styles.container}>
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
          breakdownPerTypeArray().map((x, index)=>
          <DataTable.Row key={index}>
            <DataTable.Cell>{({
              "online": "Online", 
              "fb": "F&B", 
              "retail": "Retail", 
              "travel":"Travel",
            }[x.type])}</DataTable.Cell>
            <DataTable.Cell>${(x.data.spendValue)}</DataTable.Cell>
            <DataTable.Cell>${(x.data.savings)}</DataTable.Cell>
            <DataTable.Cell>${(x.data.value)}</DataTable.Cell>
          </DataTable.Row>
          )
        }

      </DataTable>
      
      <MyPieChart data={breakdownPerType()} property={"spendValue"} header="Value to spend (without savings) "/>
      <MyPieChart data={breakdownPerType()} property={"savings"} header="Saved Value"/>
      <MyPieChart data={breakdownPerType()} property={"value"} header="Final Spend Value"/>
      <View style={{marginLeft: 'auto', marginRight: 'auto',/* position: 'absolute', bottom:30,*/ width:"100%"}}>
        <Button onPress={()=> {
          navigation.navigate("Landing", {cookie:1})
        }} color="#696969" style={{ backgroundColor: "#696969", marginTop:0, width:80,
          marginLeft: 'auto', marginRight: 'auto',
          }}>
          Back
        </Button>
        <Button onPress={()=> {
          Storage.setItem({ key: `data`, value: JSON.stringify([]) });
          navigation.navigate("Landing", {cookie:1})
        }} style={{ marginTop:0, width:160, marginBottom:40,
          marginLeft: 'auto', marginRight: 'auto',
        }} status="basic">
          Reset data
        </Button>
      </View>
    </ScrollView>
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
