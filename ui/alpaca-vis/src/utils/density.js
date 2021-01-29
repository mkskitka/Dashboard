    /***************************************************************************
     *
     *                       Density Plot Calculations 
     *
     /*************************************************************************/
    
    import { create, all } from 'mathjs'
    const config = { }
    const math = create(all, config)
    const BANDWIDTH = 1;
    var _ = require('lodash');
    
    // Function to compute density
    function kernelDensityEstimator(kernel, X) {
      return function(V) {
        return X.map(function(x) {
          return [x, math.mean( V.map(function(v) { return kernel(x - v); }))];
        });
      };
    }
    function kernelEpanechnikov(k) {
      return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
      };
    }
    // Function gets the scaled x values based on the number of ticks you want
    function Ticks(k, x_range, xScale) {
        let segment = x_range/k;
        let ticks = []
        for(let i=1; i<=k; i++){
            ticks.push(i*segment)
        }
        return ticks;
    }

    
    function calculateDensities(dataset, ticks) {
        let newDataset = []
        for (const [key, value] of Object.entries(dataset)) {
            var kde = kernelDensityEstimator(kernelEpanechnikov(BANDWIDTH), ticks)
            var density =  kde(value) // Y values
            density = density.map(function(d) {let obj={}; obj[key] = d[1]; return obj})
            newDataset.push(density)
        }
        return newDataset
    }

    function calulateMin(dataset) {
       let mins = []
        for (const value of Object.values(dataset)) {
            mins.push(Math.min(...value))
        }
        return Math.min(...mins)
    }

    function calulateMax(dataset) {
       let maxes = []
        for (const value of Object.values(dataset)) {
            maxes.push(Math.max(...value))
        }
        return Math.max(...maxes)
    }

    function mergeDatasets(dataset, ticks) {
        let newDataset = []
        for(let x=0; x<ticks.length; x++) {
            newDataset[x] = {}
            for(let i=0; i<dataset.length; i++) {
                newDataset[x] = {
                    ...newDataset[x],
                    ...dataset[i][x]
                }
            }
            newDataset[x].x = ticks[x]
        }
        newDataset = _.filter(newDataset, function(d) {
            let filtered = _.pickBy(d, function(value, key) {   return value !== 0;});
            if(Object.keys(filtered).length > 1){
                return true;
            }
            return false
        })
        return newDataset
    }
    
    export { kernelDensityEstimator, kernelEpanechnikov, Ticks, calculateDensities, calulateMin, calulateMax, mergeDatasets }