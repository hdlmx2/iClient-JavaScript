/* COPYRIGHT 2017 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/


/**
 * Class: SuperMap.REST.TilesetsService
 * 切片列表信息查询服务类;即查询切片地图服务的切片列表，返回切片集名称、地图切片元数据信息、切片版本集信息
 *
 * Inherits from:
 *  - <SuperMap.CoreServiceBase>
 */
require('./CoreServiceBase');

SuperMap.REST.TilesetsService = SuperMap.Class(SuperMap.CoreServiceBase, {


    /**
     * Constructor: SuperMap.REST.TilesetsService
     * 切片列表信息查询服务类构造函数。
     *
     * Parameters:
     * url - {String} 地图服务地址。URL应为：
     * http://{服务器地址}:{服务端口号}/iserver/services/{服务名}/rest/maps/map；
     * 例如: "http://localhost:8090/iserver/services/test/rest/maps/tianlocal";
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * eventListeners - {Object} 需要被注册的监听器对象。
     */

    initialize: function (url, options) {
        SuperMap.ServiceBase.prototype.initialize.apply(this,arguments);
        var me = this;
        if (options) {
            SuperMap.Util.extend(me, options);
        }

    },

    /**
     * APIMethod: destroy
     * 释放资源，将引用的资源属性置空。
     */
    destroy: function () {
        SuperMap.CoreServiceBase.prototype.destroy.apply(this, arguments);
    },

    /**
     * APIMethod: processAsync
     * 负责将客户端的查询参数传递到服务端。
     */
    processAsync: function () {
        if (!this.url) {
            return;
        }
        var me = this;
        var end = me.url.substr(me.url.length - 1, 1);

        me.url = me.url + ((end === "/") ? "tilesets" : "/tilesets") + (this.isInTheSameDomain ? ".json?" : ".jsonp?");

        me.request({
            method: "GET",
            scope: me,
            success: me.serviceProcessCompleted,
            failure: me.serviceProcessFailed
        });
    },

    CLASS_NAME: "SuperMap.REST.TilesetsService"
});

module.exports = function (url, options) {
    return new SuperMap.REST.TilesetsService(url, options);
};