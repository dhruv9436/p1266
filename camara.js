import * as React from  "react"
import {Button,Image,View,Platform} from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

export default class PickImage extends React.Component{
    state={
        image:null
    }

    render(){
        let {image}=this.state

        return{(
            <View style = {{
                flex:1,
                aligenItems:"center",
                justifyContent:""
            }}>
                <button title ="pick an image frim camera roll"
                onPress = {
                    this._pickImage
                }></button>
            </View>

        )}
    }

    getPermissionAsync = async()=>{
        if(Platform.OS !== "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status !== "granted"){
               alert("Sorry , we need camera roll permission to make this work ") 
            }
        }
    }

    componentDidMount(){
        this.getPermissionAsync()
    }

    uploadImage = async(uri)=>{
        const data = new FormData()
        let filename = uri.split("/")[uri.split("/").length-1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const fileToUpload = {
            uri:uri, name:filename, type:type
        }
        data.append("digit",fileToUpload)
        fetch('https://f292a3137990.ngrok.io/predict-digit',{
            method:"POST", body:data, 
            headers:{
                "content-type":"multipart/form-data"
            }
        })
        .then((response)=>response.json())
        .then((resut)=>{
            console.log("succes:", result)
        })
        .catch((error)=>{
            concol.error("error:",error)
        })
    }

    _pickImage=async()=>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaType:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            })
            if(!result.cancelled){
                this.setState({image:result.data})
                console.log(rsult.uri)
                this.uploadImage(result,uri)
            }

        }
        catch(E){
            console.log(E)
        }
    }


}