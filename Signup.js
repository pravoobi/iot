import React from 'react';
import { StyleSheet, Text, View, PropTypes, Image, TextInput, TouchableOpacity } from 'react-native';

export default class Signup extends React.Component{

	render(){
		const { clogup, getsignem, getsignpa, getsignna, getsignmo, vsignup, sstyl, smsg } = this.props;
		return (
		<View style={styles.container}>
	    <Image source={require('./images/800x1280-vgrandeur.png')} style={styles.backimg}>
	    <Image source={require('./images/homi-white.png')} style={styles.loginLogo}></Image>
	    <View style = {styles.signupBlock}>
	    <Text style = {styles.signupTitle}>HOMi Signup</Text>
	    {smsg != null && <Text style = {styles.msgText}>{smsg}</Text>}
	    <TextInput style={[styles.input, {borderColor: `${sstyl.bcolor}`}]}
	     underlineColorAndroid = "transparent" placeholder = " Full Name"
	     placeholderTextColor = "#ffffff" autoCapitalize = "none" autoCorrect = {false} 
	     onChangeText={(text) => getsignna(text)} />
	    <TextInput style={[styles.input, {borderColor: `${sstyl.bcolor}`}]} 
	     underlineColorAndroid = "transparent" placeholder = " Email"
	     placeholderTextColor = "#ffffff" autoCapitalize = "none" autoCorrect = {false} 
	     onChangeText={(text) => getsignem(text)} />
	    <TextInput style={[styles.input, {borderColor: `${sstyl.bcolor}`}]} 
	     underlineColorAndroid = "transparent" placeholder = " Password"
	     placeholderTextColor = "#ffffff" autoCapitalize = "none" secureTextEntry = {true} 
	     autoCorrect = {false} onChangeText={(text) => getsignpa(text)}/>
	     <TextInput style={[styles.input, {borderColor: `${sstyl.bcolor}`}]} 
	     underlineColorAndroid = "transparent" placeholder = " Mobile"
	     placeholderTextColor = "#ffffff" autoCapitalize = "none" autoCorrect = {false} 
	     onChangeText={(text) => getsignmo(text)} />
	    <Text style={styles.errText}>{sstyl.errtext}</Text>
	    <View style={styles.buttons}>
	    <TouchableOpacity style={styles.loginButton} onPress= {() => vsignup()}>
	    <Text style = {styles.loginButtonText}> Signup </Text>
	    </TouchableOpacity>
	    <TouchableOpacity style={styles.signupButton} onPress= {() => clogup()}>
	    <Text style = {styles.loginButtonText}> Cancel </Text>
	    </TouchableOpacity>
	    </View>
	    </View>
	    </Image>
    </View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backimg:{
    flex: 1,
    width: null,
    height: null,
    alignSelf: 'stretch'
  },
  input:{
  	margin: 15,
  	height: 40, 
  	borderColor: 'aliceblue',
  	borderWidth: 1
  },
  loginButtonText:{
  	color: 'white',
  	alignItems: 'center',
  	justifyContent: 'center',
  	alignSelf: 'center',
  	fontSize: 15,
  	fontWeight: 'bold'
  },
  loginButton:{
  	backgroundColor: '#1CB5E0',
    padding: 10,
    margin: 20,
    height: 40,
    width: 150,
    borderColor: 'aliceblue',
  	borderWidth: 1
  },
  signupButton:{
  	backgroundColor: 'transparent',
    padding: 10,
    margin: 15,
    height: 40,
    width: 150,
    borderColor: 'aliceblue',
  	borderWidth: 1
  },
  loginLogo:{
  	flex: 0.3,
  	alignSelf: 'center',
    justifyContent: 'space-around',
  	width: 200,
    height: 150,
    padding: 30
  },
  buttons:{
  	flexDirection: 'row',
    justifyContent: 'space-between',
  	alignItems: 'center'
  },
  signupTitle:{
  	alignSelf: 'center',
  	color: 'white',
  	fontSize: 30
  },
  signupBlock:{
  	padding: 30
  },
  errText:{
  	color: 'red',
  	alignItems: 'center',
  	justifyContent: 'center',
  	margin: 20
  },
  msgText:{
  	color: 'white',
  	alignItems: 'center',
  	justifyContent: 'center',
  	margin: 20
  }
});