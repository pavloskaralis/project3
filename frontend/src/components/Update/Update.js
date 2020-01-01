import React, { Component } from 'react'
import history from '../../history.js'
import axios from 'axios'
import './Update.css'
import { number } from 'prop-types';

class Update extends Component {
    state = {
        title: '',
        users: [],
        items: [],
        rows: ''
    } 

    componentDidMount = () => {
        axios.get('http://localhost:3001/list/id/' + this.findID())
        .then(response => this.setState({
            title: response.data.title,
            users: response.data.users,
            items: response.data.items,
        })).then(() => {
            const rows = this.state.items.length;
            const state = {
                rows: rows
            }
            for(let i = 1; i <= rows; i ++){
                state['name' + i] = this.state.items[i - 1].name;
                state['quantity' + i] = this.state.items[i - 1].quantity;
            }
            this.setState(state)
        })
    }


    findID = () => {
        const url = window.location.href
        const splitUrl = url.split('/');
        const listID = splitUrl[splitUrl.length - 1];
        return listID
    }

    handleInput = (e) => this.setState({[e.target.id]: e.target.value});

    addInput = () => {
        const num = this.state.rows + 1;
        this.setState({
            ['input'+ num]:"",
            ['quantity' + num]:"",
            rows: num
        })
    }

    //put route
    handleUpdate = (e) => {
        e.preventDefault();
        const list = {
            title: this.state.title,
            users: this.state.users,
            items: []
        };
        for(let i = 1; i <= this.state.rows; i++){
            if((this.state['item' + i]) && (this.state['quantity' + i])){
                const item = {
                    name: this.state['item' + i],
                    quantity: this.state['quantity' + i],
                    crossed: false
                }
                list.items.push(item);
            }
        }
        if(this.state.title){
            axios.put('http://localhost:3001/list/id/' + this.findID(), list)
            .then(() => history.push('/shopping-lists/' + this.findID())) 
        }
    }

    //put route
    deleteList = () => {
        const list = {
            title: this.state.title,
            users: this.state.users,
            items: this.state.items
        }
        const index = list.users.indexOf(this.props.username);
        list.users.splice(index, 1);
        if (list.users.length > 0) {
            axios.put('http://localhost:3001/list/id/' + this.findID(), list)
            .then(() => history.push('/shopping-lists/'))
            .then(response => console.log(response.data.confirm))
        } else {
            axios.put('http://localhost:3001/list/id/' + this.findID(), list)
            .then(response => console.log(response.data.confirm))
            .then(() => history.push('/shopping-lists/'))
        }
    }

    render () {
        const rows = [];
        for(let i = 1; i <= this.state.rows; i ++){
            rows.push(
                <div key={i}>
                    <input type="text" onChange={this.handleInput} value={this.state["name" + i]} placeholder="item name" id={"item" + i} />
                    <input type="text" onChange={this.handleInput} value={this.state["quantity" + i]} placeholder="quantity" id={"quantity" + i} />
                </div>
            )
        }

        return (
            <div>
                <div>
                    <div>Update List</div>
                    <div>
                        Update your list here. <br/>
                        Change the title, items, or quantity that needs to be bought. <br/>
                        You can also add new items to your list. 
                    </div>
                </div>

                <form onSubmit={this.handleUpdate}>
                    <input type="text" onChange={this.handleInput} value={this.state.title} placeholder="shopping list title" id="title"/>
                    {rows}
                    <div onClick={this.addInput}>+</div>
                    <div>
                        <button type="submit">Submit Changes</button>
                        <button onClick={this.deleteList}>Delete List!!!</button>
                    </div>     
                </form>

            </div>
        )
    }
}

export default Update
