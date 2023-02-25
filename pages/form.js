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
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';

import { Storage } from "expo-storage";

/*import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";*/

import Icon from "react-native-vector-icons/FontAwesome";

function EditItem({ value, setValue, extraLabel, item }) {
	const setVal = setValue;
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0))
  const [v, setV] = useState(item.type === "select"? item.optionsTitle[0] : 0)
	return (
		<View style={{ flexDirection: "column", width: "100%", padding: 30 }}>
			<Text style={{ fontSize: 20, marginLeft: "auto", marginRight: "auto" }}>
				{item.name}
			</Text>
			<View
				style={{
					flexDirection: "row",
					marginLeft: "auto",
					marginRight: "auto",
				}}
			>
				{
          item.type === "numeric"
          ?
          <Input
            style={{ width: 80*3 }}
            keyboardType="numeric"
            value={value.toString()}
            onChangeText={(text) => {
              setVal(text);
            }}
          />
          :
          <></>
        }
        {
          item.type === "select"
          ?
          <Select
            style={{ width: 80*3 }}
            selectedIndex={selectedIndex}
            value={v}
            onSelect={index => {
                console.log(index)
                setSelectedIndex(index)
                setV(item.optionsTitle[index.row])
                setValue(item.options[index.row])
                console.log(item.optionsTitle[index.row])
            }}>
            {
              item.optionsTitle.map(
                (title, index) => 
                <SelectItem title={title}/>
              )
            }
          </Select>
          :
          <></>
        }
        
				{
          extraLabel 
          ?
          <Text style={{ fontSize: 16, marginTop: 8, marginLeft: 10 }}>
            {extraLabel}
          </Text>
          :
          <></>
        }
			</View>
		</View>
	);
}

export default function FormPage({navigation}){
  let inputFields = [
    { 
      name: "Spent Amount", 
      type: "numeric",
    },
    { 
      name: "Spent Type", 
      type: "select",
      options: ["online", "fb", "retail", "travel"], 
      optionsTitle: ["Online", "F&B", "Retail", "Travel"]
    },
  ].map(
    (item) => {
      const [value, setValue] = useState(item.type === "select" ? item.options[0] : 0)
      return {
          name:item.name, 
          item: item,
          value, 
          setValue
      }
    }
  );
  
  return <View style={styles.container}>
    <Text style={styles.paragraph}>
      Enter Spending Details
    </Text>
    {
      inputFields.map(
        (item, index) =>
        <EditItem value={item.value} setValue={item.setValue} item={item.item} extraLabel="" key={index}/>
      )
    }
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Button onPress={()=> {
        navigation.navigate(
          "Calculations", 
          /*inputFields.map((x)=>({...x, setValue: undefined}) )*/
          {
             "spendingAmount":  parseFloat(inputFields[0].value), "spendType": inputFields[1].value, "totalSpent": 0 
          }
        )
      }} style={{ backgroundColor: "#696969", marginTop:0, width:80}}>
        Next
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
    padding: 0,
  },
  paragraph: {
    margin: 5,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
