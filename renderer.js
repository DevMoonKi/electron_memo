const { remote, ipcRenderer } = require('electron')
const { BrowserWindow } = require('electron').remote
const path = require('path')
const url = require('url')
const $ = require('jquery')

const { Menu, MenuItem, app } = remote

const menu = new Menu()


// 오른쪽 클릭 메뉴
let win
let curtWin = remote.getCurrentWindow()
let colorCode
let winKey;

let newWindow = function () {
    colorCode = "#" + Math.round(Math.random() * 0xFFFFFF).toString(16)
    ipcRenderer.send('new-window', {
        x: curtWin.getPosition()[0] + 100,
        y: curtWin.getPosition()[1] + 100,
        color: colorCode
    })
}

menu.append(new MenuItem(

    {
        label: '새로만들기', click() {
            newWindow()
        }
    }
))
menu.append(new MenuItem(
    {
        label: '종료', click() {
            curtWin.close()
        }
    }
))

$('.close-btn').click(function () {
    curtWin.close()
})

$('.new-btn').click(function () {
    ipcRenderer.send("new-btn", { msg: "new-btn click" });
    newWindow()
})

$('.always-on-top').click(function(){
    ipcRenderer.send('always-on-top', { msg: "항상 위 클릭" })
})


ipcRenderer.on("new-btn-reply", (event, obj) => {
    console.log(obj.msg)
});

window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    menu.popup(curtWin)
}, false)


var timer = 0

$('.note textarea').on('input',function(){

    clearTimeout(timer);
    timer = setTimeout( () => {

        ipcRenderer.send('save',$(this).val());

        //console.log($(this).val())

    },250);

    //timer = setTimeout()
    //ipcRenderer.on("save", (event, obj) => {
     //   console.log(obj.msg);
    //});

})

ipcRenderer.on('winKey', (event, key) => {

winKey = key;

})


