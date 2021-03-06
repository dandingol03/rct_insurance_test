/**
 * Created by dingyiming on 2017/2/13.
 */
/**
 * Created by danding on 16/12/6.
 */

import React,{Component} from 'react';

import  {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    Alert,
    TouchableOpacity,
    Dimensions,
    Modal,
    TextInput
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import UpdateCarInfo from '../UpdateCarInfo';

var {height, width} = Dimensions.get('window');
import AppendCarNumPrefixModal from './AppendCarNumPrefixModal';
var Proxy = require('../../proxy/Proxy');
var Config = require('../../../config');

class NewCarBind extends Component{

    close(){

        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
        //TODO:关闭时同步数据

    }

    appendCarNumPrefixByCity(val){
        this.setState({carNumPrefixModal: val});
    }


    getCarNumPrefixByCity(city)
    {
        var carNum=null;
        switch (city) {
            case '济南':
                carNum='鲁A';
                break;
            case '青岛':
                carNum='鲁B';
                break;
            case '淄博':
                carNum='鲁C';
                break;
            case '枣庄':
                carNum='鲁D';
                break;
            case '东营':
                carNum='鲁E';
                break;
            case '烟台':
                carNum='鲁F';
                break;
            case '潍坊':
                carNum='鲁G';
                break;
            case '济宁':
                carNum='鲁H';
                break;
            case '泰安':
                carNum='鲁J';
                break;
            case '威海':
                carNum='鲁K';
                break;
            case '日照':
                carNum='鲁L';
                break;
            case '滨州':
                carNum='鲁M';
                break;
            case '德州':
                carNum='鲁N';
                break;
            case '聊城':
                carNum='鲁P';
                break;
            case '临沂':
                carNum='鲁Q';
                break;
            case '菏泽':
                carNum='鲁R';
                break;
            case '莱芜':
                carNum='鲁S';
                break;
            default:
                break;
        }
        return carNum;
    }


    cityConfirm(city){
        //TODO:filter the city prefix
        var prefix=this.getCarNumPrefixByCity(city);
        this.setState({carNumPrefixModal: false,city:city,carNum:prefix});
    }

    bindCar()
    {

        // if(this.props.onClose!==undefined&&this.props.onClose!==null)
        // {
        //     this.props.onClose();
        // }

        //TODO:validate carNum

        if(this.state.city!==undefined&&this.state.city!==null&&this.state.city!='')
        {
            if(this.state.carNum.length==7||this.state.carNum.length==8)
            {
                var prefix=this.getCarNumPrefixByCity(this.state.city);
                if(prefix!=this.state.carNum.substring(0,2))
                {
                    Alert.alert(
                        '错误',
                        '您输入的车牌号前缀不对，请重新填入车牌号再点击绑定',
                        [
                            {text: 'OK', onPress: () => console.log('OK Pressed!')},
                        ]
                    );
                }else{

                    //TODO:invoke a request
                    if(this.props.bindNewCar!==undefined&&this.props.bindNewCar!==null)
                    {
                        this.props.bindNewCar(this.state.carNum,function (re,data) {
                            switch (re)
                            {
                                case -1:
                                    Alert.alert(
                                        '信息',
                                        '数据库中未保存此车,是否要创建新车',
                                        [
                                            {
                                                text: 'OK', onPress: () => {

                                                if(this.props.navigate2NewCarCreate!==undefined&&this.props.navigate2NewCarCreate!==null)
                                                {
                                                    if(this.props.onClose!==undefined&&this.props.onClose!==null)
                                                        this.props.onClose();
                                                    this.props.navigate2NewCarCreate(this.state.carNum,this.state.city);
                                                }
                                            }
                                            },
                                            {text: 'Cancel', onPress: () => console.log('OK Pressed!')},
                                        ]
                                    )
                                    break;

                                case -2:
                                    Alert.alert(
                                        '信息',
                                        '是否要创建新车',
                                        [
                                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                                            {text: 'OK', onPress: () =>{

                                                if(this.props.navigate2NewCarCreate!==undefined&&this.props.navigate2NewCarCreate!==null)
                                                {
                                                    if(this.props.onClose!==undefined&&this.props.onClose!==null)
                                                        this.props.onClose();
                                                    this.props.navigate2NewCarCreate(this.state.carNum,this.state.city);
                                                }
                                            }},
                                        ]
                                    )
                                    break;
                                case -3:
                                    Alert.alert(
                                        '信息',
                                        '该车还在保险期内,是否要创建新车',
                                        [{text:'Cancel'},{text:'OK',onPress:()=>{
                                            if(this.props.navigate2NewCarCreate!==undefined&&this.props.navigate2NewCarCreate!==null)
                                            {
                                                if(this.props.onClose!==undefined&&this.props.onClose!==null)
                                                    this.props.onClose();
                                                this.props.navigate2NewCarCreate(this.state.carNum,this.state.city);
                                            }
                                        }}]
                                    )
                                    break;
                                case 1:

                                    Alert.alert('信息','车辆绑定成功',[{text:'OK',onPress:()=>{
                                        if(this.props.onClose!==undefined&&this.props.onClose!==null)
                                            this.props.onClose();
                                        if(this.props.onRefresh!==undefined&&this.props.onRefresh!==null)
                                            this.props.onRefresh();
                                    }}])
                                    break;
                                default:
                                    break;
                            }
                        }.bind(this));
                    }

                }
            }else{
                Alert.alert(
                    '错误',
                    '您填入的车牌号位数不对,请重新填入车牌后点击绑定',
                    [
                        {text: 'OK', onPress: () => console.log('OK Pressed!')},
                    ]
                );
                return;
            }

        }else{
            Alert.alert(
                '错误',
                '请选择用车城市后再点击绑定',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed!')},
                ]
            )
        }

    }

    fetchData(){
        Proxy.post({
            url:'/svr/request',
            headers: {
                'Authorization': "Bearer " + this.state.accessToken,
                'Content-Type': 'application/json'
            },
            body: {
                request:'fetchInsuranceCarInfoByCustomerId'
            }
        },(res)=> {
            if(res.error)
            {
                Alert.alert(
                    'error',
                    res.error_description
                );
            }else{
                var data=res.data;
                var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({dataSource: ds.cloneWithRows(data)});
            }
        }, (err) =>{
        });
    }



    constructor(props)
    {
        super(props);
        const {accessToken}=this.props;
        this.state={
            city:null,
            carNum:null,
            carNumPrefixModal:false,
            accessToken:accessToken
        }
    }

    render(){




        return (
            <View style={{flex:1}}>

                <View style={[{backgroundColor:'#444',padding: 10,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <View style={{flex:1}}>
                        <TouchableOpacity onPress={()=>{
                        this.close();
                            }}>
                            <Icon name='chevron-left' size={30} color="#fff"/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:17,flex:3,textAlign:'center',color:'#fff'}}>
                        绑定新车
                    </Text>
                    <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                        <TouchableOpacity onPress={
                            ()=>{
                                this.close();
                            }
                        }>
                            <Icon name="times-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>



                <View style={{flex:2,padding:10}}>
                    <View style={styles.row}>

                        <View style={{marginRight:20,width:30,flexDirection:'row',alignItems:'center'}}>
                            <Icon name="map-marker" size={24}/>
                        </View>

                        <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{'fontSize':16}}>用车城市:</Text>
                        </View>

                        <View style={{flex:5,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Text style={{color:'#222',fontSize:18}}>{this.state.city}</Text>
                        </View>

                        <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={
                                    ()=>{
                                        this.appendCarNumPrefixByCity(true);
                                    }}>
                                <Icon name="chevron-right" size={24}/>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={[styles.row,{alignItems:'center'}]}>

                        <View style={{marginRight:20,width:30,flexDirection:'row',alignItems:'center'}}>
                            <Icon name="address-card-o" size={24}/>
                        </View>

                        <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{'fontSize':16}}>车牌:</Text>
                        </View>

                        <View style={{flex:5,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <TextInput
                                style={{borderBottomWidth:0,fontSize:18,flex:1,textAlign:'center'}}
                                editable = {true}
                                height={40}
                                onChangeText={
                                    (carNum)=>this.setState({carNum:carNum})
                                }
                                value={this.state.carNum}
                                placeholder='请输入将要创建的车牌号'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                                autoCapitalize="characters"
                            />
                        </View>

                        <View style={{flex:1}}></View>
                    </View>

                    <View style={[styles.row,{borderBottomWidth:0,justifyContent:'center'}]}>
                        <View style={{width:width/3}}>
                            <Icon.Button name="hand-o-up" backgroundColor="#3b5998" onPress={
                            ()=>{
                                this.bindCar();
                            }
                        }>
                                <Text style={{fontFamily: 'Arial', fontSize: 15,textAlign:'center',color:'#fff'}}>
                                    绑定新车
                                </Text>
                            </Icon.Button>
                        </View>
                    </View>

                </View>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.carNumPrefixModal}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                >

                    <AppendCarNumPrefixModal
                        onClose={()=>{
                            this.appendCarNumPrefixByCity(!this.state.carNumPrefixModal)
                        }}
                        onConfirm={(city)=>{
                            this.cityConfirm(city);
                        }}
                    />

                </Modal>


            </View>
        );
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderTopWidth:0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        borderTopColor:'#fff',
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        paddingTop:8,
        paddingBottom:8,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    }
});


module.exports = NewCarBind;
