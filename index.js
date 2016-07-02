let rce = React.createElement.bind()
let rcc = React.createClass.bind()

let streams =  ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "thegreatbeim", "brunofin"]

let myGet = function (url, callback) {
    let xhr = new XMLHttpRequest()
    xhr.responseType = 'json'
    xhr.open('GET', url)
    xhr.onload = callback
    xhr.send()
}

let anim = function (obj, opt, time, callback){
    if (!obj.timer) {
        obj.timer = {}
    }
    for (let item in opt) {
        if (obj.timer[item]) {
            clearInterval(obj.timer[item])
        }
        let target = opt[item]
        let speed = (target - parseInt(obj.style[item])) / (time / 16.7 * 1000)
        console.log(item, obj.style[item], target, speed)
        obj.timer[item] = setInterval(function () {
            if ((speed > 0 && parseInt(obj.style[item]) >= target) || (speed < 0 && parseInt(obj.style[item]) <= target)) {
                clearInterval(obj.timer[item]);
            }
            else {
                if(speed > 0){
                    obj.style[item] = Math.ceil(parseInt(obj.style[item]) + speed)
                }
                else{
                    obj.style[item] = Math.floor(parseInt(obj.style[item]) + speed)
                }
            }
        }, 16.7)
    }
}

let total = rcc({
    getInitialState: function () {
        return {
            info: [],
            display: 'all'   
        }
    },
    componentDidMount: function () {
        let _this = this
        let info = []
        streams.forEach(function (value) {
            myGet('https://api.twitch.tv/kraken/streams/' + value, function (e) {
                if(e.target.status === 200){
                    let response = e.target.response
                    if(response.stream){
                        let channel = response.stream.channel
                        info.push({
                            online: true,
                            logo: channel.logo,
                            name: channel.name,
                            status: channel.status,
                            url: channel.url
                        })
                        _this.setState({info: info})
                    }
                    else{
                        myGet('https://api.twitch.tv/kraken/channels/' + value, function (e1) {
                            let channel = e1.target.response
                            info.push({
                                online: false,
                                logo: channel.logo,
                                name: channel.name,
                                status: 'Offline',
                                url: channel.url
                            })
                            _this.setState({info: info})
                        })
                    }    
                }
                else if (e.target.status === 422) {
                    info.push({
                        online: false,
                        logo: 'https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F',
                        name: value,
                        status: 'Account Closed',
                        url: 'https://www.twitch.tv/'
                    })
                    _this.setState({info: info})
                }
                
            })
            
        })
    },
    toggle: function (e) {
        let target = e.target
        console.log(target.style);
        let type = target.attributes['data-myname'].value
        this.setState({display: type})
    },
    mouseEnter: function (e) {
        let target = e.target
        if (target.attributes['data-myname'].value != this.state.display){
            while(target.tagName !== 'DIV'){
                target = target.parentNode
            }
            anim(target, {'right': '0'}, 0.5) 
        }

    },
    mouseLeave: function (e) {
        let target = e.target
        if (target.attributes['data-myname'].value != this.state.display){
            while(target.tagName !== 'DIV'){
                target = target.parentNode
            }
            anim(target, {'right': '-45'}, 0.5)            
        }
    },
    render: function () {
        let info = this.state.info
        let display = this.state.display
        let list = info.map((value, index) => {
            let idisplay = ''
            if(display !== 'all'){
                if(display === 'on'){
                    if(!value.online){
                        idisplay = 'none'
                    }
                }
                else{
                    if(value.online){
                        idisplay = 'none'
                    }
                }
            }
            return rce('div', {'key': 'info'+index, 'className': 'itemContainer', 'style': {'display': idisplay}},
                        rce('div', {'className': 'logo'}, 
                            rce('img', {'src': value.logo})
                        ),
                        rce('div', {'className': 'name'},
                            rce('a', {'href': value.url, 'target': '_blank'}, value.name)
                        ),
                        rce('div', {'className': 'status'}, value.status) 
                    )
        })
        return(
            rce('div', {'className': 'container'}, 
                rce('div', {'className': 'header'}, 
                    rce('div', {'className': 'header-h1'},
                        rce('h1', null, 'TWITCH STREAMERS')
                    ),
                    rce('div', {'className': 'header-toggle'},
                        rce('div', {'className': 'toggle', 'onClick': this.toggle, 'data-myname': 'all', 'style': (display === 'all') ? {'right': '0px'} : {'right': '-45px'}, 'onMouseEnter': this.mouseEnter, 'onMouseLeave': this.mouseLeave},
                            rce('b',{'data-myname': 'all'}, 'All')
                        ),
                        rce('div', {'className': 'toggle', 'onClick': this.toggle, 'data-myname': 'on', 'style': (display === 'on') ? {'right': '0px'} : {'right': '-45px'}, 'onMouseEnter': this.mouseEnter, 'onMouseLeave': this.mouseLeave},
                            rce('b',{'data-myname': 'on'}, 'On')
                        ),
                        rce('div', {'className': 'toggle', 'onClick': this.toggle, 'data-myname': 'off', 'style': (display === 'off') ? {'right': '0px'} : {'right': '-45px'}, 'onMouseEnter': this.mouseEnter, 'onMouseLeave': this.mouseLeave},
                            rce('b',{'data-myname': 'off'}, 'Off')
                        )
                    )
                ),
                rce('div', {'className': 'body'}, 
                    
                    list
                ),
                rce('div', {'className': 'footer'}, '')
            )
        )
    }
})


ReactDOM.render(rce(total, null), document.getElementById('content'))