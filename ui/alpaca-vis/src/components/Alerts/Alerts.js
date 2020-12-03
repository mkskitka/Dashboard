import React, { useEffect, useState } from 'react';
import { FileUtils } from '../../utils/file-utils';
import { DataUtils } from '../../utils/data-process.js';
import './Alerts.css';
import { useSelector, useDispatch } from 'react-redux';
import { Accordion, Icon, Segment, Button, Form } from 'semantic-ui-react';
import AlertMetrics from './AlertMetrics';
import {DETAILS_VIEW, COMMENTS_VIEW} from '../../constants/constants';
import { LineChart, Line, ReferenceDot, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
//import AlertButtons from './AlertButtons';

import {
} from '../../redux/action-types';

var _ = require('lodash');

function Alerts() {

      useEffect(() => {

      }, []);

    return(
    <div className="Alerts">
        <div style={{ width: '100%', height: '40px', position: "relative"}}>t-3X3 Cluster Summary</div>
    </div>);

  }

export default Alerts