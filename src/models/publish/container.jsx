import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import PublishComponent from './component.jsx';
import {getProjectTags} from '../../lib/service/project-api';
import {closePublishModal} from '../../reducers/modals';

const PROJECT_TYPE = 5;
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
        getProjectTags(PROJECT_TYPE).then(data => {
            if (data.code === 0 && data.result) {
                const tags = [];
                data.result.map(tag => {
                    tags.push({id: tag.typeId, title: tag.name});
                    return tag;
                });
                if (tags){
                    this.setState({tags: tags});
                }

            }
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
