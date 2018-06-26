import React from 'react';
import { StyleSheet, View, Image, Text, Switch, Slider, TouchableOpacity } from 'react-native';

export default class FanView extends React.Component{
	render(){
		const {val, swid, getSwitches, getStoggle, sChange, sToggle, swChange, swcolor} = this.props;
		return(
		<View style={styles.fanView}>
		    <TouchableOpacity onPress= {() => swChange(val,swid)} onLongPress={() => sToggle(swid)}
		    activeOpacity = {0.7}>
		    <Image source={require('./images/fan-inactive-w.png')} style={{width: 70,
		    	height: 70, tintColor: swcolor[swid]}}/>
		    </TouchableOpacity>
		    {getStoggle[swid] ? <View style={{width: 80, height: 50, margin: 10}}><Text> </Text></View> :
		    	(<View style={styles.visibleView}>
		    	<Slider maximumValue={100} minimumValue={0} step={1} maximumTrackTintColor="#ff8c00"
		    		minimumTrackTintColor="#f0f8ff" thumbTintColor="#f0ffff"
		    		style={{margin: 10, height: 50, width: 80}} value={parseFloat(val)}
		    		onValueChange={(value) => sChange(value, swid)}/>
		    </View>)}
		</View>
		)
	}
}

const styles = StyleSheet.create({
  fanView:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginRight: 50,
    marginLeft: 50,
    marginTop: 50
    
  },
  visibleView:{
  	width: 80,
    height: 70,
  }
});