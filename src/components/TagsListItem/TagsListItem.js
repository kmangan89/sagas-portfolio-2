import React, { Component } from 'react';
import { connect } from 'react-redux';

class TagsListItem extends Component {


    render() {
        return (
            <option value={this.props.tag.name}>{this.props.tag.name}</option>
        );
    }
}

const mapStateToProps = (reduxState) => {
    return reduxState;
}

export default (connect(mapStateToProps)(TagsListItem));