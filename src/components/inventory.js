import React from 'react';
import AddFishForm from './addFishForm';
import PropTypes from 'prop-types';
//import base from '../base';
import base from '../base';

class Inventory extends React.Component {
	constructor() {
		super();
		this.renderInvetory = this.renderInvetory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.authHandler = this.authHandler.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            uid: null,
            owner: null
        };
    }
    
    componentDidMount() {
        base.auth().onAuthStateChanged((user) => {
            if(user) {
                this.authHandler({user});
            }
        });
    }

	handleChange(key, e) {
		const fish = this.props.fishes[key];
        const updatedFish = { ...fish, [e.target.name]: e.target.value };
        this.props.updateFish(key, updatedFish);
    }
    
    authenticate() {
        const provider = new base.auth.GoogleAuthProvider();

        base.auth().signInWithPopup(provider).then((result) => {
            this.authHandler(result);
        });
        
        /*
        //base.auth().signInWithRedirect(provider);
        
        let provider = new base.auth.GoogleAuthProvider();

        base.auth().signInWithRedirect(provider);
        console.log('redirect')
        base.auth().getRedirectResult().then(function(result) {
            var user = result.user;
            console.log(user);
            var credential = result.credential;
            console.log(credential);
        }).catch(function(error) {
            console.log(error);
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });*/
    }

    logout() {
        base.auth().signOut();
        this.setState({
            uid: null
        });
    }

    authHandler(authData) {
        const storeRef = base.database().ref(this.props.storeId);
        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};

            if(!data.owner) {
                storeRef.set({
                    owner: authData.user.uid
                })
            }
            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            });
        });
        
        if(!this.state.fishes) {
            storeRef.child('fishes').once('value', (snapshot) => {
                const data = snapshot.val() || {};
                this.setState({
                    fishes: data
                });
            });
    
        }
    }

	renderLogin() {

		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage your store's Inventory</p>
				<button className="google" onClick={this.authenticate}>Log In with Google</button>
			</nav>
		);
	}

	renderInvetory(key) {
		const fish = this.props.fishes[key];
		return (
			<div className="fish-edit" key={key}>
				<input
					type="text"
					name="name"
					value={fish.name}
					placeholder="name"
					onChange={(e) => this.handleChange(key, e)}
				/>
				<input
					type="text"
					name="price"
					value={fish.price}
					placeholder="price"
					onChange={(e) => this.handleChange(key, e)}
				/>
				<select
					type="text"
					name="status"
					value={fish.status}
					placeholder="status"
					onChange={(e) => this.handleChange(key, e)}
				>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea
					type="text"
					name="desc"
					value={fish.desc}
					placeholder="desc"
					onChange={(e) => this.handleChange(key, e)}
				/>
				<input
					type="text"
					name="image"
					value={fish.image}
					placeholder="image"
					onChange={(e) => this.handleChange(key, e)}
				/>
				<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
			</div>
		);
	}

	render() {
        const logout = <button onClick={this.logout}>Log Out</button>;

        if(!this.state.uid) {
            return <div>{this.renderLogin()}</div>
        }

        if(this.state.uid !== this.state.owner) {
            return(
                <div>
                    <p>Sorry you aren't the owner of this store!</p>
                    {logout}
                </div>
            )
        }

		return (
			<div>
				<h2>Inventory</h2>
                {logout}
				{Object.keys(this.props.fishes).map(this.renderInvetory)}
				<AddFishForm addFish={this.props.addFish} />
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		);
	}
}

Inventory.propsTypes = {
	fishes: PropTypes.object.isRequired,
	addFish: PropTypes.func.isRequired,
	updateFish: PropTypes.func.isRequired,
	removeFish: PropTypes.func.isRequired,
    loadSamples: PropTypes.func.isRequired,
    storeId: PropTypes.string.isRequired
};

export default Inventory;
