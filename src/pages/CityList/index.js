import React from "react";
import { Toast } from "antd-mobile";
import { List, AutoSizer } from "react-virtualized";
import NavHeader from "../../components/NavHeader";
import "./index.scss"
// import axios from "axios";
import { getCurrentCity } from "../../utils";



const TITLE_HEIGHT = 36
const NAME_HEIGHT = 50
const HOUSE_CITY = ['北京', '上海', '深圳', '广州']
const formatCitylist = (list) => {
    const cityList = {}
    // const cityIndex = []
    list.forEach(item => {
        const first = item.short.substr(0, 1)
        if (cityList[first]) {
            cityList[first].push(item)
        } else {
            cityList[first] = [item]
        }
    });
    const cityIndex = Object.keys(cityList).sort()
    return {
        cityList,
        cityIndex
    }
}

const formatCityIndex = (letter) => {
    switch (letter) {
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}

export default class CityList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cityList: {},
            cityIndex: [],
            activeIndex: 0
        }
        this.cityListComponent = React.createRef()
    }
    async componentDidMount() {
        await this.getCityLsit()
        // 调用这个方法时要保证List组件中已经有数据了，获取数据时异步的，如果组件中数据为空就会报错
        // 只要保证这个方法在获取数据之后调用即可
        this.cityListComponent.current.measureAllRows()
    }
    async getCityLsit() {
        // const res = await axios.get(`http://localhost:8080/area/city?level=1`)
        const res = require('../../assets/mock/citylist.json')
        const { cityList, cityIndex } = formatCitylist(res.data.body)

        // const hotRes = await axios.get(`http://localhost:8080/area/hot`)
        const hotRes = require('../../assets/mock/hotcity.json')
        cityList['hot'] = hotRes.data.body
        cityIndex.unshift('hot')

        const curCity = await getCurrentCity()
        cityList['#'] = [curCity]
        cityIndex.unshift('#')

        this.setState({
            cityIndex,
            cityList
        })
    }

    changeCity({label, value}) {
        if(HOUSE_CITY.indexOf(label) > -1) {
            localStorage.setItem('hkzf_city', JSON.stringify({label, value}))
            this.props.history.go(-1)
        } else {
            Toast.info('该城市暂无房源！', 1, null, false)
        }
    }
    rowRenderer = ({
        key, // Unique key within array of rows key值
        index, // 索引号
        isScrolling, // The List is currently being scrolled  当前项是否滚动中
        isVisible, // This row is visible within the List (eg it is not an overscanned row) 当前项在list中是可见的
        style, // Style object to be applied to row (to position it) 一定要给每一行数据添加该样式！！！作用指定每一行的位置
    }) => {
        const { cityIndex, cityList } = this.state
        const letter = cityIndex[index]
        return (
            <div key={key} style={style} className="city">
                <div className="title">{formatCityIndex(letter)}</div>

                {
                    cityList[letter].map(item =>
                            <div className="name" key={item.value} onClick={() =>{
                                this.changeCity(item)
                            }
                            }>{item.label}</div>
                        )
                }
            </div>
        );
    }
    getRowHeight = ({ index }) => {
        const { cityIndex, cityList } = this.state
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }
    renderCityIndex() {
        const { cityIndex, activeIndex } = this.state
        return cityIndex.map((item, index) => <li key={item} className="city-index-item" onClick={() => {
            // console.log(index);
            this.cityListComponent.current.scrollToRow(index)
        }}>
            <span className={activeIndex === index ? "index-active" : ""}>{item === "hot" ? "热" : item.toUpperCase()}</span>
        </li>)
    }
    onRowsRendered = ({ startIndex }) => {
        if (this.state.activeIndex !== startIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
    }
    render() {
        return (
            <div className="citylist">
                <NavHeader>城市选择</NavHeader>

                <AutoSizer>
                    {
                        ({ width, height }) => <List
                            ref={this.cityListComponent}
                            width={width}
                            height={height}
                            rowCount={this.state.cityIndex.length}
                            rowHeight={this.getRowHeight}
                            rowRenderer={this.rowRenderer}
                            onRowsRendered={this.onRowsRendered}
                            scrollToAlignment="start"
                        />
                    }
                </AutoSizer>
                <ul className="city-index">
                    {this.renderCityIndex()}
                </ul>
            </div>
        )
    }
}