import React from "react";
import { NavBar } from "antd-mobile";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
// import "./index.scss"
import styles from "./index.module.css"

function NavHeader({children, history, onLeftClick}) {
    const defaultHandler = () => history.go(-1)
    return (
        <NavBar
            className={styles.navbar}
            mode="light"
            icon={<i className="iconfont icon-back"></i>}
            onLeftClick={onLeftClick || defaultHandler}
        >
            {children}
        </NavBar>
    )
}

NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func
}

export default withRouter(NavHeader)