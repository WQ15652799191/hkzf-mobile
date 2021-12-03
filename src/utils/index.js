// import axios from "axios";

export const getCurrentCity = () => {
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
    if (!localCity) {
        return new Promise((resolve, reject) => {
            const curCity = new window.BMapGL.LocalCity();
            // console.log(curCity);
            curCity.get(async res => {
                try {
                    // const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
                    let local = {
                        label: res.name,
                        value: 'wqwqwqwq'
                    }
                    console.log(local);
                    localStorage.setItem('hkzf_city', JSON.stringify(local))
                    resolve(local)
                } catch (e) {
                    reject(e)
                }
            })
        })
        // const local = {
        //     label: '北京',
        //     value: 'wqwqwqwq'
        // }
        // localStorage.setItem('hkzf_city', JSON.stringify(local))
        // return local
    } else {
        return Promise.resolve(localCity)
        // return localCity
    }
}