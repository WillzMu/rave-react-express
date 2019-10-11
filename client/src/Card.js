import React from 'react'

class Card extends React.Component {
  constructor(){
    super()
    this.state = {
      amount: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    }
  }

  handleClick = async () => {
   const { amount, cardNumber, expiryDate, cvv } = this.state
   try {
   const data = await fetch(`http://localhost:5000/initiate-charge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amount, cardNumber, expiryDate, cvv })
   })
   const res = await data.json()

   const { message: { authurl, status } } = res
   if(status === 'success-pending-validation' && authurl) {
    window.location.assign(authurl)
   }
  } catch(error) {
    // TODO: remove log and show error message
    console.log(error)
  }
  }

  handleInput = (field, value) => this.setState({ [field]: value })

 render(){

  // TODO: configure eslint
  // TODO: call this route 'card' and make a separate 'mtn' mobile money route
  // TODO: clear input fields after pressing the button
  // TODO: show success, error message, and/or loader after pressing the button
  return (
    <div className="container">
      <div className="formContainer">
      <h1>Rave payment test</h1>
      <input placeholder="amount" type="number" onChange={(e) => this.handleInput("amount", e.target.value)} required />
      <input placeholder="card number" type="text" onChange={(e) => this.handleInput("cardNumber", e.target.value)} required />
      <input placeholder="expiry date" type="text" onChange={(e) => this.handleInput("expiryDate", e.target.value)} required />
      <input placeholder="cvv" type="number" onChange={(e) => this.handleInput("cvv", e.target.value)} required />
      <button onClick={() => this.handleClick()}>pay me</button>
      </div>
    </div>
  );
 }
}

export default Card