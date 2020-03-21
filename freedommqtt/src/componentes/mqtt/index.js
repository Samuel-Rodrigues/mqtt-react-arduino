import React from 'react'
import Paho from 'paho-mqtt';


export default async function mqtt() {

  const response =[];
  
  const client = new Paho.Client('tailor.cloudmqtt.com', 33398, '8s8282')

  
  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

 

  // connect the client
  client.connect({
    useSSL: true,
    userName: 'yglgzsbj',
    password: '2jDjjt_zvJL5',
    onSuccess: onConnect,
    onFailure: doFail
  });

  function doFail(e) {
    console.log(e);
  }

  // called when the client connects
  function onConnect() {

    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("@FREEDOM_ENGENHARIA_REACT");
    const message = new Paho.Message("getAll");
    message.destinationName = "@FREEDOM_ENGENHARIA_WEMOS_ID=TESTE"; //@FREEDOM_ENGENHARIA_WEMOS_ID=TESTE
    client.send(message);
  }
  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("response:" + responseObject.errorMessage);
    }
  }

  function sendArduino(){
    console.log("onConnect");
    client.subscribe("@FREEDOM_ENGENHARIA_REACT");
    const message = new Paho.Message("getAll");
    message.destinationName = "@FREEDOM_ENGENHARIA_WEMOS_ID=TESTE"; //@FREEDOM_ENGENHARIA_WEMOS_ID=TESTE
    client.send(message);
  }

  // called when a message arrives
 function onMessageArrived(message) {
    //console.log("response:" + message.payloadString);
    const [a,b,c,d,e,f,g,h,i,j,l,m,n,o,p,q] = message.payloadString.split(',')
    console.log('VALOR COPILADO' ,a,b,c,d,e,f,g,h,i,j,l,m,n,o,p,q)
    client.disconnect();
    //return [a,b,c,d,e,f,g,h,i,j,l,m,n,o,p,q]
  }

  //return 
}
