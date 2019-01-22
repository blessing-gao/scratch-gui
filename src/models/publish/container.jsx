import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import PublishComponent from './component.jsx';
import {getProjectTags} from '../../lib/service/project-api';
import {closePublishModal} from '../../reducers/modals';


class PublishContainer extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
        ]);
        this.state = {
            tags: []
        };
    }
    componentDidMount () {
        getProjectTags().then(data => {
            this.setState({
                tags: data.restlt
            });
        });
    }

    render () {
        return (
            <PublishComponent
                coverSrc={this.state.coverSrc}
                project={this.state.project}
                tags={this.state.tags}
                onHandleCancel={this.props.onClosePublishModal}
                {...this.props}
            />);
    }
}

PublishContainer.propTypes = {
    onClosePublishModal: PropTypes.func,
    project: PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string
    })

};
const mapStateToProps = state => ({
    project: state.scratchGui.projectInfo
});

const mapDispatchToProps = dispatch => ({
    onClosePublishModal: () => dispatch(closePublishModal())

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishContainer);
