import React from 'react';
import { StyleSheet, Text, View, Image, ToolbarAndroid, ScrollView, TouchableOpacity, PropTypes }
 from 'react-native';
import STView from './STView';

export default class MainView extends React.Component {

  _onIconClicked(){
    this.props.drawer();
  }
  
  render() {
    const {getRooms, getModules, getSwitches, getStoggle, sToggle, sChange, swChange, swcolor,
    adevices, getModext,postchangeError} = this.props;
    
    return (
      <View style={styles.container}>
        <Image source={require('./images/800x1280-vgrandeur.png')} style={styles.backimg}>
        <ToolbarAndroid
          logo={require('./images/Final-01-w-logo.png')}
          title='HOMi' titleColor='white'
          navIcon={require('./images/ham-w-32.png')}
          style={styles.toolbar}
          contentInsetEnd={100}
          contentInsetStart={100}
          onIconClicked={()=>this._onIconClicked()}
        />
        {postchangeError != null && <Text style = {styles.msgText}>{postchangeError}</Text>}

        <STView getRooms={getRooms} getModules={getModules} getSwitches={getSwitches} 
        getStoggle={getStoggle} sToggle={sToggle} sChange={sChange} swChange={swChange} 
        swcolor={swcolor} getModext ={getModext}/>
        <View style={styles.devices}>
          <Text style={{fontSize: 70, color: 'white', fontWeight: 'bold'}}>{adevices}</Text>
          <View style={styles.devicestack}>
            <Text style={{fontSize: 20, color: 'white'}}>180 W</Text>
            <Text style={{fontSize: 20, color: 'white'}}>Devices</Text>
          </View>
        </View>
        <View style={styles.mic}>
          <Image source={require('./images/mic-b-128-new.png')} style={{width: 70, height: 70}}/>
        </View>
        </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backimg:{
    flex: 1,
    width: null,
    height: null,
    alignSelf: 'stretch'
  },
  toolbar: {
    flex:0.09,
    height: 150,
    backgroundColor: '#00004600',
    alignSelf: 'stretch',
    marginTop: 10,
    marginLeft: 10,
    },
  mic: {
    marginTop: 535,
    marginLeft: 330,
    position: 'absolute',
  },
  devices: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 130,
    marginBottom: 5,
  },
  devicestack: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 15,
    marginLeft: 5,
  },
  msgText:{
    color: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',

  }
});