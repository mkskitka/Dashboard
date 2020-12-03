import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import logo from './logo.svg';
import './App.css';
import { FileUtils } from './utils/file-utils';
import { DataUtils } from './utils/data-process'
import Sidebar from "./components/Sidebar/Sidebar";
import ClusterView from "./components/ClusterView/ClusterView";
import PageHeader from "./components/PageHeader/PageHeader";
import { Breadcrumb, Button, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

import {
	ADD_CLUSTER_GRAPH_DATA,
} from './redux/action-types';

var _ = require('lodash');

function App() {
const dispatch = useDispatch()

  useEffect(() => {
    async function doImportCSV() {
        let fileImportPromise = FileUtils.importCSV("testing")
        const [res] = await Promise.all([fileImportPromise]);
        let dataStr = JSON.stringify(res.data);
        let data = JSON.parse(dataStr);
        let processedData = DataUtils.processRaw(data);
        console.log(processedData)
        console.log(DataUtils.getClusterLabels(processedData))
        dispatch({ type: ADD_CLUSTER_GRAPH_DATA, data: processedData})
    }
    doImportCSV()
  }, []);

  return (
    <div className="App">
        <PageHeader/>
        <Sidebar/>
        <ClusterView/>
    </div>
  );
}

export default App;
