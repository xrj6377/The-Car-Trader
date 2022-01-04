import React, { Component } from 'react'
import { contactSeller } from '../../actions/listing';
import './CarInfoContact.css'

export class CarInfoContact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            message: '',
            messageResponse: {
                type: '',
                body: ''
            }
        }
    }

    onSubmit = (e) => {
        e.preventDefault()
        const msg = `Regarding you ${this.props.currentCar.year} ${this.props.currentCar.make} ${this.props.currentCar.model}. My name is ${this.state.name} and my email is ${this.state.email}. ${this.state.message}`

        contactSeller(this.props.currentCar.creator, localStorage.userID, msg, this)

        this.setState({ name: '' })
        this.setState({ email: '' })
        this.setState({ message: '' })
    }

    render() {
        return (
            <div>
                <h3 id='contact-header'>Contact Seller</h3>
                <form className='contact-form' onSubmit={ this.onSubmit }>
                    <div className='form-control'>
                        <label>Name</label>
                        <input id = "name" classtype="text" value= { this.state.name } placeholder='Enter Your Name' onChange={ (e) => this.setState({ name: e.target.value }) } />
                    </div>
                    <div className='form-control'>
                        <label>Email Address</label>
                        <input id = "email" type="text" value= { this.state.email } placeholder='Enter Your Email Address' onChange={ (e) => this.setState({ email: e.target.value }) }/>
                    </div>
                    <div className='form-control'>
                        <label>Message</label>
                        <input id='message-input' value= { this.state.message } type="text" placeholder='Enter the message you want to send' onChange={ (e) => this.setState({ message: e.target.value }) }/>
                    </div>
                    <input type="submit" value='Send Message' className='btn'/>
                    <p className={ `messageResponse-${this.state.messageResponse.type}` }>{ this.state.messageResponse.body }</p>
                </form>
            </div>
            
        )
    }
}

export default CarInfoContact
