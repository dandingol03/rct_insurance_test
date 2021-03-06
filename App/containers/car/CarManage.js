/**
 * Created by dingyiming on 2017/2/13.
 */

import React,{Component} from 'react';

import  {
    AppRegistry,
    StyleSheet,
    ListView,
    Image,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ScrollView,
    Alert,
    Modal
} from 'react-native';

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from 'react-native-check-box';
import _ from 'lodash';
import Config from '../../../config';
import Proxy from '../../proxy/Proxy';
import NewCarBind from '../../components/modal/NewCarBind';
import UpdateCarInfo from '../../components/UpdateCarInfo';
import CarInsurance from './CarInsurance';

class CarManage extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    toggleAll(){
        if(this.state.relatedGoods!==undefined&&this.state.relatedGoods!==null)
        {
            var relatedGoods=_.cloneDeep(this.state.relatedGoods);
            if(this.state.selectAll!=true)
            {
                relatedGoods.map(function (good, i){
                    good.checked=true;
                });
            }else{
                relatedGoods.map(function (good, i){
                    good.checked=false;
                });
            }
            var dataSource = this.state.dataSource.cloneWithRows(relatedGoods);
            this.setState({
                relatedGoods: relatedGoods,
                selectAll:!this.state.selectAll,
                dataSource:dataSource
            });
        }
    }

    getCommoditiesByPriceId(priceId){

        var merchantId=this.props.merchantId;
        Proxy.post({
            url:Config.server+'supnuevo/supnuevoGetSupnuevoBuyerCommodityPriceFormListOfGroupMobile.do',
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "priceId=" + priceId + "&merchantId=" + merchantId
        },(json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);

            }else{
                var relatedGoods=json.array;
                if(relatedGoods!==undefined&&relatedGoods!==null)
                {
                    relatedGoods.map(function(good,i) {
                        if (good.priceId == priceId) {
                            good.checked = true;
                        }else{
                            good.checked=false;
                        }
                        if(good.sizeValue!=undefined&&good.sizeValue!=null
                            &&good.sizeUnit!=undefined&&good.sizeUnit!=null)
                        {
                            good.goodName=good.nombre+','+
                                good.sizeValue+','+good.sizeUnit;
                        }else{
                            good.goodName=good.nombre;
                        }
                    });

                    this.setState({relatedGoods: relatedGoods,dataSource:this.state.dataSource.cloneWithRows(relatedGoods)});
                }else{

                }
            }
        }, (err) =>{
            alert(err);
        });



    }


    navigate2NewCarCreate(carNum,city)
    {

        const {navigator} =this.props;
        if(navigator) {
            navigator.push({
                name: 'updateCarInfo',
                component: UpdateCarInfo,
                params: {
                    carNum: carNum,
                    city:city
                }
            })
        }
    }

    navigate2CarInsurance(carInfo)
    {

        const {navigator} =this.props;
        if(navigator) {
            navigator.push({
                name: 'car_insurance',
                component: CarInsurance,
                params: {
                    carInfo: carInfo
                }
            })
        }
    }

    bindNewCar(carNum,cb)
    {
        var {accessToken}=this.props;
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'bindNewCar',
                info:{
                    carNum:carNum
                }
            }
        },(json)=> {
            if(json.error)
            {
                Alert.alert(
                    'error',
                    json.error_description
                );
            }else{
                if(cb!==undefined&&cb!==null)
                    cb(json.re,json.data);
            }
        }, (err) =>{
        });
    }


    renderRow(rowData,sectionId,rowId){

        var lineStyle=null;

        lineStyle={flex:1,flexDirection:'row',padding:4,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent'}


        var prefer=null;

        if(rowData.idle==true)
        {
            if(rowData.checked==true)
            {

                prefer=<CheckBox
                    style={{padding: 2,flex:1,justifyContent:'center',flexDirection:'row',alignItems:'center'}}
                    onClick={()=>{
                      var bindedCars=_.cloneDeep(this.state.bindedCars);
                      bindedCars.map(function(car,i) {
                        if(car.carId==rowData.carId)
                            car.checked=false;
                      });
                       this.setState({bindedCars: bindedCars,dataSource:this.state.dataSource.cloneWithRows(bindedCars)});
                }}
                    isChecked={false}
                    leftText={null}
                />;
            }else{
                prefer=<CheckBox
                    style={{ padding: 2,flex:1,justifyContent:'center',flexDirection:'row',alignItems:'center'}}
                    onClick={()=>{

                        this.navigate2CarInsurance(rowData);
                      {/*var bindedCars=_.cloneDeep(this.state.bindedCars);*/}
                      {/*bindedCars.map(function(car,i) {*/}
                        {/*if(car.carId==rowData.carId)*/}
                            {/*car.checked=true;*/}
                      {/*});*/}
                       {/*this.setState({bindedCars: bindedCars,dataSource:this.state.dataSource.cloneWithRows(bindedCars)});*/}

                }}
                    isChecked={false}
                    leftText={null}
                />;
            }
        }else{
            prefer=
                <View style={{flex:1,padding:8,justifyContent:'center',flexDirection:'row'}}>
                    <Text style={{color:'#ff5c3c',fontSize:16}}>已申请</Text>
                </View>;

        }

        var row=
            <View>

                <View style={lineStyle}>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:8}}>
                        {prefer}
                    </View>

                    <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:2}}
                                      onPress={()=>{
                                           this.navigate2CarInsurance(rowData);
                                      }}>
                        <View>
                            <Text style={{color:'#000',fontSize:18}}>
                                车牌号:{rowData.carNum}
                            </Text>
                            <Text style={{color:'#000',fontSize:17}}>
                                车主姓名 :{rowData.ownerName}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{width:50,padding:2,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Icon name="angle-right" size={52} color="#00c9ff"></Icon>
                    </View>
                </View>


            </View>;

        return row;
    }



    fetchData(){
        Proxy.post({
            url:Config.server+'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'fetchInsuranceCarInfoByCustomerId',

                info:{carNum:''}
            }
        },(res)=> {
            if(res.error)
            {
                Alert.alert(
                    'error',
                    res.error_description
                );
            }else{
                var bindedCars=res.data;
                bindedCars.map(function (car, i) {
                    car.checked = false;
                });
                var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({dataSource: ds.cloneWithRows(bindedCars),bindedCars:bindedCars});
            }
        }, (err) =>{
        });
    }


    constructor(props)
    {
        super(props);
        const { accessToken } = this.props;
        this.state = {
            accessToken: accessToken,
            query:{},
            bindedCars:[],
            selectAll:false,
            dataSource : null,
            accessToken: accessToken,
            modalVisible:false
        };
    }


    render(){


        var username='danding';
        var {goodInfo}=this.state;

        var listView=null;

        if(this.state.dataSource!==undefined&&this.state.dataSource!==null)
        {

            listView=
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>;
        }else{
            this.fetchData();
        }


        return (
            <View style={{flex:1}}>
                <View style={[{padding: 10,marginTop:20,justifyContent: 'center',alignItems: 'center',flexDirection:'row',height:44},styles.card]}>
                    <TouchableOpacity onPress={()=>{
                        this.goBack();
                    }}>
                        <Image source={require('../../images/icon_back.png')} style={{width:30,height:30}}/>
                    </TouchableOpacity>
                    <Text style={{fontSize:17,flex:3,textAlign:'center'}}>
                        车辆管理
                    </Text>
                    <TouchableOpacity onPress={()=>{
                        this.carSelect();
                        }}>
                        <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center',backgroundColor:'#11c1f3',
                                    borderRadius:8,paddingTop:8,paddingBottom:8,paddingLeft:10,paddingRight:10,alignItems:'center'}}>
                            <Icon name="refresh" size={24} color="#fff"></Icon>
                        </View>
                    </TouchableOpacity>

                </View>


                {/*body*/}
                <View style={{padding:10,height:70}}>

                    <View style={[styles.row,{borderBottomWidth:0}]}>
                        <View style={{flex:1,borderWidth:1,borderColor:'#ddd'}}>
                            <TextInput
                                style={{height: 46,paddingLeft:10,paddingRight:10,paddingTop:6,paddingBottom:6,fontSize:18}}
                                onChangeText={(carNum) => {
                                  this.state.query.carNum=carNum;
                                  this.setState({query:this.state.query});
                                }}
                                value={this.state.query.carNum}
                                placeholder='请输入车牌号作为搜索条件'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={{width:60,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#00c9ff'}}>
                            <Icon size={21} color="#fff" name="search"></Icon>
                        </View>
                    </View>


                </View>


                <View style={{padding:15,height:height-274}}>
                    {listView}
                </View>

                <TouchableOpacity style={[styles.row,{borderBottomWidth:0,backgroundColor:'#00c9ff',width:width*3/5,marginLeft:width/5,
                        padding:10,borderRadius:10,justifyContent:'center'}]}
                                  onPress={()=>{
                                         this.setState({modalVisible:true});
                                      }}>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#fff',fontSize:19}}>创建新车</Text>
                    </View>
                </TouchableOpacity>



                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        console.log("Modal has been closed.");
                    }}
                >

                    <NewCarBind
                        onClose={()=>{
                            this.setState({modalVisible:!this.state.modalVisible});
                        }}
                        bindNewCar={
                            (carNum,cb)=>{
                                   this.bindNewCar(carNum,cb);
                            }
                        }
                        navigate2NewCarCreate={
                            (carNum,city)=>{this.navigate2NewCarCreate(carNum,city);}
                        }
                        onRefresh={()=>{
                            this.refresh();
                        }}
                        accessToken={this.props.accessToken}
                    />

                </Modal>


            </View>);
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderBottomWidth: 0,
        shadowColor: '#eee',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    logo:{
        width:width,
        height:290
    },
    module:{
        width:90,
        height:90
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row'
    }
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken
    })
)(CarManage);

