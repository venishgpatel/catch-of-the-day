import React from 'react';
import Header from './header';
import Order from './order';
import Inventory from './inventory';
import SampleFishes from '../sample-fishes'
import Fish from './fish';
import base from '../base';
import PropTypes from 'prop-types';

class Home extends React.Component {
    constructor() {
        super();
        this.addFish = this.addFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.removeFromOrder = this.removeFromOrder.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.removeFish = this.removeFish.bind(this);

        this.state = {
            fishes: {},
            order: {}
        }
    } 

    componentDidMount() {
        const ref = base.database().ref(`${this.props.match.params.storeId}`);

        if(this.state.fishes != null) {
            ref.child('fishes').once('value', (snapshot) => {
                const data = snapshot.val() || {};
                this.setState({
                    fishes: data
                });
            });
        }

        ref.child('fishes').on('value', (snapshot) => {
            const data = snapshot.val() || {};
            
            this.setState({
                fishes: data
            });
        });
        
        const localStorageRef = localStorage.getItem(`order-${this.props.match.params.storeId}`);
        if(localStorageRef) {
            this.setState({
                order: JSON.parse(localStorageRef)
            });
        }
    }

    componentWillUnmount() {
        //base.removeBinding(this.ref);
    }

    getSnapshotBeforeUpdate(nextProps, nextState) {
        if(nextState.order !== this.state.order) {
            return this.state.order;
        }
        return null;
    }

    componentDidUpdate(nextProps, nextState, snapshot) {
        if(snapshot !== null) {
            localStorage.setItem(`order-${this.props.match.params.storeId}`, 
            JSON.stringify(snapshot));
        }   
        if(nextState.fishes !== this.state.fishes) {
            base.database().ref(`${this.props.match.params.storeId}`).set({fishes: this.state.fishes});
        }
    }

    addFish(fish) {
        const fishes = {...this.state.fishes};
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        this.setState({ fishes });
    }

    updateFish(key, updatedFish) {
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({ fishes });
    }

    removeFish(key) {
        const fishes = {...this.state.fishes};
        fishes[key] = null;
        this.setState({ fishes });
    }

    loadSamples() {
        let sampleFishes = SampleFishes;
        if(this.state.fishes) {
            sampleFishes = {...this.state.fishes, ...sampleFishes};
        } 
        this.setState({ 
            fishes: sampleFishes 
        });
    }

    addToOrder(key) {
        const order = {...this.state.order};
        order[key] = order[key] + 1 || 1;
        this.setState({ order });
    }

    removeFromOrder(key) {
        const order = {...this.state.order};
        delete order[key];
        this.setState({ order });
    }

    render() {
        return ( 
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                        { Object
                            .keys(this.state.fishes)
                            .map(key => 
                                <Fish 
                                    key={key} 
                                    index={key} 
                                    details={this.state.fishes[key]} 
                                    addToOrder={this.addToOrder} />) }
                    </ul>
                </div>

                <Order 
                    fishes={this.state.fishes} 
                    order={this.state.order} 
                    params={this.props.match.params}
                    removeFromOrder={this.removeFromOrder} />

                <Inventory 
                    addFish={this.addFish} 
                    loadSamples={this.loadSamples}
                    fishes={this.state.fishes}
                    updateFish={this.updateFish}
                    removeFish={this.removeFish}
                    storeId={this.props.match.params.storeId} />
            </div>
        )
    }
}

Home.propTypes = {
    match: PropTypes.object.isRequired
};

export default Home;