import React from 'react';
import { StyleSheet, Text, View, Image, ToolbarAndroid, ScrollView } from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import SV from './SV';


export default class STView extends React.Component {
	/*const socket = io('http://localhost:3300');
	socket.on('connect', function(){});
	socket.on('event', function(data){});
	socket.on('disconnect', function(){});
*/
	render() {
		const {getRooms, getModules, getSwitches, getStoggle, sToggle, sChange, swChange,
			swcolor, getModext} = this.props;
		
    return (
    	<View style={styles.container}>
    		<ScrollableTabView 
	          style={{marginTop:0, flex: 0.85}} 
	          initialPage={0} 
	          tabBarActiveTextColor={'#ffffff'}
	          tabBarInactiveTextColor={'#ffffff80'}
	          tabBarTextStyle={{fontFamily: 'Roboto', fontSize: 30}}
	          tabBarUnderlineStyle={{backgroundColor: '#ffffff'}}
	          renderTabBar={() => <ScrollableTabBar />}
	        >
	        {
	        	getRooms
	        	.map(roomItem => <ScrollView key={roomItem.id} tabLabel={roomItem.roomName}>
	        		<SV key={roomItem.id} roomsId={roomItem.id} roomNames={roomItem.roomName} 
	        		getModules={getModules} getSwitches={getSwitches} getStoggle={getStoggle}
	        		sToggle={sToggle} sChange={sChange} swChange={swChange} swcolor={swcolor}
	        		getModext={getModext} />
	        		</ScrollView>)
	        }
	        
	    	   
        </ScrollableTabView>
    	</View>
    );
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

