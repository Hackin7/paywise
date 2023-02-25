import * as React from 'react';
import { useState, useEffect, createRef } from "react";
import { StyleSheet, View , Image} from 'react-native';
import {Platform, Linking} from 'react-native';
import { Button, Input, Layout, Text } from "@ui-kitten/components";
import Storage from 'expo-storage';

export default function LandingPage({navigation}) {
  useEffect(() => {
      navigation.setOptions({
          headerShown: false 
          //headerRight: () => <Button onPress={addColor} title="Add" />,
      });
  });
  
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

  function calculateExpenses(expenses){
      let spent = 0;
      for (let i=0; i<expenses.length; i++){
          spent += expenses[i].value
      }
      return spent
  }
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize:40, maxWidth:"80%"}}>PayWi$e</Text>
        {/*<Image style={{width:"90%"}} source={require('../assets/logo.png')} />*/}
        <Text style={{margin:10, maxWidth:"50%", textAlign:'center' }}>Decide how best to pay</Text>
        <Text style={{marginBottom:10, maxWidth:"50%", textAlign:'center' }}>${calculateExpenses(expenses).toFixed(2)} spent so far</Text>
        <View style={{padding:5}}></View>
        
        <Button onPress={()=> {
          navigation.navigate("Form", {cookie:1})
        }} color="#696969" style={{ backgroundColor: "#696969", marginTop:0}}>
          Payment
        </Button>
        <Button onPress={()=> {
          //navigation.navigate("Settings", {cookie:1})
          //Storage.setItem({ key: `data`, value: JSON.stringify([]) });
          navigation.navigate("Statistics", {cookie:1})
        }} style={{ marginTop:10}}
          status="basic"
        >
          Statistics
        </Button>
    </View>
  );
}
