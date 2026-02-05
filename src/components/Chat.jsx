import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import styles from '../styles/Chat.module.css'
import icon from '../images/emoji.svg'
import EmojiPicker from 'emoji-picker-react'
import Messages from './Messages'

const socket = io.connect('https://chat-server-tebt.onrender.com')

const Chat = () => {
  const { search } = useLocation()   // getting location as string value with params
  const [params, setParams] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isOpenEmojies, setIsOpenEmojies] = useState(false)
  const [usersInTheRoom, setUsersInTheRoom] = useState(0)
  const nav = useNavigate()
  const [userRooms, setUserRooms] = useState([])

  useEffect(() => {
    const inputParams = Object.fromEntries(new URLSearchParams(search))
    setParams(inputParams)
    socket.emit("join", inputParams)
  }, [search])

  useEffect(() => {
    socket.on('message', ({ data }) => {
      setMessages((messages) => [ ...messages, data ])
    })
  }, [])

  useEffect(() => {
    socket.on('joinTheRoom', ({ data: { users } }) => {
      setUsersInTheRoom(users.length)
    })
  }, [])

  useEffect(() => {
    socket.on('userRooms', ({ data: { rooms } }) => {
      const roomsList = rooms.map(user => user.room)
      setUserRooms(roomsList)
    })
  }, [])

  console.log(userRooms)

  const handleChange = ({ target: { value }}) => {
    setInput(value)
  }

  const onEmojiClick = ({ emoji }) => setInput(`${input} ${emoji}`)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    socket.emit('sendMessage', { input, params });
    setInput("")
  }

  const leaveRoom = () => {
    socket.emit('leaveTheRoom', { params })
    nav("/")
  }

  const enterRoom = (goTo) => {
    nav(`/room?name=${params?.name}&room=${goTo}`)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.roomTitle}>{params?.room}</div>
        <div className={styles.users}>{usersInTheRoom} users in the room</div>
        <div className={styles.rooms}>
          {userRooms.map(room => <div
            className={`${params?.room === room ? styles.roomActive : styles.room}`}
            onClick={() => enterRoom(room)}
          >
            {room}
          </div>)}
        </div>
        <button className={styles.leaveBtn} onClick={leaveRoom}>Leave</button>
      </div>

      <Messages messages={messages} name={params?.name} />
      
      <form className={styles.sendMessageForm} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input
            type="text"
            name="message"
            placeholder="Place to say something..."
            value={input}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.emoji}>
          <img src={icon} alt="emoji icon" onClick={() => setIsOpenEmojies(!isOpenEmojies)}/>
          <div className={styles.emojies}>
            {isOpenEmojies && (
              <EmojiPicker onEmojiClick={onEmojiClick} />
            )}
          </div>
        </div>
        <div className={styles.send}>
          <input type="submit" value="Send a message" />
        </div>
      </form>
    </div>
  )
}

export default Chat