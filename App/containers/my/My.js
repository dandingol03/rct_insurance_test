/**
 * Created by dingyiming on 2017/2/13.
 */

import React,{Component} from 'react';

import  {
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    View,
    Alert,
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import Camera from '../../components/modal/CameraUtil';
import ImagePicker from 'react-native-image-picker';



var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');


class My extends Component{

    selectPhoto(){

        var options = {
            title: 'Select Avatar',
            customButtons: [
                {name: 'fb', title: 'Choose Photo from Facebook'},
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source
                });
            }
        });

    }

    constructor(props) {
        super(props);
        this.state={
            avatarSource: source
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>My</Text>
            </View>
        )

    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabContainer:{
        marginTop: 30
    },

});


module.exports = connect(state=>({
        carSelect:state.carInfo.carSelect
    })
)(My);

