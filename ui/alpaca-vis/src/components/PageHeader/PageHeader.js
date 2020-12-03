import React, { useEffect } from 'react';
import {FileUtils} from '../../utils/file-utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Accordion, Icon, Segment, Button, Form } from 'semantic-ui-react';
import "./PageHeader.css"




function PageHeader() {

  // Component Did Mount
  useEffect(() => {
  }, []);

  return (
    <div className="PageHeader">
    </div>
  );
}

export default PageHeader;