import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import './App.css';
import { FileUtils } from './utils/file-utils';
import { DataUtils } from './utils/data-process'
import Sidebar from "./components/Sidebar/Sidebar";
import ClusterView from "./components/ClusterView/ClusterView";
import 'semantic-ui-css/semantic.min.css'

import {
	ADD_CLUSTER_GRAPH_DATA,
} from './redux/action-types';


function App() {
const dispatch = useDispatch()

  useEffect(() => {
    async function doImportCSV() {
        let fileImportPromise = FileUtils.importCSV("testing")
        const [res] = await Promise.all([fileImportPromise]);
        let dataStr = JSON.stringify(res.data);
        let data = JSON.parse(dataStr);
        if(data.length > 0) {
            console.log("all data (PRE initial processing): ", data)
            console.log(JSON.stringify(data[0]))
            console.log(JSON.stringify(data[1]))
        }
        let processedData = DataUtils.processRaw(data);
         if(data.length > 0) {
            console.log("all data (POST initial processing): ", data)
            console.log(JSON.stringify(data[0]))
            console.log(JSON.stringify(data[1]))
        }
        dispatch({ type: ADD_CLUSTER_GRAPH_DATA, data: processedData})
    }
    doImportCSV()
  }, []);

  return (
    <div className="App">
        <Sidebar/>
        <ClusterView/>
    </div>
  );
}

export default App;
