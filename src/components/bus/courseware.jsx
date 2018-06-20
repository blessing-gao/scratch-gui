// import bindAll from 'lodash.bindall';
// import React from 'react';
// import {Document, Page} from 'react-pdf';
//
// class CourseWareComponents extends React.Component {
//
//     constructor (props) {
//         super(props);
//         bindAll(this, [
//             'onDocumentLoad'
//         ]);
//         this.state = {
//             numPages: null,
//             pageNumber: 1
//         };
//     }
//     onDocumentLoad ({numPages}) {
//         this.setState({numPages: numPages,
//             pageNumber: 36});
//     }
//
//     render () {
//         return (
//             <div>
//                 <Document
//                     file="http://otmzovudi.bkt.clouddn.com/test.pdf"
//                     onLoadSuccess={this.onDocumentLoad}
//                 >
//                     <Page pageNumber={this.state.pageNumber} />
//                 </Document>
//                 <p>Page {this.state.pageNumber} of {this.state.numPages}</p>
//             </div>
//         );
//     }
// }
//
// export default CourseWareComponents;
