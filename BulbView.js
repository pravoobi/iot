import React from 'react';
import { StyleSheet, View, Image, Text, Switch, Slider, TouchableOpacity } from 'react-native';

export default class BulbView extends React.Component{

	render(){
		const {val, swid, stype, getStoggle, sChange, swChange, sToggle, swcolor} = this.props;
		return(
		<View key={swid} style={styles.bulbView}>
			{ (stype == "dim") ? 
			<View>
			<TouchableOpacity onPress = {() => swChange(val,swid)} onLongPress = {() => sToggle(swid)}
			activeOpacity = {0.7}>
		    <Image source={require('./images/spiral-bulb-dim-svg-w.png')} 
		    style={{width: 70, height: 70, margin: 15, tintColor:swcolor[swid]}} />
		    </TouchableOpacity>
		   	{console.log(getStoggle[swid])}
		    {getStoggle[swid] ? <View style={{width: 80, height: 50, margin: 10}}><Text> </Text></View> :
		    	(<View style={styles.visibleView}>
		    		<Slider maximumValue={100} minimumValue={0} step={1} thumbTintColor="#f0ffff"
		    		maximumTrackTintColor="#ff8c00"	minimumTrackTintColor="#f0f8ff" 
		    		style={{margin: 10, height: 50, width: 80}}
		    		 value={parseFloat(val)} onValueChange={(value) => sChange(value, swid)} />
		    	</View>)}
		    </View>
		    	:
		    <View>
			<TouchableOpacity onPress = {() => swChange(val,swid)} onLongPress = { () => sToggle(swid)}
			activeOpacity = {0.7}>
		    <Image source={require('./images/bulb-undim-svg-w.png')} style={{width: 70,
		    	height: 70, tintColor: swcolor[swid]}}/>
		    </TouchableOpacity>
		    <View style={{width: 80, height: 50, margin: 10}}><Text> </Text></View>
		    
		    </View>}
		</View>
		)
	}
}

const styles = StyleSheet.create({
   bulbView:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginRight: 50,
    marginLeft:50,
    marginTop: 50

    
  },
  visibleView:{
  	width: 80,
    height: 70,
  }
});