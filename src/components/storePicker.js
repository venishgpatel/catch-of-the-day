import React from 'react';
import { getFunName } from '../helpers';
import PropTypes from 'prop-types';

class StorePicker extends React.Component {
    constructor() {
        super();
        this.goToStore = this.goToStore.bind(this);
    }

    goToStore(event) {
        event.preventDefault();
        const storeId = this.storeInput.value;
        console.log(`going to store ${storeId}`);
        this.props.history.push(`/store/${storeId}`);
    }

    render() {
        return (
            <form action="" className="store-selctor" onSubmit={this.goToStore}>
                <h2>Please enter a store</h2>
                <input type="text" required placeholder="Store Name" defaultValue={getFunName()} 
                    ref={(input) => {this.storeInput = input}} />
                <button type="submit">Visit Store</button>
            </form>
        )
    }
}

StorePicker.propTypes = {
    history: PropTypes.object.isRequired
};

export default StorePicker;