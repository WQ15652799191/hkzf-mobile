import React from "react";
import { Link } from "react-router-dom";
import NavHeader from "../../components/NavHeader";
import { Toast } from "antd-mobile";
// import axios from "axios";

// import "./index.scss";
import styles from "./index.module.css"
import Group from '../../assets/images/group.jpeg'

const BMapGL = window.BMapGL
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}

export default class Map extends React.Component {
    state = {
        houseList: [],
        isShowList: false
    }
    componentDidMount() {
        this.initMap()
    }
    initMap() {
        // 初始化地图示例
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

        let map = new BMapGL.Map("container");
        this.map = map
        // 设置中心点坐标
        // const point = new window.BMapGL.Point(116.404, 39.915);
        let myGeo = new BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, point => {
            if (point) {
                // const res = await axios.get(`http://localhost:8000/area/map?id=${value}`)
                // const res = require('../../assets/mock/areamap.json')
                // // console.log(res);
                // res.body.forEach(item => {
                //     // 创建覆盖物
                //     const {value, label: areaName, coord: {latitude, longitude}, count} = item
                //     const areaPoint = new BMapGL.Point(longitude, latitude)
                //     const opts = {
                //         position: areaPoint,
                //         offset: new BMapGL.Size(-35, -35)
                //     }
                //     const label = new BMapGL.Label('文本信息', opts)
                //     label.id = value
                //     label.setContent(`
                //     <div class="${styles.bubble}">
                //         <p class="${styles.name}">${areaName}</P>
                //         <p>${count}套</P>
                //     </div>
                // `)
                //     label.setStyle(labelStyle)
                //     label.addEventListener('click', () => {
                //         console.log(label.id);
                //         map.centerAndZoom(areaPoint, 13)
                //         map.clearOverlays()
                //     })
                //     map.addOverlay(label)
                // })
                // 初始化地图
                map.centerAndZoom(point, 11);
                map.addControl(new BMapGL.ScaleControl())
                map.addControl(new BMapGL.ZoomControl())

                this.renderOverlays(value)
            }
        }, label)
        map.addEventListener('movestart', () => {
            if (this.state.isShowList) {
                this.setState({
                    isShowList: false
                })
            }
        })
    }

    createCircle(point, name, count, id, zoom) {
        const opts = {
            position: point,
            offset: new BMapGL.Size(-35, -35)
        }
        const label = new BMapGL.Label('', opts)
        label.id = id
        label.setContent(`
                <div class="${styles.bubble}">
                    <p class="${styles.name}">${name}</P>
                    <p>${count}套</P>
                </div>
            `)
        label.setStyle(labelStyle)
        label.addEventListener('click', () => {
            this.map.clearOverlays()
            this.renderOverlays(id)
            this.map.centerAndZoom(point, zoom)
        })
        this.map.addOverlay(label)
    }
    createRect(point, name, count, id, zoom) {
        const opts = {
            position: point,
            offset: new BMapGL.Size(-50, -28)
        }
        const label = new BMapGL.Label('', opts)
        label.id = id
        label.setContent(`
                <div class="${styles.rect}">
                    <span class="${styles.housename}">${name}</span>
                    <span class="${styles.housenum}">${count}套</span>
                    <i class="${styles.arrow}"></i>
                </div>
            `)
        label.setStyle(labelStyle)
        this.map.centerAndZoom(point, zoom)
        label.addEventListener('click', (e) => {
            this.getHouseList(id)
            const target = e.domEvent.changedTouches[0]
            this.map.panBy(window.innerWidth / 2 - target.clientX, (window.innerHeight - 330) / 2 - target.clientY)
            this.setState({
                isShowList: true
            })
        })
        this.map.addOverlay(label)
    }
    createOverlays(data, zoom, type) {
        const { value, label: areaName, coord: { latitude, longitude }, count } = data
        const areaPoint = new BMapGL.Point(longitude, latitude)
        if (type === 'circle') {
            // 区和镇
            this.createCircle(areaPoint, areaName, count, value, zoom)
        } else {
            // 小区
            this.createRect(areaPoint, areaName, count, value, zoom)
        }
    }
    getTypeAndZoom() {
        let zoom = this.map.getZoom()
        let nextZoom, type;
        if (zoom >= 10 && zoom < 12) {
            // 下一个缩放级别
            nextZoom = 13
            // 绘制圆形覆盖物
            type = 'circle'
            return { nextZoom, type }
        } else if (zoom >= 12 && zoom < 14) {
            nextZoom = 15
            type = 'rect'
            return { nextZoom, type }
        } else if (zoom >= 14 && zoom < 16) {
            type = 'rect'
            return { nextZoom, type }
        }
    }
    renderOverlays(id) {
        Toast.loading('加载中···', 0, null, false)
        // const res = await axios.get(`http://localhost:8000/area/map?id=${id}`)
        let res = null
        if (id <= 3) {
            res = require('../../assets/mock/areamap.json')
            // res = require('../../assets/mock/areamap1.json')
        }
        if (id <= 6 && id > 3) {
            res = require('../../assets/mock/areamap1.json')
        }
        if (id <= 9 && id > 6) {
            res = require('../../assets/mock/areamap2.json')
        }
        Toast.hide()
        const data = res.body
        const { nextZoom, type } = this.getTypeAndZoom()
        data.forEach(item => {
            this.createOverlays(item, nextZoom, type)
        })
    }

    // 获取房源数据
    getHouseList(id) {
        // const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`)
        const res = require('../../assets/mock/houselist.json')
        this.setState({
            houseList: res.body.list
        })
    }

    renderHouseList() {
        return this.state.houseList.map(item => <div className={styles.house} key={item.houseCode}>
            <div className={styles.imgWrap}>
                <img className={styles.img} src={Group} alt=""></img>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{item.title}</h3>
                <div className={styles.desc}>{item.desc}</div>
                <div>
                    {
                        item.tags.map((tag, index) => {
                            const tagClass = 'tag' + (index + 1)
                            return (
                                <span key={tag} className={[styles.tag, styles[tagClass]].join(' ')}>{tag}</span>
                            )
                        })
                    }
                </div>
                <div className={styles.price}>
                    <span className={styles.priceNum}>{item.price}</span>元/月
                </div>
            </div>
        </div>)
    }

    render() {
        return <div className={styles.map}>
            <NavHeader>
                地图找房
            </NavHeader>
            <div id="container" className={styles.container}></div>

            <div className={[styles.houseList, this.state.isShowList ? styles.show : ''].join(' ')}>
                <div className={styles.titleWrap}>
                    <h1 className={styles.listTitle}>房屋列表</h1>
                    <Link className={styles.titleMore} to="/home/list">更多房源</Link>
                </div>

                <div className={styles.houseItems}>
                    {this.renderHouseList()}
                </div>
            </div>
        </div>
    }
}