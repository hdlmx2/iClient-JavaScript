require('../../../src/openlayers/services/SpatialAnalystService');
var request = require('request');

var originalTimeout, serviceResult;
var changchunServiceUrl = GlobeParameter.spatialAnalystURL_Changchun;

describe('openlayers_SpatialAnalystService_bufferAnalysis', function () {
    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        serviceResult = null;
    });
    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    var resultDataset = "BufferAnalystByDatasets_olTest";
    //缓冲区分析
    it('bufferAnalysis_byDataset_DATASET_ONLY', function (done) {
        var dsBufferAnalystParameters = new SuperMap.DatasetBufferAnalystParameters({
            dataset: "RoadLine2@Changchun",
            filterQueryParameter: new SuperMap.FilterParameter({
                attributeFilter: "NAME='团结路'"
            }),
            bufferSetting: new SuperMap.BufferSetting({
                endType: SuperMap.BufferEndType.ROUND,
                leftDistance: {value: 10},
                rightDistance: {value: 10},
                semicircleLineSegment: 10
            }),
            resultSetting: new SuperMap.DataReturnOption({
                expectCount: 2000,
                dataset: resultDataset,
                dataReturnMode: SuperMap.DataReturnMode.DATASET_ONLY,
                deleteExistResultDataset: true
            })
        });
        var spatialAnalystService = new ol.supermap.SpatialAnalystService(changchunServiceUrl);
        spatialAnalystService.bufferAnalysis(dsBufferAnalystParameters, function (result) {
            serviceResult = result;
        });
        setTimeout(function () {
            expect(serviceResult).not.toBeNull();
            expect(serviceResult.type).toBe('processCompleted');
            expect(serviceResult.result.succeed).toBeTruthy();
            expect(serviceResult.result.dataset).toEqual(resultDataset + "@Changchun");
            done();
        }, 8000);
    });

    //缓冲区分析
    it('bufferAnalysis_byDataset_RECORDSET_ONLY', function (done) {
        var dsBufferAnalystParameters = new SuperMap.DatasetBufferAnalystParameters({
            dataset: "RoadLine2@Changchun",
            filterQueryParameter: new SuperMap.FilterParameter({
                attributeFilter: "NAME='团结路'"
            }),
            bufferSetting: new SuperMap.BufferSetting({
                endType: SuperMap.BufferEndType.ROUND,
                leftDistance: {value: 10},
                rightDistance: {value: 10},
                semicircleLineSegment: 10
            })
        });
        var spatialAnalystService = new ol.supermap.SpatialAnalystService(changchunServiceUrl);
        spatialAnalystService.bufferAnalysis(dsBufferAnalystParameters, function (result) {
            serviceResult = result;
        });
        setTimeout(function () {
            expect(serviceResult).not.toBeNull();
            expect(serviceResult.type).toBe('processCompleted');
            expect(serviceResult.result.recordset.features).not.toBeNull();
            done();
        }, 8000);
    });

    it('bufferAnalysis_byGeometry', function (done) {
        var pointsList = [
            [2823.940, -4690.000],
            [3448.940, -4690.301],
            [3816.561, -3810.125],
            [3917.383, -3609.158],
            [3976.983, -3490.291],
            [4020.004, -4377.027],
            [4076.265, -4382.939],
            [4215.049, -4382.333],
            [4428.156, -4382.285],
            [4647.579, -4383.017],
            [4679.707, -4382.898],
            [4917.462, -4382.635],
            [5074.019, -4381.833],
            [5257.042, -4381.031],
            [5363.785, -4380.717],
            [5671.717, -4378.794],
            [5847.521, -4377.970],
            [5990.637, -4303.528],
            [6055.343, -4270.072],
            [6168.913, -4382.389],
            [6214.183, -4209.927],
            [6377.789, -4209.142],
            [6393.692, -4210.142],
            [6693.989, -4207.450],
            [6788.392, -4208.450],
            [6984.304, -4207.210],
            [7189.183, -4208.296],
            [7300.505, -4208.296],
            [7573.056, -4208.803],
            [7680.977, -4208.804],
            [7850.593, -4208.393],
            [8182.656, -4210.533],
            [8554.893, -4261.485]
        ];
        var roadLine = new ol.geom.LineString(pointsList);
        var geoBufferAnalystParams = new SuperMap.GeometryBufferAnalystParameters({
            sourceGeometry: roadLine,
            bufferSetting: new SuperMap.BufferSetting({
                endType: SuperMap.BufferEndType.ROUND,
                leftDistance: new SuperMap.BufferDistance({value: 250}),
                rightDistance: new SuperMap.BufferDistance({value: 250}),
                semicircleLineSegment: 10
            })
        });
        var bufferAnalystService = new ol.supermap.SpatialAnalystService(changchunServiceUrl);
        bufferAnalystService.bufferAnalysis(geoBufferAnalystParams, function (result) {
            serviceResult = result;
        });
        setTimeout(function () {
            try {
                expect(bufferAnalystService).not.toBeNull();
                expect(serviceResult).not.toBeNull();
                expect(serviceResult.type).toBe("processCompleted");
                expect(serviceResult.result).not.toBeNull();
                expect(serviceResult.result.succeed).toBe(true);
                var resultGeometry = serviceResult.result.resultGeometry;
                expect(resultGeometry.type).toBe("Feature");
                expect(resultGeometry.geometry).not.toBeNull();
                expect(resultGeometry.geometry.type).toEqual("MultiPolygon");
                var coordinates = resultGeometry.geometry.coordinates;
                expect(coordinates).not.toBeNull();
                expect(coordinates.length).toBeGreaterThan(0);
                for (var i = 0; i < coordinates[0][0].length; i++) {
                    expect(coordinates[0][0][i].length).toEqual(2);
                }
                done();
            } catch (exception) {
                console.log("'bufferAnalysis_byGeometry'案例失败" + exception.name + ":" + exception.message);
                expect(false).toBeTruthy();
                done();
            }
        }, 8000);
    });
    // 删除测试过程中产生的测试数据集
    it('delete test resources', function (done) {
        var testResult = GlobeParameter.datachangchunURL + resultDataset;
        request.delete(testResult);
        done();
    });
});