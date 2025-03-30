import {useEffect, useMemo, useState} from 'react'
import io  from 'socket.io-client'
import "tailwindcss";

const socket = io("http://localhost:3000") 


function App() {

  const [message , setMessage ] = useState<string>("")
  const [socketId , setSocketId] = useState('')
  const [converstationMessages , setConversationMessages ] = useState([''])
  const [room , setRooom ] =  useState('')
  const [newRoom , setNewRooom] = useState('')

  const handleSendMessage  = (e : any) => {
    e.preventDefault()
    socket.emit('message' , {message ,  room })
    setMessage("")
  }

  const joinRoom = (e  :any)=>{
    e.preventDefault()
    socket.emit('join-room' , newRoom)
    setNewRooom("")
  }



  useEffect(()=> {

    socket.on('connect' , ()=>{
      console.log("connected to the server")
      setSocketId(socket.id || "")
    })

    socket.on('welcome'  ,  (data)=> {
        console.log(data)
    })

    socket.on('receive-message' , (data : string)=>{
      setConversationMessages((prevMessage) => [...prevMessage , data])
      console.log(data)
      console.log([...converstationMessages])
    })

    return (()=>{
      socket.disconnect()
      
    })
    
  } , [])

  return (
    <div className=' flex justify-center items-center bg-green-200 h-screen w-[100vw] '>
      <div className =' flex-col space-y-10 bg-red-200 backdrop-blur-3xl  shadow-[6px_6px_0px_black] shadow- shadow-black justify-between border-2 border-black p-10 rounded-lg'>
      <h1 className='text-black font-bold'>{socketId}</h1>

      <form className=' flex  space-x-4'> 

        <input 
          type='text'
          value = {newRoom}
          className = 'border-2 border-black rounded-lg '
          onChange={(e) => setNewRooom(e.target.value)}
         /> 
        <button type='submit' className='bg-blue-500 rounded-md p-3 shadow-[6px_6px_0px_black] active:translate-x-0.5 active:shadow-[2px_2px_0px_black]' onClick={joinRoom}>
          Join Room
        </button>

      </form>
      
      <form className=' flex flex-col space-y-4'>
        <div className='flex flex-col space-y-2'>
        <input 
          type = "text"
          value={message}
          className='w-40  border-2 bg-green-400 border-black mr-3 focus:outline-blue-500'
          onChange={(e)=> setMessage(e.target.value)}
        /> 
        <input 
          type='text'
          value={room}
          className='border-2 border-black '
          onChange={(e) =>setRooom(e.target.value)}
        
        /> 
        <button type='submit' className='bg-blue-600 rounded-lg p-3 shadow-md shadow-black hover:shadow-inner' onClick={handleSendMessage}>
          Send Message 
        </button>
        </div>
      </form>

      <div>
        {converstationMessages.map(message => {
          return <p>{message}</p>
        })}
      </div>
      </div>
      
    </div>
  )
}

export default App
