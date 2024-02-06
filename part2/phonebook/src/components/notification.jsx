const Notification = ({ info }) => {
    if (info.message === null) {
      return null
    }
    const Style = {
      color: info.type==='error' ? 'red' : 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }
    return (
      <div style ={Style} className='added'>
        {info.message}
      </div>
    )
  }
  export default Notification