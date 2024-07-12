const socket=io()
const markers={}
var map = L.map('map').setView([0 ,0], 14)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 30,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) =>{
        const {latitude,longitude}=position.coords
        console.log(latitude,longitude)
        socket.emit("sendlocation",{latitude,longitude})
        socket.on("getuserlocation",async(data)=>{
            console.log("other user location",data)
            const {id,latitude,longitude}= await data;
            console.log(id,latitude,longitude)
            map.setView([latitude,longitude],14)
            if(markers[id]){
                markers[id].setLatLng([latitude,longitude])
            }else{
                markers[id]=L.marker([latitude,longitude]).addTo(map);
            }
            console.log(id)
            
        })
        socket.on("userdisconnected",(id)=>{
           if(markers[id]){
            map.removeLayer(markers[id])
            delete markers[id]
           }
           console.log("removed")
        })
    },
),(error)=>{
        console.error(error)
    }, {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      };
}else{
    console.log("Geolocation is not supported")
}

