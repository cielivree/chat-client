import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Main.module.css'

const INPUTS = {
  USERNAME: "username",
  ROOMNAME: "roomname"
}

const Main = () => {
  const { USERNAME, ROOMNAME } = INPUTS
  const [values, setValues] = useState({ [USERNAME]: "", [ROOMNAME]: "" })  // square brackets, 'cos variable here is dynamically changing

  const handleChange = ({ target: { name, value } }) => {
    setValues({ ...values, [name]: value })     // for remembering each letter in value..
    console.log(values)
  }

  const linkClick = (e) => {
    const isDisabled = Object.values(values).some(value => !value)   // checking if value's existing..
    if (isDisabled) e.preventDefault()  // nothing will happen)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Join</h1>
        <form className={styles.form}>
          <div className={styles.formItem}>
            <input
              className={styles.input}
              name="username"
              value={values[USERNAME]}
              type="text"
              placeholder="Your name"
              autoComplete="off"
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formItem}>
            <input
              className={styles.input}
              name="roomname"
              value={values[ROOMNAME]}
              type="text"
              placeholder="Room"
              autoComplete="off"
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formItem}>
            <Link
              to={`/room?name=${values[USERNAME]}&room=${values[ROOMNAME]}`}
              onClick={linkClick}
            >
              <button
                type="submit"
                className={styles.button}
              >Go to the room</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Main