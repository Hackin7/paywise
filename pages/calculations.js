import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import Constants from "expo-constants";
import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { Storage } from "expo-storage";

/*import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";*/

import Icon from "react-native-vector-icons/FontAwesome";
import Sk from 'skulpt'
import getCode from './algorithm'

function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function runit(prog, callback) { 
   /*let prog =  `
x = 1
y = 2
z = x + y
print(z)
   `*/
   let output = "";
   //Sk.pre = ";
   Sk.pre = "output";
   Sk.configure({
     output: (text) => {output += text;},
     read:builtinRead
   }); 
   var myPromise = Sk.misceval.asyncToPromise(function() {
       return Sk.importMainWithBody("<stdin>", false, prog, true);
   });
   myPromise.then(function(mod) {
       console.log('success');
   },
       function(err) {
       console.log(err.toString());
   });
   console.log(output)
   let val = output
   if (output !== ""){
      console.log(val)
      console.log(eval(`val=${val}`))
      callback(eval(`val=${val}`))
      //callback({'CardRecco': 'Standard Chartered smart credit card', 'SpendType': 'online', 'Savings': 0.6599999999999999})
   }
} 

function EditItem({ value, name, setValue, extraLabel, step,  }) {
	const setVal = setValue;

	function decrement() {
		setVal(value - step);
	}

	function increment() {
		setVal(value + step);
	}

	return (
		<View style={{ flexDirection: "column", width: "100%", padding: 30 }}>
			<Text style={{ fontSize: 20, marginLeft: "auto", marginRight: "auto" }}>
				{name}
			</Text>
			<View
				style={{
					flexDirection: "row",
					marginLeft: "auto",
					marginRight: "auto",
				}}
			>
				{
          step
          ?
          <TouchableOpacity
            activeOpacity={1}
            onPress={decrement}
            style={{ float: "right", marginRight: 10 }}
          >
            <Icon name="minus" size={30} color="#000" />
          </TouchableOpacity>
          :
          <></>
        }
				<Input
					style={{ width: 80*3 }}
					keyboardType="numeric"
					value={value.toString()}
					onChangeText={setVal/*(text) => {
						setVal(parseInt(text));
					}*/}
				/>
				{
          extraLabel ?
          <Text style={{ fontSize: 16, marginTop: 8, marginLeft: 10 }}>
            {extraLabel}
          </Text>
          :
          <></>
        }
        {
          step
          ?
          <TouchableOpacity
            activeOpacity={1}
            onPress={increment}
            style={{ float: "right", marginLeft: 10 }}
          >
            <Icon name="plus" size={30} color="#000" />
          </TouchableOpacity>
          :
          <></>
        }
			</View>
		</View>
	);
}

const ERROR_MESSAGE = "Error! Have you input your values correctly?";
export default function CalculationsPage({navigation, route}){
  const [bestMethod, setBestMethod] = useState(ERROR_MESSAGE)
  useEffect(()=>{
    (async () => {
        runit(getCode(route.params.totalSpent, route.params.spendingAmount, route.params.spendType), setBestMethod)
    })()
  }, [])
  
  let inputFields = ["Where", "Online", "What", "Rough Price"].map(
    (x) => {
      const [value, setValue] = useState(0)
      return {
          name:x , 
          value, 
          setValue
      }
    }
  );
  
    return <View style={styles.container}>
      <Text style={{margin: 24,  marginBottom:0, marginTop:0, fontSize: 20, fontWeight: 'bold', textAlign: 'center',}}>
        Best Method
      </Text>
      <Text style={{margin: 24, marginTop:0,  fontSize: 18, textAlign: 'center',
          color: 
          bestMethod === ERROR_MESSAGE 
          ?
          "red"
          :
          "black"
      }}>
        {bestMethod.CardRecco}
      </Text>
      
      <Text style={{margin: 24,  marginBottom:0, fontSize: 20, fontWeight: 'bold', textAlign: 'center',}}>
        Why
      </Text>
      <Text style={{margin: 24, marginTop:0,  fontSize: 18,  textAlign: 'center',}}>
        You get ${Math.round(bestMethod.Savings * 100) / 100} in savings
      </Text>
      <View
					style={{
						flexDirection: "row",
						marginLeft: "auto",
						marginRight: "auto",
					}}
				>
        <Button onPress={()=> {
            navigation.navigate("Landing", {cookie:1})
          }} status="danger" style={{ marginTop:0, width:80}}>
          Done
        </Button>
        <Button onPress={()=> {
            let modifyArray = []
            Storage.getItem({ key: `data`}).then((value)=>{
              if (!value){
                console.log("Setting Initial Data");
                //Storage.setItem({ key: `data`, value: JSON.stringify(modifyArray) });
              } else {
                console.log(value)
                modifyArray = JSON.parse(value)
              }
              modifyArray.push({
                type: route.params.spendType, 
                spendValue: route.params.spendingAmount, 
                savings: bestMethod.Savings,  
                value:route.params.spendingAmount - bestMethod.Savings
              })
              //setExpenses(JSON.parse(value));
              console.log("saved", modifyArray)
              Storage.setItem({ key: `data`, value: JSON.stringify(modifyArray) });
              navigation.navigate("Landing", {cookie:1})
            }).catch((err)=>{console.log(err);});
            
          }} status="success" style={{ marginLeft:10, marginTop:0, width:160}}>
          Log Payment
        </Button>
      </View>
    </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
