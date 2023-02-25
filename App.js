import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import { NavigationContainer } from "@react-navigation/native";
// or any pure javascript modules available in npm
import { createStackNavigator } from "@react-navigation/stack";
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components'
import FormPage from './pages/form'
import LandingPage from './pages/landing'
import CalculationsPage from './pages/calculations'
import StatisticsPage from './pages/statistics'

export default function App() {
	const Stack = createStackNavigator();
	return (
		<ApplicationProvider {...eva} theme={eva.light}>
				<NavigationContainer>
					<Stack.Navigator>
            <Stack.Screen
							name="Landing"
							component={LandingPage}
							initialParams={{ }}
						/>
						<Stack.Screen
							name="Form"
							component={FormPage}
							initialParams={{ }}
						/>
            <Stack.Screen
							name="Calculations"
							component={CalculationsPage}
							initialParams={{ }}
						/>
            <Stack.Screen
							name="Statistics"
							component={StatisticsPage}
							initialParams={{ }}
						/>
					</Stack.Navigator>
				</NavigationContainer>
		</ApplicationProvider>
  );
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
