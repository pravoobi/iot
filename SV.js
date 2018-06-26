import React from 'react';
import { StyleSheet, View, Image, Text, Switch, Slider } from 'react-native';
import FanView from './FanView';
import BulbView from './BulbView';

export default class SV extends React.Component{
  render(){
    //const {roomNames, getModules, getSwitches, getStoggle, sToggle, sChange, swChange, 
      //swcolor} = this.props;
  	const {roomNames, roomsId, getModules, getSwitches, getStoggle, sToggle, sChange, swChange, 
  		swcolor, getModext} = this.props;
  	//console.log("SV modules");

    //console.log("roomsId",roomsId)
    //console.log("getModules",getModules)
    //console.log("getSwitches",getSwitches)
    var mext = getModext[roomsId];
    //var sext = [];
    var swiExt = [];
    //mext.map(si => {sext.push(getSwiext[si])})
    //console.log("getSwiext", getSwiext);

    //console.log("mext", mext);
    //console.log("sext", sext);
    getSwitches.map(switchItem => {mext.map(mE => {if(mE == switchItem.moduleId){swiExt.push(switchItem)}})})
    //console.log("swiExt",swiExt);

  	// getModules.map(moduleItem => {if(moduleItem.roomId == roomsId){modExt.push(moduleItem.id)}})
  	// console.log("modext",modExt);
  	// getSwitches.map(switchItem => {modExt.map(mE => {if(mE == switchItem.moduleId){swiExt.push(switchItem)}})})
  	// console.log("swiExt",swiExt);
  	
  	return(
		<View style={styles.tabs}>
			
			{
				swiExt.map((sitem, index) => { return sitem.switchType == "fan" 
					? 
					<FanView key={sitem.id}	swid={sitem.id} val={sitem.value} index={index}
					getSwitches={getSwitches} getStoggle={getStoggle} sToggle={sToggle} 
					sChange={sChange} swChange={swChange} swcolor={swcolor}/>
					: 
					<BulbView key={sitem.id} swid={sitem.id} val={sitem.value} index={index}
					stype={sitem.switchType} getSwitches={getSwitches} getStoggle={getStoggle}
					sToggle={sToggle} sToggle={sToggle} sChange={sChange} swChange={swChange}
					swcolor={swcolor} />
				})

			}
			
		</View>
	);
  }
}

const styles = StyleSheet.create({
tabs:{
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 50,
    marginLeft: 30,
    marginRight:30
  },
});

