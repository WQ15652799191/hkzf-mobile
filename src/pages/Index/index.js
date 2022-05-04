import React from "react";
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';

import axios from "axios";

import Nav1 from '../../assets/images/home.png'
import Nav4 from '../../assets/images/house.png'
import Nav3 from '../../assets/images/map.png'
import Nav2 from '../../assets/images/qunzu.png'
import Swiper from '../../assets/images/swiper1.jpeg'
import Group from '../../assets/images/group.jpeg'

import './index.scss'


const navs = [
    {
        id: 1,
        img: Nav1,
        title: '整租',
        path: '/home/list'
    },
    {
        id: 2,
        img: Nav2,
        title: '合租',
        path: '/home/list'
    },
    {
        id: 3,
        img: Nav3,
        title: '地图找房',
        path: '/home/list'
    },
    {
        id: 4,
        img: Nav4,
        title: '去出租',
        path: '/home/list'
    }
]

// navigator.geolocation.getCurrentPosition(position => {
//     console.log(position);
// })

// QgsGzOC132sAEMfMaLv9VBspDI8XA1Dw   百度地图API密钥

export default class Index extends React.Component {
    state = {
        swipers: [
            {
                id: 1,
                src: Swiper,
                alt: ''
            },
            {
                id: 2,
                src: Swiper,
                alt: ''
            },
            {
                id: 3,
                src: Swiper,
                alt: ''
            }
        ],
        isSwiperLoaded: true,
        groups: [
            {
                id: 1,
                title: '家住回龙观',
                desc: '归属的感觉',
                imgSrc: Group
            },
            {
                id: 2,
                title: '宜居四五环',
                desc: '大都市生活',
                imgSrc: Group
            },
            {
                id: 3,
                title: '喧嚣三里屯',
                desc: '繁华的背后',
                imgSrc: Group
            },
            {
                id: 4,
                title: '毗邻十号线',
                desc: '交通发达',
                imgSrc: Group
            }
        ],
        news: [
            {
                id: 1,
                title: '置业选择|安贞西里 三室一厅 河间的古雅别院',
                from: '新华网',
                date: '两天前',
                imgSrc: Group
            },
            {
                id: 2,
                title: '置业选择|安贞西里 三室一厅 河间的古雅别院',
                from: '新华网',
                date: '两天前',
                imgSrc: Group
            },
            {
                id: 3,
                title: '置业选择|安贞西里 三室一厅 河间的古雅别院',
                from: '新华网',
                date: '两天前',
                imgSrc: Group
            }
        ],
        curCityname: '北京'
    }
    async getSwipers() {
        const res = await axios.get('http://localhost:8080/home/swiper')
        this.setState(() => {
            return {
                swipers: res.data.body,
                isSwiperLoaded: true
            }
        })
    }
    async getGroups() {
        const res = await axios.get('http://localhost:8080/home/groups', {
            params: 'AREA%7C88cff55c-aaa4-e2e0'
        })
        this.setState({
            groups: res.data.body
        })
    }
    renderSwipers() {
        return this.state.swipers.map(item =>
            <a
                key={item.id}
                href="http://www.alipay.com"
                style={{ display: 'inline-block', width: '100%', height: 212 }}
            >
                <img
                    src={item.src}
                    alt={item.alt}
                    style={{ width: '100%', height: 212, verticalAlign: 'top' }}
                />
            </a>
        )
    }
    renderNav() {
        return navs.map(item => (<Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
            <img src={item.img} alt=""></img>
            <h2>{item.title}</h2>
        </Flex.Item>))
    }
    renderNews() {
        return this.state.news.map(item => (
            <div className="news-item" key={item.id}>
                <div className="imgwrap">
                    <img className="img" src={item.imgSrc} alt=""></img>
                </div>
                <Flex className="content" direction="column" justify="between">
                    <h3 className="title">{item.title}</h3>
                    <Flex className="info" justify="between">
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                    </Flex>
                </Flex>
            </div>
        ))
    }
    componentDidMount() {
        // this.getSwipers()
        // this.getGroups()

        // 通过IP定位获取城市名称
        const curCity = new window.BMapGL.LocalCity();
        curCity.get(async res => {
            // const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
            console.log(res.name);
            const cur = JSON.parse(localStorage.getItem('hkzf_city'))
            const city = cur ? cur.label : res.name
            this.setState({
                curCityname: city
            })
        })
        // this.setState({
        //     curCityname: result.data.body.label
        // })
        
    }
    render() {
        return (
            <div className="index">
                <div className="swiper">
                    {this.state.isSwiperLoaded ? (
                        <Carousel
                            autoplay={true}
                            infinite
                            autoplayInterval={2000}
                        >
                            {this.renderSwipers()}
                        </Carousel>
                    ) : ('')}

                    <Flex className="search-box">
                        <Flex className="search">
                            <div className="location" onClick={() => this.props.history.push('/citylist')}>
                                <span className="name">{this.state.curCityname}</span>
                                <i className="iconfont icon-arrow"></i>
                            </div>
                            <div className="form" onClick={() => this.props.history.push('/search')}>
                                <i className="iconfont icon-search"></i>
                                <span className="text">请输入小区或地址</span>
                            </div>
                        </Flex>
                        <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')}></i>
                    </Flex>
                </div>

                <Flex className="nav">
                    {this.renderNav()}
                </Flex>

                <div className="group">
                    <h3 className="group-title">
                        租房小组 <span className="more">更多</span>
                    </h3>
                    <Grid data={this.state.groups} square={false} hasLine={false} columnNum={2} renderItem={(item) => (
                        <Flex className="group-item" justify="around" key={item.id}>
                            <div className="desc">
                                <p className="title">{item.title}</p>
                                <span className="info">{item.desc}</span>
                            </div>
                            <img src={item.imgSrc} alt=""></img>
                        </Flex>
                    )} />
                </div>

                <div className="news">
                    <h3 className="group-title">最新资讯</h3>
                    <WingBlank size="md">{this.renderNews()}</WingBlank>
                </div>
            </div>
        );
    }
}