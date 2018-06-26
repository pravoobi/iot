import React from 'react';
import { StyleSheet, Text, View, PropTypes, DrawerLayoutAndroid, ToolbarAndroid,TouchableOpacity,
  NetInfo, AsyncStorage, BackHandler, Image, AppState} from 'react-native';
import MainView from './MainView';
import Login from './Login';
import {AppRegistry} from 'react-native';
import Signup from './Signup';
import './ReactotronConfig';

//const fetchurl = "http://192.168.0.37:3000";
//const fetchurl = "http://ec2-34-208-123-255.us-west-2.compute.amazonaws.com:3300/api"
var intervalId,modtemp;


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this._setDrawer = this._setDrawer.bind(this);
    this.sToggle = this.sToggle.bind(this);
    this.sliderChange = this.sliderChange.bind(this);
    this.switchChange = this.switchChange.bind(this);
    this.postChange = this.postChange.bind(this);
    this.changeLogup = this.changeLogup.bind(this);
    this.getEmail = this.getEmail.bind(this);
    this.getPass = this.getPass.bind(this);
    this.vetLogin = this.vetLogin.bind(this);
    this.postLogin = this.postLogin.bind(this);
    this.getSignupEmail = this.getSignupEmail.bind(this);
    this.getSignupPass = this.getSignupPass.bind(this);
    this.getSignupName = this.getSignupName.bind(this);
    this.getSignupMobile = this.getSignupMobile.bind(this);
    this.vetSignup = this.vetSignup.bind(this);
    this.postSignup = this.postSignup.bind(this);
    this.connectivityChange = this.connectivityChange.bind(this);

    this.state = {
      rooms:[],
      modules:[],
      switches:[],
      stoggle:{},
      sindex:{},
      scolor:{},
      loaded: false,
      hubid: null,
      userid: null,
      logged: false,
      logup: true,
      loginEmail: null,
      loginPass: null,
      loginMsg: null,
      loginstyl: {bcolor:'aliceblue', errtext:''},
      signupEmail: null,
      signupPass: null,
      signupName: null,
      signupMobile: null,
      signupMsg: null,
      signupstyl: {bcolor:'aliceblue', errtext:''},
      activedevices: 0,
      connectionType: null,
      appState: AppState.currentState,
      modExt:{},
      sindexArray:[],
      postchangeError: null,
      fetchurl: "http://ec2-34-208-123-255.us-west-2.compute.amazonaws.com:3300/api"
    }
  }
  //Toggles Logup status - for switching between Login and Signup screens
  changeLogup(){
    var {logup, loginstyl, signupstyl} = this.state;
    logup = !logup;
    loginstyl.errtext = '';
    loginstyl.bcolor = 'aliceblue';
    signupstyl.errtext = '';
    signupstyl.bcolor = 'aliceblue';
    this.setState({logup, loginstyl, signupstyl});
  }
  //get login email from Login screen
  getEmail(em){
    var loginEmail = this.state.loginEmail;
    loginEmail = em;
    this.setState({loginEmail});
  }
  //get login password from Login screen
  getPass(pa){
    var loginPass = this.state.loginPass;
    loginPass = pa;
    this.setState({loginPass});
  }
  //To vet login email and password
  vetLogin(){
    var {loginEmail,loginPass,loginstyl} = this.state;
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(loginEmail == null){
      loginstyl.errtext = "Please Enter Email and Password";
      loginstyl.bcolor = 'red';
      this.setState({ loginstyl });
      return "Please Enter Email";
    }
    else if(loginPass == null){
      loginstyl.errtext = "Please Enter Email and Password";
      loginstyl.bcolor = 'red';
      this.setState({ loginstyl });
      return "Please Enter Password";
    }
    else if(reg.test(loginEmail) == false){
      loginstyl.errtext = "Please Enter valid Email";
      loginstyl.bcolor = 'red';
      this.setState({ loginstyl });
      return "Please Enter valid Email";
    }
    else if( this.state.connectionType == 'none'){
      return "Please connect to your Home wifi or enable device Internet";
    }

    this.sendLogin();
    }
  //Login details got are sent to loginDetails for fetch post
  sendLogin(){
    var {loginEmail,loginPass} = this.state;
    var loginDetails = {email:loginEmail, password:loginPass};
    console.log(loginDetails);
    this.postLogin(loginDetails);

  }
  //Login data is sent as post using fetch
  postLogin(data){
    fetch(`${this.state.fetchurl}/users/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    console.log("plogin",response, response.status);
    var {userid, accesstoken} = this.state;
    if(response.status == 200){
        var rb =response._bodyInit;
        var rbj = JSON.parse(rb);
        userid = rbj.userId;
        console.log("userid",userid);
        accesstoken = rbj.id;
        console.log("accesstoken",accesstoken);

        this.setState({userid, accesstoken, logged: true});
        const homiitems = {email: this.state.loginEmail, password: this.state.loginPass,
          userid: this.state.userid, accesstoken: this.state.accesstoken}
        AsyncStorage.removeItem('saveditems');
        AsyncStorage.setItem('saveditems', JSON.stringify(homiitems));
        const asitems = AsyncStorage.getItem('saveditems');
        console.log("asitems", asitems);
        this.getRoomsFromApi();

    }
    else if( response.status == 401){
      console.log("login 401")
      var loginMsg = this.state.loginMsg;
      loginMsg = "Login Failed!. Please check your Mail and Password";
      this.setState({loginMsg});
    }
    else if(response.status == 404 && this.state.connectionType == 'wifi'){
      console.log("login404");
      this.setState({fetchurl: "http://ec2-34-208-123-255.us-west-2.compute.amazonaws.com:3300/api"});
      this.sendLogin();
    }
  })
  .catch((error) => {
    console.error(error);
      })
  .done();
  }

  //get Signup email from Signup screen
  getSignupEmail(em){
    var signupEmail = this.state.signupEmail;
    signupEmail = em;
    this.setState({signupEmail});
  }
  //get Signup Name from Signup screen
  getSignupName(na){
    var signupName = this.state.signupName;
    signupName = na;
    this.setState({signupName});
  }
  //get signup password from Signup screen
  getSignupPass(pa){
    var signupPass = this.state.signupPass;
    signupPass = pa;
    this.setState({signupPass});
  }
  //get signup mobile number from Signup screen
  getSignupMobile(mo){
    var signupMobile = this.state.signupMobile;
    signupMobile = mo;
    this.setState({signupMobile});
  }
  //To vet signup name, email and password
  vetSignup(){
    var {signupEmail,signupPass,signupName,signupstyl} = this.state;
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(signupName == null){
      signupstyl.errtext = "Please Enter Full Name";
      signupstyl.bcolor = 'red';
      this.setState({ signupstyl });
      return "Please Enter Email and Password";
    }
    else if(signupEmail == null){
      signupstyl.errtext = "Please Enter Email";
      signupstyl.bcolor = 'red';
      this.setState({ signupstyl });
      return "Please Enter Email and Password";
    }
    else if(signupPass == null){
      signupstyl.errtext = "Please Enter Email and Password";
      signupstyl.bcolor = 'red';
      this.setState({ signupstyl });
      return "Please Enter Password";
    }
    else if(reg.test(signupEmail) == false){
      signupstyl.errtext = "Please Enter valid Email";
      signupstyl.bcolor = 'red';
      this.setState({ signupstyl });
      return "Please Enter valid Email";
    }
    else if(this.internetConnected()){

      return "Please connect to your Home wifi or enable device Internet";
    }

    this.sendSignup();
  }
  //Signup details got are sent to SignupDetails for fetch post
  sendSignup(){
    var {signupEmail,signupPass,signupName,signupMobile}= this.state;
    var signupDetails = {email:signupEmail, username:signupName,password:signupPass, mobile:signupMobile, userType:"customer"};
    console.log([signupDetails]);
    this.postSignup([signupDetails]);

  }
  //Signup data is sent as post using fetch
  postSignup(data){
    fetch(`${this.state.fetchurl}/users`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    console.log("psignup",response, response.status);
    if(response.status == 200){
      var signupMsg = this.state.signupMsg;
      signupMsg = "Signup is successful. Please Login now";
      this.setState({signupMsg});
      //return response;
    }
    else if(response.status == 500){
      var rb =response._bodyInit;
      var rbj = JSON.parse(rb);
      var et = "Validation Failed:";
      var finalerror = Object.values(rbj.error.details[0].details.messages).reduce((a,b) => a.concat(b),et);
      console.log("finalerror", finalerror);
      var {signupstyl} = this.state;
      signupstyl.errtext = finalerror;
      signupstyl.bcolor = 'red';
      this.setState({signupstyl});
    }
  })
  .catch((error) => {
    console.log("500 error",error);
  })
  .done();
  }
  //Opens the drawer using Refs
  _setDrawer() {
    this.refs['DRAWER'].openDrawer();
  }
  //Logs out of the App and erases login details from AsyncStorage and state
  logout(){
    var {logged, loginEmail, loginPass} = this.state;
    logged = false;
    loginEmail= null,
    loginPass= null,
    this.setState({logged, loginEmail, loginPass});
    AsyncStorage.removeItem('saveditems');
  }
  //Exits the app on device
  exit(){
    BackHandler.exitApp();
  }
  //Toggles boolean values for all switches
  sToggle(swid){
    var stoggle = {...this.state.stoggle}; 
    stoggle[swid] = !stoggle[swid];
    this.setState({stoggle});
  }
  //updates state as slider is changed
  sliderChange(val, swid){
    var switches = [...this.state.switches];
    var sindex = {...this.state.sindex};
    var scolor = {...this.state.scolor};
    var activedevices = this.state.activedevices;
    var index = sindex[swid];
    if(switches[index].value==0 && val > 0){
      activedevices++;
    }
    else if( switches[index].value > 0 && val == 0){
      activedevices--;
    }
    switches[index].value = val;
    this.switchcolor(swid, val);
    this.setState({switches, activedevices, postchangeError:null});
    console.log("schange");
    console.log(index);
    console.log(swid,val);
    console.log("activedevices", activedevices);
    var postDetails = {id:swid, value:val, hubId:this.state.hubid};
    console.log("postdetails",postDetails);
    this.postChange(postDetails);
  }
  //updates state as switch is changed
  switchChange(val, swid){
    var switches = [...this.state.switches];
    var sindex = {...this.state.sindex};
    var activedevices = this.state.activedevices;
    var index = sindex[swid];
    val == 0 ? sval = 100 : sval = 0;
    val == 0 ? activedevices++ : activedevices--;
    switches[index].value = sval;
    this.switchcolor(swid, sval);
    this.setState({switches, activedevices, postchangeError:null});
    console.log("schange");
    console.log(index);
    console.log(swid, sval, val);
    console.log("activedevices", activedevices);
    var postDetails = {id:swid, value:sval, hubId:this.state.hubid};
    console.log("postdetails",postDetails);
    this.postChange(postDetails);
  }
  //changes to slider change is posted using fetch
  postChange(data){
    fetch(`${this.state.fetchurl}/switches/updateSwitch`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((responseJson) => {
        console.log(responseJson);
        return console.log("postresponseJson");
  })
  .catch((error) => {
        //console.error(error);
        if(error){
          var postchangeError = "Cannot perform action. Check your connection and try again";
          this.setState({postchangeError});
          console.log("caught",error);
        }
      })
  .done();
  }

  updateSwitches(emsg){
    //var moduleId = emsg.moduleId;
    var swid = emsg.switchid;
    var val = emsg.value;
    var switches = [...this.state.switches];
    var sindex = {...this.state.sindex};
    var scolor = {...this.state.scolor};
    var activedevices = this.state.activedevices;
    var index = sindex[swid];
    if(switches[index].value==0 && val > 0){
      activedevices++;
    }
    else if( switches[index].value > 0 && val == 0){
      activedevices--;
    }
    switches[index].value = val;
    this.switchcolor(swid, val);
    this.setState({switches, activedevices});
  }

  internetConnected(){
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log("internetConnected", isConnected);
      return isConnected;
    });
  }
  //Event listener handler for network change
  connectivityChange(connectionInfo) {
    console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    NetInfo.removeEventListener('connectionChange', connectivityChange);
    
  }
  //
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.loadAstorage();
    this.netconnected();
    if(this.state.logged){
    this.getRoomsFromApi();
    this.modulesMap();
    this.switchesMap();
    if(this.state.connectionType == 'wifi'){
    this.websockComm();
    }
    }
  }
  //Listeners removed for unmounted components.
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    NetInfo.removeEventListener('connectionChange', this.connectivityChange);

  }
  websockComm(){
    var ws = new WebSocket(this.state.fetchurl.replace('http','ws'));
    ws.onopen = () => {
      // connection opened
      ws.send('Connection opened'); // send a message
      console.log("connection opened");
    };
    ws.onmessage = (e) => {
      // a message was received
      console.log("edata", e.data);
      var emsg = JSON.parse(e.data);
      console.log("emsg", emsg);
      this.arrUpSw(emsg);
      //this.updateSwitches(emsg);
    };
    ws.onerror = (e) => {
      // an error occurred
      console.log("eerror", e.message);
    };
    ws.onclose = (e) => {
      // connection closed
      console.log("eclose", e.code, e.reason);
    };
  }
  //Handles App state change to enable polling when App is in Foreground.
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      if(this.internetConnected()){
        this.loadAstorage();
      }
    }
    this.setState({appState: nextAppState});
  }

    //Networkinfo changes and connections
  netconnected(){
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
      var connectionType = this.state.connectionType;
      connectionType = connectionInfo.type;
      var fetchurl = this.state.fetchurl;
      if(connectionType == 'wifi'){
        var fetchurl = "http://192.168.0.26";
      }
      else{
        var fetchurl = "http://ec2-34-208-123-255.us-west-2.compute.amazonaws.com:3300/api"
      }
      this.setState({connectionType, fetchurl});
      console.log("neturl",this.state.connectionType,this.state.fetchurl)

    NetInfo.addEventListener('connectionChange', this.connectivityChange);
    });
    
  }
  connectivityChange(connectionInfo) {
    //console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    var connectionType = this.state.connectionType;
    connectionType = connectionInfo.type;
    var fetchurl = this.state.fetchurl;
      if(connectionType == 'wifi'){
        var fetchurl = "http://192.168.0.26";
      }
      else{
        var fetchurl = "http://ec2-34-208-123-255.us-west-2.compute.amazonaws.com:3300/api"
      }
      this.setState({connectionType, fetchurl});
  }
  
  //Gets rooms from API using fetch
  getRoomsFromApi = function(){
    console.log("marcos");
    return fetch(`${this.state.fetchurl}/rooms?filter[where][userId]=${this.state.userid}`)
      .then((response) => response.json())
      .then((responseJson) => {
       var rooms = responseJson;
        this.setState({rooms});
        console.log(responseJson);
        //rooms.map(item => this.getModulesFromApi(item.id));
        this.modulesMap();
       // return console.log("responseJson");
        
      })
      .catch((error) => {
        console.error(error);
      })
      .done();
  }
  

  modulesMap(){
    setTimeout(() => this.switchesMap(),5000)
    var roomsmap = [...this.state.rooms];
    console.log("roomsmap", roomsmap);
    roomsmap.map(room => {
      var roomid = room.id;
      //this.getModulesFromApi(room.id)
    
    //Gets modules from API using fetch
    //getModulesFromApi(roomid){
    console.log("modules",roomid);
    console.log("moduleurl",`${this.state.fetchurl}/modules?filter[where][roomId]=${roomid}`)
    return fetch(`${this.state.fetchurl}/modules?filter[where][roomId]=${roomid}`)
      .then((response) => response.json())
      .then((responseJson) => {
        var modules = [...this.state.modules];
       modules = modules.concat(responseJson);
       if(this.state.hubid == null){
        var hubid = responseJson[0].hubId;
        this.setState({hubid});
        console.log("hubid",hubid);
        }
        var modtemp = [];
        modules.map(moduleItem => {
          if(moduleItem.roomId == roomid){
            modtemp.push(moduleItem.id)
          }
        })
        console.log("modtemp",modtemp);
        var modExt = {...this.state.modExt}
        modExt[`${roomid}`] = modtemp;


        console.log("modExt",modExt);
        this.setState({modules, modExt});
        console.log("modules", this.state.modules);
        //modules.map(item => this.getSwitchesFromApi(item.id));
        //return console.log("Modules responseJson");
        
        //this.switchesMap(modtemp);


      })
      .catch((error) => {
        console.error(error);
      })
      //.done();
 // }
  }
  );
    console.log("called switchesmap", this.state.modules);
  }

  switchesMap(){
    var modmap = [...this.state.modules];
    console.log("modmap",modmap);
    console.log("modstate", this.state.modules);
    modmap.map(item => {
      //var modid = item;
      var modid = item.id;
      //this.getSwitchesFromApi(item)
  //Gets switches from API using fetch
  //getSwitchesFromApi = function(modid){
    console.log("switchurl",`${this.state.fetchurl}/switches?filter[where][moduleId]=${modid}`)
    return fetch(`${this.state.fetchurl}/switches?filter[where][moduleId]=${modid}`)
      .then((response) => response.json())
      .then((responseJson) => {
        var switches = [...this.state.switches];
        switches = switches.concat(responseJson);
        //console.log("mainswi", switches, this.state.loaded);
        //console.log("switch state", this.state.switches);
        var stoggle = {...this.state.stoggle};
        var sindex = {...this.state.sindex};
        var sindexArray = [...this.state.sindexArray];
        var activedevices = this.state.activedevices;
          responseJson.map((item) => {
            stoggle[item.id] = true;
            sindexArray.push(item.id);
            sindexArray.map((sia,i) => sindex[sia] = i);
            item.value > 0 && activedevices++;
            this.switchcolor(item.id, item.value);
          })
        
        // var switemp = [];
        // switches.map(switchItem => {
        //   console.log("switchItem", switchItem);
        //   if(switchItem.moduleId == modid){
        //     switemp.push(switchItem)
        //     console.log("switemp", switemp);
        //   }
        // })
        //var swiExt = {...this.state.swiExt};
        //swiExt[`${modid}`]= switemp;

        this.setState({switches, loaded: true,stoggle, sindex, sindexArray, activedevices});
        console.log(stoggle);
        console.log(sindex);

        console.log("activedevices",activedevices )
        return console.log("Switches responseJson");
      })
      .catch((error) => {
        console.error(error);
      })
      //.done();
      //}
  });
  }
  

  //Returns Switch color based on value
  switchcolor(swid,val){
    var scolor = {...this.state.scolor}; 
    if(val == 0){
      scolor[swid] = "#a9a9a9";
    }
    else if(val > 0 && val <= 20){
      scolor[swid] = "#f0f8ff";
    }
    else if(val > 20 && val <= 50){
      scolor[swid] = "#ffffff";
    }
    else if(val > 50 && val <= 80){
      scolor[swid] = "#ffd700";
    }
    else if(val > 80 && val <= 100){
      scolor[swid] = "#ff8c00";
    }

    this.setState({scolor});
  }
  //Loading AsyncStorage data(if it exists) into State upon start of app
  loadAstorage = function(){
    AsyncStorage.getItem('saveditems').then(asval => {
    console.log("async",asval);
    if(asval !== null){
      asval1 = JSON.parse(asval);
      this.setState({loginEmail:asval1.email, loginPass:asval1.password, hubid:asval1.hub, 
        logged:true });
      console.log("saved items are there", asval1.hub);
    this.sendLogin();
    }
    });
  }
  
  render() {
    
    if(!this.state.logged){
      return (this.state.logup ? <Login clogup={this.changeLogup} getem={this.getEmail} 
        getpa={this.getPass} vlogin = {this.vetLogin} lstyl={this.state.loginstyl}
        lmsg ={this.state.loginMsg} />
        : <Signup getlogup = {this.state.logup} clogup={this.changeLogup} 
        getsignem={this.getSignupEmail} getsignpa={this.getSignupPass} 
        getsignmo={this.getSignupMobile} getsignna={this.getSignupName} vsignup={this.vetSignup} 
        sstyl={this.state.signupstyl} smsg ={this.state.signupMsg}/>);

    }
    if(!this.state.loaded) {
      return this.renderLoadingView();
    }
    
    var navigationView = (
      <View style={{flex: 1, backgroundColor: '#f0f8ff'}}>
        <Text style={styles.drawerText}>HOMI!</Text>
        <Image source={require('./images/homi-logo.png')} style={styles.loginLogo}></Image>
        <Text style={[styles.drawerText, {fontWeight: 'bold'}]}>{this.state.loginEmail}</Text>
        <TouchableOpacity style={styles.drawerButton} onPress= {() => this.exit()}>
        <Text style = {styles.loginButtonText}>Exit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerButton} onPress= {() => this.logout()}>
        <Text style = {styles.loginButtonText}>Logout </Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <DrawerLayoutAndroid
      drawerWidth={250}
      ref={'DRAWER'}
      drawerPosition={DrawerLayoutAndroid.positions.Left}
      renderNavigationView={() => navigationView}>
      
      <MainView drawer={this._setDrawer} getRooms={this.state.rooms} getModules={this.state.modules} 
      getSwitches={this.state.switches} getModext = {this.state.modExt}
      getStoggle={this.state.stoggle} sToggle={this.sToggle} 
      sChange={this.sliderChange} swChange = {this.switchChange} adevices ={this.state.activedevices}
       swcolor={this.state.scolor} postchangeError = {this.state.postchangeError}/>
    </DrawerLayoutAndroid>
  );
  }
  renderLoadingView() {
    return (
      <View style={styles.container}>
      <Image source={require('./images/800x1280-vgrandeur.png')} style={styles.backimg}>
        <Text style={styles.loadingtext}>
          Loading HOMI...
        </Text>
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
  loginButtonText:{
    color: '#000046',
    alignItems: 'center',
    justifyContent: 'center'
  },
  drawerButton:{
    backgroundColor: 'transparent',
    padding: 5,
    margin: 5,
    height: 30,
  },
  drawerText:{
    color: '#000046',
    margin: 10,
    fontSize: 15, 
    textAlign: 'left'
  },
  loginLogo:{
    flex: 0.3,
    alignSelf: 'center',
    justifyContent: 'space-around',
    width: 20,
    height: 15,
    padding: 3,
  },
  backimg:{
    flex: 1,
    width: null,
    height: null,
    alignSelf: 'stretch'
  },
  loadingtext:{
    flex:1,
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 15,
    fontWeight:'bold',
    color:'white'
  }
});

AppRegistry.registerComponent('Homi',() => App);