import React, { useState, useEffect, useCallback } from 'react'

import Paho from 'paho-mqtt';

export default function Home() {

  const divStyle1 = {
    display: 'inline',
    height: 100,
    width: 200,
    marginLeft: '0px',

  }
  const divStyle2 = {
    display: 'inline',
    height: 50,
    width: 200,
    marginTop: '20px',
    marginLeft: '0px',
  }

  const button = {
    background: '#eee',
    margin: '10px',
    fontSize: '20px',
    color: '#111'
  }

  const titleText = {
    fontSize: '20px'
  }

  const buttonOn = {
    width: '60px',
    marginLeft: '5px',
    background: 'green',
    color: '#eee'
  }

  const buttonOff = {
    width: '60px',
    marginLeft: '5px',
    background: 'red',
    color: '#eee'
  }

  const logCss = {
    fontSize: '12px',
    margin: '0px',
    fontWeight: 'none',
    display: 'block'
  }



  const [get, setGet] = useState([true])
  const [list, setList] = useState([])
  const [log, setLog] = useState('')
  const [title, setTitle] = useState('Sistema de Monitoramento')
  const [newReles, setNewReles] = useState([])

  const [reles, setReles] = useState([
    { nome: 'Estado', estado: list[0] },
    { nome: 'Pressos 01', estado: list[1] },
    { nome: 'Pressos 02', estado: list[2] },
    { nome: 'Cisterna BS', estado: list[3] },
    { nome: 'Cisterna BI', estado: list[4] },
    { nome: 'Motor 01', estado: list[5] },
    { nome: 'Motor 02', estado: list[6] },
    { nome: 'Motor 03', estado: list[7] },
    { nome: 'Motor 04', estado: list[8] },
    { nome: 'FFaseState', estado: list[9] },
    { nome: 'MotorDaVez', estado: list[10] },
    { nome: 'Entrada Auxiliar', estado: list[11] },
    { nome: 'Atuador 01', estado: list[12] || '0' },
    { nome: 'Atuador 02', estado: list[13] || '0' },
    { nome: 'Atuador 03', estado: list[14] || '0' },
    { nome: 'Atuador 04', estado: list[15] || '0' },
  ])

  getList(get)
  const check = useCallback(() => {
    setReles({ newReles });
  }, [newReles])

  function getList() {

    if (get) {
      // setList([])

      mqtt();
      setGet(false)
      return
    }
    return
  }

  function mudaEstado(r) {
    if (r.nome === 'Atuador 01' || r.nome === 'Atuador 02' || r.nome === 'Atuador 03' || r.nome === 'Atuador 04') {
      console.log(r.nome, r.estado)
      mqtt(r)

      const index = reles.indexOf(r)
      var newReles = reles

      newReles[index].estado = (Number(r.estado) === 1 ? '0' : '1')
      setNewReles({ newReles })

      console.log('valor antigo', r.estado)
      console.log('valor novo', r.estado)
      console.log(reles)

    } else {
      return
    }

  }

  return (
    <>

      <span >
        <img style={divStyle1} src="https://github.com/carloslcor/documentos_auxiliares/blob/master/Clientes/Logomarcas/Beach%20Place.jpg?raw=true" />
      </span>

      <h1 style={titleText}>{title}</h1>
      
      {reles.map(r => (
        <>
          <div key={r.nome}>
            <span >{r.nome}</span>
            {(r.nome === 'Atuador 01' || r.nome === 'Atuador 02' || r.nome === 'Atuador 03' || r.nome === 'Atuador 04') ? (
              <button style={r.estado === '0' ? buttonOn : buttonOff} type="button"
                onClick={() => mudaEstado(r)}
              >{r.estado === '1' ? 'Desligar' : 'Ligar'}</button>
            ) : <></>}

            <input type="checkbox"
              checked={(Number(r.estado) === 1 ? true : false)}
              onClick={() => mudaEstado(r)}
            />
          </div>
        </>
      ))}
      <div>

        <button style={button} onClick={() => { getList(true); setGet(true) }}>Atualizar</button>
        <span style={logCss}>Log: <span >{log}</span></span>
      </div>
      <span >
        <img style={divStyle2} src="https://github.com/carloslcor/documentos_auxiliares/blob/master/Clientes/Logomarcas/Mega%20Geradores.jpg?raw=true" />
      </span>
    </>
  )
  function mqtt(atuador) {
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

      if (atuador) {
        client.subscribe("@FREEDOM_ENGENHARIA_REACT");
        const message = new Paho.Message(`${atuador.nome}, ${atuador.estado}`);
        message.destinationName = "@FREEDOM_ENGENHARIA_WEMOS_ID=TESTE"; //@FREEDOM_ENGENHARIA_WEMOS_ID=TESTE
        client.send(message);
        return
      }
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

    function sendArduino() {
      console.log("onConnect");
      client.subscribe("@FREEDOM_ENGENHARIA_REACT");
      const message = new Paho.Message("getAll");
      message.destinationName = "@FREEDOM_ENGENHARIA_WEMOS_ID=TESTE"; //@FREEDOM_ENGENHARIA_WEMOS_ID=TESTE
      client.send(message);
    }

    function onMessageArrived(message) {

      console.log("onMessageArrived: " + message.payloadString);
      setLog(message.payloadString)
      const lastMsg = message.payloadString;

      const [a, b, c, d, e, f, g, h, i, j, l, m, n, o, p, q] = lastMsg.split(',')

      var newReles = reles
      newReles[0].estado = a
      newReles[1].estado = b
      newReles[2].estado = c
      newReles[3].estado = d
      newReles[4].estado = e
      newReles[5].estado = f
      newReles[6].estado = g
      newReles[7].estado = h
      newReles[8].estado = i
      newReles[9].estado = j
      newReles[10].estado = l
      newReles[11].estado = m
      newReles[12].estado = n
      newReles[13].estado = o
      newReles[14].estado = p
      newReles[15].estado = q
      setReles([])
      setReles(newReles)

    }
  }


}

